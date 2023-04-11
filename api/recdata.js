const expressJS = require('express');
const router = expressJS.Router();

router.get("/",(req,res)=>{
    const data = req.body;
    console.log(data)
})

module.exports = router;