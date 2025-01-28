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

const socialEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    default: `https://placecats.com/${cats[Math.floor(Math.random() * cats.length)]}/300/200`,
  },
  date: {
    type: Date,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("SocialEvent", socialEventSchema);
