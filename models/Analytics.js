const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
    donations: {
        type: Number,
        required: true,
    },
    books: {
        type: Number,
        required: true,
    },
    socialEvents: {
        type: Number,
        required: true,
    },
    newsArticles: {
        type: Number,
        required: true,
    },
    volunteers: {
        type: Number,
        required: true,
    },
    teamMembers: {
        type: Number,
        required: true,
    },
    totalDonations: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model("Analytics", analyticsSchema);