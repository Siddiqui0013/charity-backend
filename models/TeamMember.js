const mongoose = require("mongoose");

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
        default: "https://i.pravatar.cc/300"
    },
    });

module.exports = mongoose.model("TeamMember", teamMemberSchema);