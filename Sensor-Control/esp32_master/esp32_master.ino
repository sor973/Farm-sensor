#include <SoftwareSerial.h>
#include <HTTPClient.h>

// Wifi ssd and wpa2 key
const char *ssid = "embedBas";
const char *password = "12345678";

// Replace with your server URL and endpoint
const char* serverName = "http://192.168.43.196:8000/api/recdata";

WiFiClient client;
unsigned int HalfSeconds = 0;

int8_t indexMax = 0;
int8_t indexPacket = -1;
int8_t m_error = 0;
unsigned long prev_t;

// Define the RS485 transceiver's direction control pin
#define RS485_DE_PIN 18
#define RS485_RX_PIN 19
#define RS485_TX_PIN 5 

// Create a SoftwareSerial object for RS485 communication
SoftwareSerial rs485Serial(RS485_RX_PIN, RS485_TX_PIN); // RX, TX

// Define the slave ID
#define MASTER_ID 0x01 // Master ID
#define SLAVE_1 0x02
#define SLAVE_2 0x03
#define SLAVE_NUMBER 2
#define PACKET_BASE_SIZE 5
#define PACKET_SIZE 8
#define PACKET_LENGTH 6

uint8_t buf[64];
float reg[SLAVE_NUMBER+2][64];

void setup() {
  Serial.begin(9600);
  rs485Serial.begin(9600);
  pinMode(RS485_DE_PIN, OUTPUT);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
   
  if (WiFi.status() == WL_CONNECTED) {
    requestToSlaves();
    httpPostToServer(SLAVE_1);
    httpPostToServer(SLAVE_2);
  } 
  delay(60000);
}

void httpPostToServer(uint8_t slave_id) {

  float tempAir = reg[slave_id][3]+(reg[slave_id][4]/100);
  float humidAir = reg[slave_id][5]+(reg[slave_id][6]/100);
  float humidSoil = reg[slave_id][7]+(reg[slave_id][8]/100);
  
  HTTPClient http;
  WiFiClient client;

  http.begin(serverName);
  http.addHeader("Content-Type", "application/json");
  
  String httpRequestData = "{\"slaveid\":" + String(slave_id) + ",\"tempAir\":" + String(tempAir) + ",\"humidAir\":" + String(humidAir) + ",\"humidSoil\":" + String(humidSoil) + "}";
  Serial.println(httpRequestData);
  int httpResponseCode = http.POST(httpRequestData);
  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);

  // Free resources
  http.end();
}

void requestToSlaves() {
  sendRequest(SLAVE_1, 0x03, 0x00, PACKET_LENGTH);
  recieveData(SLAVE_1,PACKET_LENGTH);
  printReg(SLAVE_1);

  sendRequest(SLAVE_2, 0x03, 0x00, PACKET_LENGTH);
  recieveData(SLAVE_2,PACKET_LENGTH);
  printReg(SLAVE_2);

}

void recieveData(int slave_id, int length) {
  indexMax = 0;
  indexPacket = -1;
  m_error = 0;
  unsigned long prev_t = millis();  //resopnse check, time is over 3 sec set error code = 1 (Timeout Error code) 
  while(rs485Serial.available() == 0) {
    if(millis() - prev_t > 3000) {
      m_error = 1;      // TIMEOUT
      return;
    }
  }
  prev_t = millis();                 // This section for keep data. Time between byte data are not over 500 ms. The data store in array buf[]. 
  while(rs485Serial.available() > 0) {   // If time between byte data  over 500 ms not accept.
    buf[indexMax++] = rs485Serial.read();
    while(rs485Serial.available() == 0) {
      if(millis()-prev_t > 500) {
        break;        // no more data
      }
    }
  }
  if (buf[0]==slave_id) {
    for(int i=0; i< PACKET_BASE_SIZE+length; i++) {
      reg[slave_id][i] = buf[i];
    }
  }
}

void printReg(int slave_id) {
  Serial.print("Reg ");
  Serial.print(slave_id);
  Serial.print(": ");
  for(int i=0;i<PACKET_BASE_SIZE+PACKET_LENGTH;i++){
    Serial.print((int) reg[slave_id][i],HEX);
    Serial.print(" | ");
  }
  Serial.println();
}

static uint16_t MODBUS_CRC16_v1( uint8_t* packet, unsigned int len ) {
  uint16_t crc = 0xFFFF;
  unsigned int i = 0;
  char bit = 0;
  for( i = 0; i < len; i++ ) {    
    // Serial.println(packet[i],HEX);
    crc ^= packet[i];
    for( bit = 0; bit < 8; bit++ ) {
      if( crc & 0x0001 ) {
        crc >>= 1;
        crc ^= 0xA001;
      }
      else {
        crc >>= 1;
      }
    }
  }
  int crcMSB = crc >> 8;
  
  int crcLSB =crc & 0xff;
  packet[len] = crcLSB;
  packet[len+1] = crcMSB;   
  return 0;
}

void sendRequest(uint8_t address,uint8_t funcitonCode, uint8_t registerAddress, uint8_t length) {
  uint8_t requestPacket[PACKET_SIZE] = { 
                                address, 
                                funcitonCode, 
                                registerAddress >> 8, 
                                registerAddress & 0xff, 
                                length>>8, 
                                length&0xff, 
                                0x00, 
                                0x00
                              };

  // CRC calculate
  MODBUS_CRC16_v1(requestPacket, PACKET_SIZE-2);

  // Enable RS485 transmitter
  digitalWrite(RS485_DE_PIN, HIGH);
  delay(10);
  
  // Send request
  rs485Serial.write(requestPacket,8);
  delay(10);
  
  // Disable RS485 transmitter
  digitalWrite(RS485_DE_PIN, LOW);
}