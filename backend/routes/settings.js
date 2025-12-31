// routes/settings.js (Simple version without database)
const express = require("express");
const router = express.Router();

// In-memory storage for settings
let userSettings = {
  id: "1",
  userId: "default-user",
  darkMode: false,
  notifications: false,
  publicProfile: true,
  emailUpdates: true,
  soundEffects: true,
  autoLogout: false,
  language: "English",
  updatedAt: new Date(),
};

// Get user settings
router.get("/", (req, res) => {
  try {
    console.log("Fetching user settings...");
    res.json({
      success: true,
      settings: userSettings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
});

// Update settings
router.post("/", (req, res) => {
  try {
    userSettings = {
      ...userSettings,
      ...req.body,
      updatedAt: new Date(),
    };

    console.log("Settings updated:", userSettings);

    res.json({
      success: true,
      message: "Settings updated successfully",
      settings: userSettings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
});

module.exports = router;
