const expressJS = require('express');
const router = expressJS.Router();

// API Route Import
const recdata = require("./routes/recdata");
const ping = require("./routes/ping");
// API Route Setting
router.use("/recdata",recdata);
router.use("/ping",ping);
// API Default Route
router.use("/", (req,res)=>{
    res.status(403);
    res.json({
        error: true,
        message: "Invalid API Path"
    });
});

module.exports = router;