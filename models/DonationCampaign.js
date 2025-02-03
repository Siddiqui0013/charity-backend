const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  goal: {
    type: Number,
    required: true,
    min: 0,
  },
  reached: {
    type: Number,
    default: 0,
    min: 0,
  },
});

module.exports = mongoose.model("Donations", donationSchema);
