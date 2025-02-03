const express = require("express");
const router = express.Router();
const Donations = require("../models/DonationCampaign");
const verifyAdmin = require("../middleWare/verifyAdmin");
const { upload } = require("../middleWare/multer.middleware");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

router.post("/donation", verifyAdmin, upload.single("picture"), async (req, res) => {
    try {
        const { title, description, goal } = req.body;

        if (!title || !description || !goal) {
            return res.status(400).json({
                success: false,
                message: "Title, description, and goal are required.",
            });
        }

        const donation = new Donations({ title, description, goal });

        if (req.file) {
            const result = await uploadOnCloudinary(req.file.path);
            donation.picture = result.url;
        }

        const savedDonation = await donation.save();

        res.status(201).json({
            success: true,
            message: "Donation campaign created successfully.",
            data: savedDonation,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to create donation campaign.",
            error: err.message,
        });
    }
});

router.get("/donations", async (req, res) => {
    try {
        const donations = await Donations.find();
        res.status(200).json({
            success: true,
            message: "Donation campaigns fetched successfully.",
            total: donations.length,
            data: donations,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch donation campaigns.",
            error: err.message,
        });
    }
});

router.get("/donation/:id", async (req, res) => {
    try {
        const donation = await Donations.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: `No donation campaign found with ID: ${req.params.id}`,
            });
        }

        res.status(200).json({
            success: true,
            message: "Donation campaign fetched successfully.",
            data: donation,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch donation campaign.",
            error: err.message,
        });
    }
});

router.put("/donation/:id", async (req, res) => {
    try {
        const { title, description, goal } = req.body;

        if (!title && !description && !goal) {
            return res.status(400).json({
                success: false,
                message: "At least one field (title, description, or goal) is required to update.",
            });
        }

        const updatedDonation = await Donations.findByIdAndUpdate(
            req.params.id,
            { title, description, goal },
            { new: true, runValidators: true }
        );

        if (!updatedDonation) {
            return res.status(404).json({
                success: false,
                message: `No donation campaign found with ID: ${req.params.id}`,
            });
        }

        res.status(200).json({
            success: true,
            message: "Donation campaign updated successfully.",
            data: updatedDonation,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update donation campaign.",
            error: err.message,
        });
    }
});

router.delete("/donation/:id", async (req, res) => {
    try {

        const donation = await Donations.findById(req.params.id);
        if (donation.picture) {
            const publicId = donation.picture.split("/").pop().split(".")[0];
            await deleteFromCloudinary(publicId, donation.picture);
        }

        const deletedDonation = await Donations.findByIdAndDelete(req.params.id);

        if (!deletedDonation) {
            return res.status(404).json({
                success: false,
                message: `No donation campaign found with ID: ${req.params.id}`,
            });
        }

        res.status(200).json({
            success: true,
            message: "Donation campaign deleted successfully.",
            data: deletedDonation,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to delete donation campaign.",
            error: err.message,
        });
    }
});

module.exports = router;
