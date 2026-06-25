// routes/profile.js (Simple version without database)
const express = require("express");
const router = express.Router();

// In-memory profile storage (for testing only)
const profiles = [];

// Get user profile (no auth required for testing)
router.get("/", (req, res) => {
  try {
    // For testing, return a default profile if none exists
    let profile = profiles[0];

    if (!profile) {
      // Return default profile
      profile = {
        id: "1",
        userId: "default-user",
        name: "Guest User",
        age: 25,
        height: 170,
        weight: 70,
        photo: "",
        updatedAt: new Date(),
      };
    }

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Create or update profile
router.post("/", (req, res) => {
  try {
    const { name, age, height, weight, photo } = req.body;

    // Find existing profile or create new one
    let profile = profiles[0];

    if (profile) {
      // Update existing profile
      profile.name = name || profile.name;
      profile.age = age || profile.age;
      profile.height = height || profile.height;
      profile.weight = weight || profile.weight;
      profile.photo = photo || profile.photo;
      profile.updatedAt = new Date();
    } else {
      // Create new profile
      profile = {
        id: Date.now().toString(),
        userId: "default-user",
        name: name || "Guest User",
        age: age || 0,
        height: height || 0,
        weight: weight || 0,
        photo: photo || "",
        updatedAt: new Date(),
      };
      profiles.push(profile);
    }

    console.log("Profile updated:", profile);

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
