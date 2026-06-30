// routes/workoutPlans.js
const express = require("express");
const router = express.Router();
const WorkoutPlan = require("../models/WorkoutPlan");
const auth = require("../middleware/auth");

// GET /api/workout-plans -- list this user's plans
router.get("/", auth, async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, plans });
  } catch (error) {
    console.error("Fetch workout plans error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch workout plans",
    });
  }
});

// POST /api/workout-plans -- create a plan
router.post("/", auth, async (req, res) => {
  try {
    const { name, exercises } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Plan name is required",
      });
    }

    if (!Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Add at least one exercise",
      });
    }

    const plan = await WorkoutPlan.create({
      userId: req.user.id,
      name,
      exercises,
    });

    res.status(201).json({
      success: true,
      message: "Workout plan created",
      plan,
    });
  } catch (error) {
    console.error("Create workout plan error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create workout plan",
    });
  }
});

// PUT /api/workout-plans/:id -- update a plan
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, exercises } = req.body;

    const plan = await WorkoutPlan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, exercises },
      { new: true, runValidators: true },
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    res.json({ success: true, message: "Workout plan updated", plan });
  } catch (error) {
    console.error("Update workout plan error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update workout plan",
    });
  }
});

// DELETE /api/workout-plans/:id -- delete a plan
router.delete("/:id", auth, async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    res.json({ success: true, message: "Workout plan deleted" });
  } catch (error) {
    console.error("Delete workout plan error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete workout plan",
    });
  }
});

module.exports = router;
