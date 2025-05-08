const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

// GET user profile
router.get("/profile", authMiddleware, async (req, res) => {
  res.json(req.user);
});

// PUT update profile
router.put("/profile", authMiddleware, async (req, res) => {
  const { fullName, email, mobileNumber, dateOfBirth } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({ message: "Full name and email are required." });
  }

  try {
    const user = await User.findById(req.user._id);
    user.fullName = fullName;
    user.email = email;
    user.mobileNumber = mobileNumber;
    user.dateOfBirth = dateOfBirth;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Profile update failed:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
