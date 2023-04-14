# SMART FARM-SENSOR 

เป็นเว็บไซต์ที่สร้างขึ้นมาเพื่อ แสดงผลค่าอุณหภูมิในอากาศ ค่าความชื้นในอากาศ ค่าความชื้นในดิน และยังมีการแสดงผลกราฟอุณหภมิอากาศทุก ๆ ชั่วโมง โดยรับข้อมูลจาก ESP-32 ที่เป็นตัวเก็บข้อมูล

![dashboard-image](https://github.com/sor973/Farm-sensor/blob/main/public/dashboard.png?raw=true)

## ขั้นตอนการติดตั้ง package ต่างๆ ที่จำเป็นต้องใช้งาน
```bash
 npm install \
 npm run build
 ```
 
คำสั่งสำหรับเริ่มการทำงาน

```bash
npm run serve
```
เพื่อเริ่มการใช้งานในสถานะ **`user mode`** \
เปิด [http://localhost:8000](http://localhost:8000) เพื่อเข้าไปดูที่ browser ของคุณ

> **Note:** การใช้งานจำเป็นต้องสร้าง **`.env`** และกำหนดค่า **DATABASE_URL** และ **LINE_ACCESS_TOKEN**



