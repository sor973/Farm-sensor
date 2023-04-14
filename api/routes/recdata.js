const expressJS = require('express');
const router = expressJS.Router();
const Data = require('../../models/datamodel')

router.post("/",async (req,res)=>{
    try {
        const data = await Data.create(req.body);
        res.status(200).json(data);
        // console.log(data)
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