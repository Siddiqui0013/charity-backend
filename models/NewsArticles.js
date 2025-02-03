const mongoose = require("mongoose");

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
  },

});

module.exports = mongoose.model("NewsArticle", newsArticleSchema);
