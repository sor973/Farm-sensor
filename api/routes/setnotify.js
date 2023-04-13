const expressJS = require('express');
const router = expressJS.Router();
const User = require('../../models/usermodel')

router.post("/",async (req,res)=>{
    try {
        const { userid, notify, tempAir, humidAir } = req.body;
        const filter = { userid };
        const update = { notify, tempAir, humidAir };
        const options = { new: true, upsert: true };
        const user = await User.findOneAndUpdate(filter, update, options);
        res.status(200).json(user);
        console.log(user)
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