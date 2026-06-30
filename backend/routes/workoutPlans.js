// routes/workouts.js
const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");
const auth = require("../middleware/auth");

// Log a completed workout
router.post("/", auth, async (req, res) => {
  try {
    const { name, duration, calories } = req.body;

    if (!duration) {
      return res.status(400).json({
        success: false,
        message: "Please provide workout duration",
      });
    }

    const workout = await Workout.create({
      userId: req.user.id,
      name: name || "Workout",
      duration,
      calories: calories || 0,
    });

    console.log("Workout logged for user:", req.user.id);

    res.status(201).json({
      success: true,
      message: "Workout logged successfully",
      workout,
    });
  } catch (error) {
    console.error("Workout log error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to log workout",
    });
  }
});

// Get dashboard stats: total workouts, calories burned, day streak, avg workout time
router.get("/stats", auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({
      completedAt: -1,
    });

    const totalWorkouts = workouts.length;
    const caloriesBurned = workouts.reduce(
      (sum, w) => sum + (w.calories || 0),
      0,
    );
    const avgWorkoutTime =
      totalWorkouts > 0
        ? Math.round(
            workouts.reduce((sum, w) => sum + (w.duration || 0), 0) /
              totalWorkouts,
          )
        : 0;

    // Calculate day streak: count consecutive days (including today) with at least one workout
    const dateStrings = new Set(
      workouts.map((w) => new Date(w.completedAt).toDateString()),
    );

    let streak = 0;
    let cursor = new Date();

    // if no workout today, streak still counts backward from yesterday
    if (!dateStrings.has(cursor.toDateString())) {
      cursor.setDate(cursor.getDate() - 1);
    }

    while (dateStrings.has(cursor.toDateString())) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    res.json({
      success: true,
      stats: {
        totalWorkouts,
        caloriesBurned,
        streak,
        avgWorkoutTime,
      },
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
});

module.exports = router;
