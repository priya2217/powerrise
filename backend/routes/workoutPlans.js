// routes/workoutPlans.js (Simple version without database)
const express = require("express");
const router = express.Router();

// In-memory storage for workout plans
const workoutPlans = [
  {
    id: "1",
    userId: "default-user",
    name: "Beginner Full Body",
    exercises: [
      { exercise: "Push-ups", sets: 3, reps: 10, rest: "60s" },
      { exercise: "Squats", sets: 3, reps: 15, rest: "60s" },
      { exercise: "Plank", sets: 3, reps: 1, rest: "45s" },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    userId: "default-user",
    name: "Cardio Blast",
    exercises: [
      { exercise: "Running", sets: 1, reps: 30, rest: "120s" },
      { exercise: "Jump Rope", sets: 3, reps: 100, rest: "90s" },
      { exercise: "Cycling", sets: 1, reps: 20, rest: "60s" },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Get all workout plans
router.get("/", (req, res) => {
  try {
    console.log("Fetching all workout plans...");
    res.json({
      success: true,
      count: workoutPlans.length,
      plans: workoutPlans,
    });
  } catch (error) {
    console.error("Error fetching workout plans:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch workout plans",
    });
  }
});

// Get workout plan by ID
router.get("/:id", (req, res) => {
  try {
    const plan = workoutPlans.find((p) => p.id === req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    res.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("Error fetching workout plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch workout plan",
    });
  }
});

// Create new workout plan
router.post("/", (req, res) => {
  try {
    const { name, exercises } = req.body;

    if (!name || !exercises) {
      return res.status(400).json({
        success: false,
        message: "Please provide name and exercises",
      });
    }

    const newPlan = {
      id: Date.now().toString(),
      userId: "default-user",
      name,
      exercises,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    workoutPlans.push(newPlan);

    console.log("Workout plan created:", newPlan.name);

    res.status(201).json({
      success: true,
      message: "Workout plan created successfully",
      plan: newPlan,
    });
  } catch (error) {
    console.error("Error creating workout plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create workout plan",
    });
  }
});

// Update workout plan
router.put("/:id", (req, res) => {
  try {
    const planIndex = workoutPlans.findIndex((p) => p.id === req.params.id);

    if (planIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    workoutPlans[planIndex] = {
      ...workoutPlans[planIndex],
      ...req.body,
      updatedAt: new Date(),
    };

    res.json({
      success: true,
      message: "Workout plan updated successfully",
      plan: workoutPlans[planIndex],
    });
  } catch (error) {
    console.error("Error updating workout plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update workout plan",
    });
  }
});

// Delete workout plan
router.delete("/:id", (req, res) => {
  try {
    const planIndex = workoutPlans.findIndex((p) => p.id === req.params.id);

    if (planIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    workoutPlans.splice(planIndex, 1);

    res.json({
      success: true,
      message: "Workout plan deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting workout plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete workout plan",
    });
  }
});

module.exports = router;
