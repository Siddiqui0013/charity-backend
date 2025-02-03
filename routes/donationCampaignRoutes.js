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

        let pictureUrl;
        if (req.file) {
            console.log(req.file);
            
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
            if (!cloudinaryResponse) {
                throw new Error("Failed to upload image");
            }
            pictureUrl = cloudinaryResponse.url;
        }

        const donation = new Donations({ 
            title, 
            description, 
            goal: Number(goal),
            picture: pictureUrl
        });

        const savedDonation = await donation.save();

        res.status(201).json({
            success: true,
            message: "Donation campaign created successfully.",
            data: savedDonation,
        });
    } catch (err) {
        console.error("Upload error:", err); // Add this for debugging
        res.status(500).json({
            success: false,
            message: "Failed to create donation campaign.",
            error: err.message,
        });
    }
});

router.get("/donations", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const per_page = parseInt(req.query.per_page) || 10;

        const skip = (page - 1) * per_page;

        const totalDonations = await Donations.countDocuments();

        const donations = await Donations.find()
            .skip(skip)
            .limit(per_page);

        res.status(200).json({
            success: true,
            message: "Donation campaigns fetched successfully.",
            current_page: page,
            per_page: per_page,
            total: totalDonations,
            total_pages: Math.ceil(totalDonations / per_page),
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

router.put("/donation/:id", verifyAdmin, upload.single("picture"), async (req, res) => {
    try {
        const { title, description, goal } = req.body;
        const donation = await Donations.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: `No donation campaign found with ID: ${req.params.id}`,
            });
        }

        const updateData = {
            ...(title && { title }),
            ...(description && { description }),
            ...(goal && { goal: Number(goal) })
        };

        if (req.file) {
            if (donation.picture) {
                const publicId = donation.picture.split("/").pop().split(".")[0];
                await deleteFromCloudinary(publicId);
            }
            const result = await uploadOnCloudinary(req.file.path);
            updateData.picture = result.url;
        }

        const updatedDonation = await Donations.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

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

router.delete("/donation/:id", verifyAdmin, async (req, res) => {
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
