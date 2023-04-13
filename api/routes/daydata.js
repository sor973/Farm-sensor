const expressJS = require("express");
const router = expressJS.Router();
const Data = require("../../models/datamodel");

router.get("/", async (req, res) => {
  const start = new Date();
  start.setHours(start.getHours() - 24); // get data for the last 24 hours
  const end = new Date();
  try {
    const dayData = await Data.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
            hour: { $hour: "$createdAt" },
          },
          avgTemperature: { $avg: "$tempAir" },
        },
      },
      {
        $sort: {
          "_id.day": 1,
          "_id.hour": 1,
        },
      },
    ]);
    // Transform the data to the desired format
    const transformedData = dayData.map(({ _id, avgTemperature }) => {
      const day = `${_id.day} Day ${_id.hour} H`;
      return {
        x: day,
        y: avgTemperature,
      };
    });
    res.status(200).json(transformedData);
    console.log(transformedData);
  } catch (error) {
    res.status(400).json({
      error: "Bad Request Or Data not complete. ",
      message: error,
    });
    console.log(error);
  }
});

module.exports = router;
