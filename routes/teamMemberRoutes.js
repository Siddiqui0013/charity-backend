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
        const teamMembers = await TeamMember.find();

        if (teamMembers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No team members found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Team members fetched successfully.",
            total: teamMembers.length,
            data: teamMembers,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching team members.",
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

router.put("/team-member/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, image } = req.body;

        if (!name && !role && !image) {
            return res.status(400).json({
                success: false,
                message: "At least one field (name, role, or image) must be provided to update.",
            });
        }

        const updatedTeamMember = await TeamMember.findByIdAndUpdate(
            id,
            { name, role, image },
            { new: true, runValidators: true }
        );

        if (!updatedTeamMember) {
            return res.status(404).json({
                success: false,
                message: `No team member found with ID: ${id}`,
            });
        }

        res.status(200).json({
            success: true,
            message: "Team member updated successfully.",
            data: updatedTeamMember,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the team member.",
            error: err.message,
        });
    }
});

router.delete("/team-member/:id", async (req, res) => {
    try {
        const { id } = req.params;

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
