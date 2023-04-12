const expressJS = require('express');
const router = expressJS.Router();
const Data = require('../../models/datamodel')

router.get("/", async (req, res) => {
    try {
        const latestData = await Data.find({}).sort({createdAt: -1}).limit(2);
        res.status(200).json(latestData);
        console.log(latestData);
    } catch (error) {
        res.status(400);
        res.json({
            error: "Bad Request Or Data not complete. ",
            message: error
        });
        console.log(error);
    }
});

module.exports = router;