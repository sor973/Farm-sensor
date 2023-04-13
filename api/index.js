const expressJS = require('express');
const router = expressJS.Router();

// API Route Import
const recdata = require("./routes/recdata");
const getdata = require("./routes/getdata");
const setnotify = require("./routes/setnotify");
const getuser = require("./routes/getuser");
const daydata = require("./routes/daydata");

// API Route Setting
router.use("/recdata",recdata);
router.use("/getdata",getdata);
router.use("/setnotify",setnotify);
router.use("/getuser",getuser);
router.use("/daydata",daydata);

// API Default Route
router.use("/", (req,res)=>{
    res.status(403);
    res.json({
        error: true,
        message: "Invalid API Path"
    });
});

module.exports = router;