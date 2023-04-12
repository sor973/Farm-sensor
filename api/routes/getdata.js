const expressJS = require('express');
const router = expressJS.Router();
const Data = require('../../models/datamodel')

router.get("/",async (req,res)=>{
    try {
        const getdata = await Data.find({});
        res.status(200).json(getdata);
        console.log(data)
    } catch (error) {
        res.status(400);
        res.json({
            error: "Bad Request Or Data not complete. ",
            message: error
        });
        console.log(error)
    }
})

module.exports = router;