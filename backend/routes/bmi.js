// routes/bmi.js (MongoDB version)
const express = require("express");
const router = express.Router();
const BMI = require("../models/BMI");
const auth = require("../middleware/auth");

// Get all BMI records for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    console.log("Fetching BMI records for user:", req.user.id);

    const records = await BMI.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    console.error("Error fetching BMI records:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch BMI records",
    });
  }
});

// Get latest BMI record for the logged-in user
router.get("/latest", auth, async (req, res) => {
  try {
    const latest = await BMI.findOne({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    if (!latest) {
      return res.status(404).json({
        success: false,
        message: "No BMI records found",
      });
    }

    res.json({
      success: true,
      record: latest,
    });
  } catch (error) {
    console.error("Error fetching latest BMI:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch latest BMI",
    });
  }
});

// Create BMI record for the logged-in user
router.post("/", auth, async (req, res) => {
  try {
    const { height, weight, bmi, category } = req.body;

    if (!height || !weight || !bmi) {
      return res.status(400).json({
        success: false,
        message: "Please provide height, weight, and BMI",
      });
    }

    const newRecord = await BMI.create({
      userId: req.user.id,
      height,
      weight,
      bmi,
      category,
    });

    console.log("BMI record created:", newRecord);

    res.status(201).json({
      success: true,
      message: "BMI record created successfully",
      record: newRecord,
    });
  } catch (error) {
    console.error("Error creating BMI record:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create BMI record",
    });
  }
});

module.exports = router;
