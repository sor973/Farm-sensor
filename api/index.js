const expressJS = require('express');
const router = expressJS.Router();

// API Route Import
const test = require("./test");
const ping = require("./ping");
const data = require("./recdata");

// API Route Setting
router.use("/test",test);
router.use("/ping",ping);
router.use("/recdata",data);

// API Default Route
router.use("/", (req,res)=>{
    res.status(403);
    res.json({
        error: true,
        message: "Invalid API Path"
    });
});

module.exports = router;