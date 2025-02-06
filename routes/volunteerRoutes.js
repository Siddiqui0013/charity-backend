const express = require("express");
const router = express.Router();
const Volunteer = require("../models/Volunteer");
const verifyAdmin = require("../middleWare/verifyAdmin");
const { upload } = require("../middleWare/multer.middleware");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

router.post("/volunteer", verifyAdmin, upload.single("picture"), async (req, res) => {
  try {
      const { title } = req.body;

      if (!title) {
          return res.status(400).json({
              success: false,
              message: "Title is required.",
          });
      }

      const newVolunteer = new Volunteer({ title });

      if (req.file) {
          console.log("req.file", req.file);
          const result = await uploadOnCloudinary(req.file.path);
          newVolunteer.image = result.url;
      }

      const savedVolunteer = await newVolunteer.save();
      console.log("savedVolunteer", savedVolunteer);

      res.status(201).json({
          success: true,
          message: "Volunteer created successfully.",
          data: savedVolunteer,
      });
  } catch (err) {
      res.status(500).json({
          success: false,
          message: "An error occurred while creating the volunteer.",
          error: err.message,
      });
  }
});

router.get("/volunteers", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10;
    const skip = (page - 1) * per_page;

    const totalVolunters = await Volunteer.countDocuments(); 
    const volunteers = await Volunteer.find().skip(skip).limit(per_page);
    res.status(200).json({
      success: true,
      message: "Volunteers fetched successfully.",
      current_page: page,
      per_page: per_page,
      total: totalVolunters,
      total_pages: Math.ceil(totalVolunters / per_page),
      data: volunteers,
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch volunteers",
      error: err.message,
    });
  }
});

router.get("/volunteer/:id", async (req, res) => {
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

router.put("/volunteer/:id", verifyAdmin, upload.single("picture"), async (req, res) => {
  try {
    const { title } = req.body;
    console.log("title", title);

    const volunteer = await Volunteer.findById(req.params.id)

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    const updatedData = {
      ...{ title },
    }

    if (req.file) {
      console.log("req.file for update", req.file);
      if (volunteer.image) {
        console.log("volunteer.image for update", volunteer.image);
        const publicId = volunteer.image.split("/").pop().split(".")[0];
        await deleteFromCloudinary(publicId);
      }
      const result = await uploadOnCloudinary(req.file.path);
      updatedData.image = result.url;
    }
    else{
      console.log("Not updating image");
    }

    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      updatedData, 
      { new: true, runValidators: true }
    );
    console.log("updatedVolunteer", updatedVolunteer);
    res.status(200).json({
      success: true,
      message: "Volunteer updated successfully",
      data : updatedVolunteer,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to update volunteer",
      error: err.message,
    })
    console.log(err);
  }
});

router.delete("/volunteer/:id", verifyAdmin, async (req, res) => {
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

// Delete all entries
router.delete("/deleteVolunteers", async (req, res) => {
  try {
    const result = await Volunteer.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All entries have been deleted successfully.",
      deletedCount: result.deletedCount, 
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting entries.",
      error: err.message,
    });
  }
});

module.exports = router;
