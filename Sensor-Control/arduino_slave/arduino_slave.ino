#include <SoftwareSerial.h>
#include "DHT.h"

// Define DHT11 
#define DHTPIN 12
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Define SoilMoisture
#define sensorPin A0
#define DRY 1023
#define WET 170

// Define the RS485 transceiver's direction control pin
#define RS485_DE_PIN 3
#define RS485_RX_PIN 6
#define RS485_TX_PIN 7 

// Create a SoftwareSerial object for RS485 communication
SoftwareSerial rs485Serial(RS485_RX_PIN, RS485_TX_PIN); // RX, TX

// Define the slave ID And do not use 0x01 is preserved for master
#define SLAVE_ID 0x03

// Define the packet size 
#define PACKET_BASE_SIZE 5

uint8_t tempIntPart,tempRemainderPart,humidIntPart,humidRemainderPart;
uint8_t address,functionCode,startAddr_MSB,startAddr_LSB,qtyReg_MSB,qtyReg_LSB,CRC_MSB,CRC_LSB,reqLength,reqStart;
int8_t indexMax = 0;
int8_t indexPacket = -1;
int8_t m_error = 0;
unsigned long prev_t;

uint8_t buf[64];
uint8_t reg[64] = {0,0,0,0,0,0};
 
void setup() {
  Serial.begin(9600);

  dht.begin();

  rs485Serial.begin(9600);
  pinMode(RS485_DE_PIN, OUTPUT);

}

void loop() {
  if (rs485Serial.available()>0) {
    recieveData();
    if (buf[0]==SLAVE_ID) {
      extractBuf();
      storeRegistervalues();
      sendRespond(); 
    }
  }
}

float readTempSensor() {
  float t = dht.readTemperature();
  if (isnan(t)) {
    Serial.println("Failed to read from DHT");
  }
  // Serial.println(t);
  return t;
}

float readHumidSensor() {
  float h = dht.readHumidity();
  if (isnan(h)) {
    Serial.println("Failed to read from DHT");
  }
  // Serial.println(h);
  return h;
}

float readSoilMoistureSensor() {
	int soilMoistureValue  = analogRead(sensorPin);
  float percentageHumidity = mapf(soilMoistureValue , WET, DRY, 100, 0);
  // Serial.println(soilMoistureValue);
  // Serial.println(percentageHumidity);
	return percentageHumidity;
}

void storeRegistervalues() {
  reg[0] = floor(readTempSensor());
  reg[1] = modulo(readTempSensor(),floor(readTempSensor()))*100;
  reg[2] = floor(readHumidSensor());
  reg[3] = modulo(readHumidSensor(),floor(readHumidSensor()))*100;
  reg[4] = floor(readSoilMoistureSensor());
  reg[5] = modulo(readSoilMoistureSensor(),floor(readSoilMoistureSensor()))*100;
}

double mapf(double val, double in_min, double in_max, double out_min, double out_max) {
    return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

float modulo(float dividend, float divisor) {
  float quotient = dividend / divisor;
  int integerPart = int(quotient); // Extract integer part
  float fractionalPart = quotient - integerPart; // Extract fractional part
  return fractionalPart * divisor; // Multiply fractional part with divisor
}

void recieveData() {
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
  // This section for keep data. Time between byte data are not over 500 ms. The data store in array buf[]. 
  prev_t = millis();                 
  while(rs485Serial.available() > 0) {   // If time between byte data  over 500 ms not accept.
    buf[indexMax++] = rs485Serial.read();
    while(rs485Serial.available() == 0) {
      if(millis()-prev_t > 100) {
        break; // no more data
      }
    }
  }
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
  
  int crcLSB = crc & 0xff;
  packet[len] = crcLSB;
  packet[len+1] = crcMSB;   
  return 0;
}

void printBuf() {
  for(int i=0;i<PACKET_BASE_SIZE+reqLength;i++){
    Serial.print(buf[i],HEX);
    Serial.print(" | ");
  }
  Serial.println();
}

void printRes(uint8_t* respondPacket) {
  for(int i = 0 ;i<PACKET_BASE_SIZE+reqLength;i++) {
    Serial.print(respondPacket[i],HEX);
    Serial.print(" | ");
  }
  Serial.println();
}

void printReg() {
  for(int i=0;i<8;i++) {
    Serial.print(reg[i]);
    Serial.print(" | ");
  }
  Serial.println();
}

void extractBuf() {
  if (buf[0]==SLAVE_ID) {
    address = buf[0];
    functionCode = buf[1];
    startAddr_MSB = buf[2];
    startAddr_LSB = buf[3];
    qtyReg_MSB = buf[4];
    qtyReg_LSB = buf[5];
    CRC_LSB = buf[6];
    CRC_MSB = buf[7];
    reqLength = concatByte(qtyReg_MSB,qtyReg_LSB);
    reqStart = concatByte(startAddr_MSB,startAddr_LSB);
  }
}

uint16_t concatByte(uint8_t MSB, uint8_t LSB) {
  String result = String(MSB,16) + String(LSB,16);
  uint16_t hexValue = strtol(result.c_str(), NULL, 16);
  return hexValue;
}

void createRespondPacket(uint8_t* respondPacket) {
  respondPacket[0]=address;
  respondPacket[1]=functionCode;
  respondPacket[2]=concatByte(qtyReg_MSB, qtyReg_LSB);
  for(int i=3; i<3+reqLength; i++) {
    respondPacket[i]=reg[reqStart];
    reqStart=reqStart+1;
  }
}

void sendRespond() {
  uint8_t respondPacket[PACKET_BASE_SIZE+reqLength];

  createRespondPacket(respondPacket);
  
  // CRC calculate
  MODBUS_CRC16_v1(respondPacket, PACKET_BASE_SIZE+reqLength-2);

  // printBuf();
  printRes(respondPacket);

  // Enable RS485 transmitter
  digitalWrite(RS485_DE_PIN, HIGH);
  delay(10);
  
  // Send request
  rs485Serial.write(respondPacket,PACKET_BASE_SIZE+reqLength);
  delay(10);
  
  // Disable RS485 transmitter
  digitalWrite(RS485_DE_PIN, LOW);
}