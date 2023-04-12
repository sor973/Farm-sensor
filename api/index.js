const expressJS = require('express');
const router = expressJS.Router();

// API Route Import
const recdata = require("./routes/recdata");
const getdata = require("./routes/getdata");
const setnotify = require("./routes/setnotify");

// API Route Setting
router.use("/recdata",recdata);
router.use("/getdata",getdata);
router.use("/setnotify",setnotify);

// API Default Route
router.use("/", (req,res)=>{
    res.status(403);
    res.json({
        error: true,
        message: "Invalid API Path"
    });
});

module.exports = router;