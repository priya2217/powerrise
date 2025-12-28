const express = require("express");
const router = express.Router();
const BMI = require("../models/BMI");
const { protect } = require("../middleware/auth");

// @route   GET /api/bmi
// @desc    Get user's BMI history
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const bmiRecords = await BMI.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(bmiRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bmi/latest
// @desc    Get user's latest BMI record
// @access  Private
router.get("/latest", protect, async (req, res) => {
  try {
    const latestBMI = await BMI.findOne({ user: req.user._id }).sort({
      createdAt: -1,
    });

    if (!latestBMI) {
      return res.status(404).json({ message: "No BMI record found" });
    }

    res.json(latestBMI);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/bmi
// @desc    Create new BMI record
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { height, weight, bmi, category } = req.body;

    const bmiRecord = await BMI.create({
      user: req.user._id,
      height,
      weight,
      bmi,
      category,
    });

    res.status(201).json(bmiRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
