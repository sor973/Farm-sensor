const expressJS = require('express');
const router = expressJS.Router();

// API Route Import
const recdata = require("./routes/recdata");
const getdata = require("./routes/getdata");

// API Route Setting
router.use("/recdata",recdata);
router.use("/getdata",getdata);

// API Default Route
router.use("/", (req,res)=>{
    res.status(403);
    res.json({
        error: true,
        message: "Invalid API Path"
    });
});

module.exports = router;