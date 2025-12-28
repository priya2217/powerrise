const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const { protect } = require("../middleware/auth");

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/profile
// @desc    Create or update user profile
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { name, age, height, weight, photo } = req.body;

    const profileFields = {
      user: req.user._id,
      name,
      age,
      height,
      weight,
      photo,
      updatedAt: Date.now(),
    };

    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create
    profile = await Profile.create(profileFields);
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
