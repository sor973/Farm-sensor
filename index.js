const expressJS = require("express");
const app = expressJS();
const cors = require("cors");
const serve = require("./serve");
const api = require("./api");
const mongoose = require("mongoose");
const Data = require("./models/datamodel");
const User = require("./models/usermodel");
const axios = require("axios");

require("dotenv").config();

const LINE_NOTIFY_API_URL = "https://notify-api.line.me/api/notify";
const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;
const DATABASE_URL = process.env.DATABASE_URL;
const CONFIG = {
  serve: false,
};

function handoff() {
  if (!CONFIG.serve) app.use(cors());
  app.use(expressJS.json());
  app.use("/api", api);
  if (CONFIG.serve) app.use(serve);
  else
    app.use("/", (req, res) => {
      res.status(403);
      res.json({ error: true, message: "This server only serve API." });
    });

  const interval = setInterval(async () => {
    try {
      // Query the database for the desired data
      const data = await Data.find({}).sort({ createdAt: -1 }).limit(2);
      const status = await User.find({ userid: 1 });

      if (status[0].notify == true) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].tempAir > status[0].tempAir) {
            const message = `โรงเรือน ${data[i].slaveid} อุณหภูมิสูงเกิน ${status[0].tempAir} องศา!!`;
            const headers = {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
            };
            const params = new URLSearchParams();
            params.append("message", message);

            const response = await axios.post(LINE_NOTIFY_API_URL, params, {
              headers,
            });
            console.log("Line notification sent:", response.data);
          } else {
            console.log("อุณหภูมิในโรงเรือนปกติ");
          } 
          
          if (data[i].humidAir < status[0].humidAir) {
            const message = `โรงเรือน ${data[i].slaveid} ความชื้นต่ำกว่า ${status[0].humidAir} เปอร์เซ็น!!`;
            const headers = {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
            };
            const params = new URLSearchParams();
            params.append("message", message);

            const response = await axios.post(LINE_NOTIFY_API_URL, params, {
              headers,
            });
            console.log("Line notification sent:", response.data);
          } else {
            console.log("ความชื้นในโรงเรือนปกติ");
          }
        }
      }
    } catch (err) {
      console.error("Error while checking database", err);
    }
  }, 1 * 30 * 1000); // 5 minutes in milliseconds

  mongoose.set("strictQuery", false);
  mongoose
    .connect(DATABASE_URL)
    .then(() => {
      console.log("connected to MongoDB");
      app.listen(8000, () => {
        console.log(`Web-App is running on port 8000`);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function startUpSequence(args = []) {
  if (args.includes("-serve")) CONFIG.serve = true;
  return handoff();
}

startUpSequence(process.argv.slice(2));
