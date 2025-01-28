const express = require("express");
const router = express.Router();
const Donations = require("../models/DonationCampaign");

router.post("/donations", async (req, res) => {
  try {
    const { title, description, goal } = req.body;

    if (!title || !description || !goal) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and goal are required.",
      });
    }

    const donation = new Donations({
      title,
      description,
      goal,
    });

    await donation.save();

    const response = {
      success: true,
      message: "Donation campaign created successfully",
      donation,
    };

    res.status(201).json(response);
  } catch (err) {
    const response = {
      success: false,
      message: "Failed to create donation campaign",
      error: err.message,
    };
    res.status(400).json(response);
  }
});

router.get("/donations", async (req, res) => {
  try {
    const donations = await Donations.find();
    const totalDonations = donations.length;

    const response = {
      success: true,
      message: "Donation campaigns fetched successfully",
      totalDonations,
      donations,
    };

    res.status(200).json(response);
  } catch (err) {
    const response = {
      success: false,
      message: "Failed to fetch donation campaigns",
      error: err.message,
    };

    res.status(500).json(response);
  }
});

module.exports = router;
