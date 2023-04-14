const expressJS = require("express");
const router = expressJS.Router();
const User = require("../../models/usermodel");

router.get("/", async (req, res) => {
  try {
    const userdata = await User.findOne({ userid: 1 });
    res.status(200).json(userdata);
    // console.log("received req")
  } catch (error) {
    res.status(400).json({
      error: "Bad Request Or Data not complete. ",
      message: error,
    });
    console.log(error);
  }
});

module.exports = router;
