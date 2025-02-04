const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("Volunteer", volunteerSchema); 
