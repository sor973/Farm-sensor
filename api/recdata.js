const expressJS = require('express');
const router = expressJS.Router();

router.get("/",(req,res)=>{
    const data = req.body;
    res.json({message:"pong!"})
})

module.exports = router;