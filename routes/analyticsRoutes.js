const express = require("express");
const router = express.Router();

const Books = require("../models/Book");
const Donations = require("../models/DonationCampaign");
const NewsArticles = require("../models/NewsArticles");
const SocialEvents = require("../models/SocialEvent");
const TeamMembers = require("../models/TeamMember");
const Volunteers = require("../models/Volunteer");

router.get("/count", async (req, res) => {
  try {
    const [
      totalDonations,
      totalBooks,
      totalNewsArticles,
      totalSocialEvents,
      totalVolunteers,
      totalTeamMembers
    ] = await Promise.all([
      Donations.countDocuments(),
      Books.countDocuments(),
      NewsArticles.countDocuments(),
      SocialEvents.countDocuments(),
      Volunteers.countDocuments(),
      TeamMembers.countDocuments()
    ]);

    const response = {
      success: true,
      message: "Counts fetched successfully",
      data: {
        totalDonations,
        // totalPayments,
        totalBooks,
        totalVolunteers,
        totalNewsArticles,
        totalSocialEvents,
        totalTeamMembers,
        // total: totalDonations + totalPayments + totalBooks + totalVolunteers + totalTeamMembers,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch counts",
      error: err.message,
    });
  }
});

module.exports = router;
