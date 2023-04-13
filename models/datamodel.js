const mongoose = require("mongoose");

const dataSchema = mongoose.Schema(
  {
    slaveid: {
      type: Number,
      required: true,
    },
    tempAir: {
      type: Number,
      required: true,
      default: 0,
    },
    humidAir: {
      type: Number,
      required: true,
    },
    humidSoil: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      timezone: "Asia/Bangkok",
    },
  }
);

const Data = mongoose.model("Data", dataSchema);

module.exports = Data;
