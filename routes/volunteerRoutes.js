const express = require("express");
const router = express.Router();
const Volunteer = require("../models/Volunteer");

router.post("/volunteers", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    const volunteer = new Volunteer({ title });
    await volunteer.save();

    res.status(201).json({
      success: true,
      message: "Volunteer created successfully",
      volunteer,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to create volunteer",
      error: err.message,
    });
  }
});

router.get("/volunteers", async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.status(200).json({
      success: true,
      message: "Volunteers fetched successfully",
      totalVolunteers: volunteers.length,
      volunteers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch volunteers",
      error: err.message,
    });
  }
});

router.get("/volunteers/:id", async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Volunteer fetched successfully",
      volunteer,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch volunteer",
      error: err.message,
    });
  }
});

router.put("/volunteers/:id", async (req, res) => {
  try {
    const { title } = req.body;

    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true, runValidators: true }
    );

    if (!updatedVolunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Volunteer updated successfully",
      updatedVolunteer,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to update volunteer",
      error: err.message,
    });
  }
});

router.delete("/volunteers/:id", async (req, res) => {
  try {
    const deletedVolunteer = await Volunteer.findByIdAndDelete(req.params.id);

    if (!deletedVolunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Volunteer deleted successfully",
      deletedVolunteer,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete volunteer",
      error: err.message,
    });
  }
});

module.exports = router;
