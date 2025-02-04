const express = require("express");
const router = express.Router();
const TeamMember = require("../models/TeamMember");
const verifyAdmin = require("../middleWare/verifyAdmin");
const { upload } = require("../middleWare/multer.middleware");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

router.post("/team-member", verifyAdmin, async (req, res) => {
    try {
        const { name, role, image } = req.body;

        if (!name || !role) {
            return res.status(400).json({
                success: false,
                message: "Name and role are required.",
            });
        }

        const newTeamMember = new TeamMember({ name, role, image  });
        if (req.file) {
            const result = await uploadOnCloudinary(req.file.path);
            newTeamMember.image = result.url;
        }
        const savedTeamMember = await newTeamMember.save();

        res.status(201).json({
            success: true,
            message: "Team member created successfully.",
            data: savedTeamMember,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the team member.",
            error: err.message,
        });
    }
});

router.get("/team-members", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const per_page = parseInt(req.query.per_page) || 10;

        const skip = (page - 1) * per_page;

        const totalMembers = await TeamMember.countDocuments();

        const memebers = await TeamMember.find()
            .skip(skip)
            .limit(per_page);

        res.status(200).json({
            success: true,
            message: "Team Members fetched successfully.",
            current_page: page,
            per_page: per_page,
            total: totalMembers,
            total_pages: Math.ceil(totalMembers / per_page),
            data: memebers,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch Team Members.",
            error: err.message,
        });
    }
});

router.get("/team-member/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const teamMember = await TeamMember.findById(id);
        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: `No team member found with ID: ${id}`,
            });
        }

        res.status(200).json({
            success: true,
            message: "Team member fetched successfully.",
            data: teamMember,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the team member.",
            error: err.message,
        });
    }
});

router.put("/team-member/:id", verifyAdmin, upload.single("picture"), async (req, res) => {
    try {
        const { title, description } = req.body;
        const teamMember = await TeamMember.findById(req.params.id);

        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: `No team member found with ID: ${req.params.id}`,
            });
        }

        const updateData = {
            ...(title && { title }),
            ...(description && { description }),
        };

        if (req.file) {
            if (teamMember.picture) {
                const publicId = donation.picture.split("/").pop().split(".")[0];
                await deleteFromCloudinary(publicId);
            }
            const result = await uploadOnCloudinary(req.file.path);
            updateData.image = result.url;
        }

        const updatedMember = await TeamMember.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Team member updated successfully.",
            data: updatedMember,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update member.",
            error: err.message,
        });
    }
});


router.delete("/team-member/:id", verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const teamMember = await TeamMember.findById(id);
        if (teamMember.picture) {
            const publicId = teamMember.picture.split("/").pop().split(".")[0];
            await deleteFromCloudinary(publicId);
        }

        const deletedTeamMember = await TeamMember.findByIdAndDelete(id);
        if (!deletedTeamMember) {
            return res.status(404).json({
                success: false,
                message: `No team member found with ID: ${id}`,
            });
        }

        res.status(200).json({
            success: true,
            message: "Team member deleted successfully.",
            data: deletedTeamMember,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the team member.",
            error: err.message,
        });
    }
});

module.exports = router;
