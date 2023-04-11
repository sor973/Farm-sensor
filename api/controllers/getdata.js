const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

exports.getData = async (req, res) => {
    try{
        console.log(req.body)
        const recData = await db.data.create({
             data: req.body,
            })
        res.json(recData);
    } catch(error) {
        res.status(400);
        res.json({
            error: "Bad Request Or Data not complete. ",
            message: error
        });
        console.log(error)
    }
};