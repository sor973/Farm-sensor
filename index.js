const expressJS = require("express");
const app = expressJS();
const cors = require("cors");
const serve = require("./serve");
const api = require("./api");
const mongoose = require("mongoose");

require('dotenv').config();

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
  mongoose.set("strictQuery", false);
  mongoose
    .connect(
        DATABASE_URL
    )
    .then(() => {
      console.log("connected to MongoDB");
      app.listen(8000, () => {
        console.log(`Server is running on port 8000`);
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
