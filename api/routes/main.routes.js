module.exports = app => {

    var router = require("express").Router();

    require("./new.routes.js")(app);

    router.get("/", (req, res) => {
        res.json({
            message: "Ready for request!"
        });
    });
    
    app.use('/',router);
}