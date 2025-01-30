const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const verifyAdmin = require("../middleWare/verifyAdmin");

const adminUsername = "admin";
const adminPassword = "admin112233";

router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (name !== adminUsername || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ name: adminUsername }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200)
    .cookie("authToken", token, { httpOnly: true, secure: true, sameSite: "none" })
    .json({
      success: true,
      message: "Admin authenticated successfully",
      token, 
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

router.post("/logout", verifyAdmin, async (req, res) => {
  try {
    res.status(200)
    .clearCookie("authToken", { httpOnly: true, secure: true, sameSite: "none" })
    .json({
      success: true,
      message: "Admin logged out successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;
