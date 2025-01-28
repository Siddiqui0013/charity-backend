const express = require("express");
const router = express.Router();
const SocialEvent = require("../models/SocialEvent");

router.post("/social-events", async (req, res) => {
  try {
    const { title, date, author } = req.body;

    if (!title || !date || !author) {
      return res.status(400).json({
        success: false,
        message: "Title, date, and author are required.",
      });
    }

    const socialEvent = new SocialEvent({ title, date, author });
    await socialEvent.save();

    res.status(201).json({
      success: true,
      message: "Social event created successfully",
      socialEvent,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to create social event",
      error: err.message,
    });
  }
});

router.get("/social-events", async (req, res) => {
  try {
    const socialEvents = await SocialEvent.find();
    res.status(200).json({
      success: true,
      message: "Social events fetched successfully",
      totalEvents: socialEvents.length,
      socialEvents,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch social events",
      error: err.message,
    });
  }
});

router.get("/social-events/:id", async (req, res) => {
  try {
    const socialEvent = await SocialEvent.findById(req.params.id);

    if (!socialEvent) {
      return res.status(404).json({
        success: false,
        message: "Social event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Social event fetched successfully",
      socialEvent,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch social event",
      error: err.message,
    });
  }
});

router.put("/social-events/:id", async (req, res) => {
  try {
    const { title, date, author } = req.body;

    const updatedEvent = await SocialEvent.findByIdAndUpdate(
      req.params.id,
      { title, date, author },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Social event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Social event updated successfully",
      updatedEvent,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to update social event",
      error: err.message,
    });
  }
});

router.delete("/social-events/:id", async (req, res) => {
  try {
    const deletedEvent = await SocialEvent.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: "Social event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Social event deleted successfully",
      deletedEvent,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete social event",
      error: err.message,
    });
  }
});

module.exports = router;
