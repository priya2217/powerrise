const express = require("express");
const router = express.Router();
const WorkoutPlan = require("../models/WorkoutPlan");
const { protect } = require("../middleware/auth");

// @route   GET /api/workout-plans
// @desc    Get all workout plans for logged in user
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/workout-plans
// @desc    Create new workout plan
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { name, duration, exercises } = req.body;

    const plan = await WorkoutPlan.create({
      user: req.user._id,
      name,
      duration,
      exercises,
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/workout-plans/:id
// @desc    Update workout plan
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Workout plan not found" });
    }

    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedPlan = await WorkoutPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/workout-plans/:id
// @desc    Delete workout plan
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Workout plan not found" });
    }

    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await plan.deleteOne();

    res.json({ message: "Workout plan removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
