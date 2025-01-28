const mongoose = require("mongoose");

const cats = [
  "millie_neo",
  "neo_banana",
  "millie",
  "neo",
  "neo_2",
  "bella",
  "poppy",
  "louie",
  "g",
];

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
    default: `https://placecats.com/${cats[Math.floor(Math.random() * cats.length)]}/300/200`,
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
