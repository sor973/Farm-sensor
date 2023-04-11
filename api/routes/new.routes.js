module.exports = app => {
    require('dotenv').config();
    const create = require(`../controllers/recdata.js`);

    var router = require("express").Router();
    
    router.post("/recdata", create.receievedData);

    app.use('/new',router);
}