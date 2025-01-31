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

const teamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
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

module.exports = mongoose.model("TeamMember", teamMemberSchema);