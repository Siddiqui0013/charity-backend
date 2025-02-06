const express = require("express");
const router = express.Router();
const SocialEvent = require("../models/SocialEvent");
const verifyAdmin = require("../middleWare/verifyAdmin");
const { upload } = require("../middleWare/multer.middleware");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

router.post("/social-events", verifyAdmin, upload.single("picture"), async (req, res) => {
  try {
    const { title, date, author } = req.body;

    if (!title || !date || !author) {
      return res.status(400).json({
        success: false,
        message: "Title, date, and author are required.",
      });
    }

    const newEvent = new SocialEvent({ title, date, author });
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path);
      newEvent.picture = result.url;
  }
    const socialEvent = await newEvent.save();

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
        const page = parseInt(req.query.page) || 1;
        const per_page = parseInt(req.query.per_page) || 9;

        const skip = (page - 1) * per_page;

        const socialEvents = await SocialEvent.countDocuments();

        const event = await SocialEvent.find()
            .skip(skip)
            .limit(per_page);

        res.status(200).json({
            success: true,
            message: "Social events fetched successfully.",
            current_page: page,
            per_page: per_page,
            total: socialEvents,
            total_pages: Math.ceil(socialEvents / per_page),
            data: event,
        });
    } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch social events",
      error: err.message,
    });
  }
});

router.get("/social-event/:id", async (req, res) => {
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

router.put("/social-event/:id", verifyAdmin, upload.single("picture"), async (req, res) => {
  try {
      const { title, date, author } = req.body;
      const event = await SocialEvent.findById(req.params.id);

      if (!event) {
          return res.status(404).json({
              success: false,
              message: `No event found with ID: ${req.params.id}`,
          });
      }

      const updateData = {
          ...(title && { title }),
          ...(date && { date }),
          ...(author && { author }),
      };

      if (req.file) {
          if (event.picture) {
              const publicId = event.picture.split("/").pop().split(".")[0];
              await deleteFromCloudinary(publicId);
          }
          const result = await uploadOnCloudinary(req.file.path);
          updateData.picture = result.url;
      }

      const updatedEvent = await SocialEvent.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true, runValidators: true }
      );

      res.status(200).json({
          success: true,
          message: "Book updated successfully.",
          data: updatedBook,
      });
  } catch (err) {
      res.status(500).json({
          success: false,
          message: "Failed to update book.",
          error: err.message,
      });
  }
});

router.delete("/social-events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const news = await SocialEvent.findById(id);
    if (news.picture) {
      const publicId = news.picture.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }
    const deletedEvent = await SocialEvent.findByIdAndDelete(id);

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
