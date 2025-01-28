const express = require("express");
const router = express.Router();
const TeamMember = require("../models/TeamMember");

router.post("/team-members", async (req, res) => {
	try {
		const teamMember = new TeamMember(req.body);
		await teamMember.save();
		const response = {
			success: true,
			message: "Team member created successfully",
			teamMember,
		};
		res.status(201).json(response);
	} catch (err) {
		const response = {
			success: false,
			message: "Failed to create team member",
			error: err.message,
		};
		res.status(400).json(response);
	}
});

router.get("/team-members", async (req, res) => {
	try {
		const teamMembers = await TeamMember.find();
		const totalUsers = teamMembers.length;
		const response = {
			success: true,
			message: "Team members fetched successfully",
			totalUsers,
			teamMembers,
		};
		res.status(200).json(response);
	} catch (err) {
		const response = {
			success: false,
			message: "Failed to fetch team members",
			error: err.message,
		};
		res.status(500).json(response);
	}
});

router.delete("/team-members/:id", async (req, res) => {
	try {
		await TeamMember.findByIdAndDelete(req.params.id);
		res.status(204).send();
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;