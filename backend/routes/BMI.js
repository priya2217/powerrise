// routes/bmi.js (Simple version without database)
const express = require("express");
const router = express.Router();

// In-memory storage for BMI records
const bmiRecords = [];

// Get all BMI records
router.get("/", (req, res) => {
  try {
    console.log("Fetching all BMI records...");
    res.json({
      success: true,
      count: bmiRecords.length,
      records: bmiRecords,
    });
  } catch (error) {
    console.error("Error fetching BMI records:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch BMI records",
    });
  }
});

// Get latest BMI record
router.get("/latest", (req, res) => {
  try {
    if (bmiRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No BMI records found",
      });
    }

    const latest = bmiRecords[bmiRecords.length - 1];

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

// Create BMI record
router.post("/", (req, res) => {
  try {
    const { height, weight, bmi, category } = req.body;

    if (!height || !weight || !bmi) {
      return res.status(400).json({
        success: false,
        message: "Please provide height, weight, and BMI",
      });
    }

    const newRecord = {
      id: Date.now().toString(),
      userId: "default-user",
      height,
      weight,
      bmi,
      category,
      createdAt: new Date(),
    };

    bmiRecords.push(newRecord);

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
