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

const newsArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: function () {
      return `https://placecats.com/${cats[Math.floor(Math.random() * cats.length)]}/300/200`;
    }
  },

});

module.exports = mongoose.model("NewsArticle", newsArticleSchema);
