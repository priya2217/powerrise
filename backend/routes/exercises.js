// routes/exercises.js (FIXED - Consistent response format)
const express = require("express");
const router = express.Router();

// Sample exercises data
const sampleExercises = [
  {
    id: 1,
    name: "Running",
    category: "cardio",
    description: "Outdoor or treadmill running",
    duration: 30,
    calories: 300,
    difficulty: "beginner",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400",
    instructions: [
      "Warm up with 5 minutes of walking",
      "Start at a comfortable pace",
      "Maintain steady breathing",
      "Cool down with walking",
    ],
  },
  {
    id: 2,
    name: "Push-ups",
    category: "strength",
    description: "Upper body strength exercise",
    duration: 15,
    calories: 100,
    difficulty: "beginner",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
    instructions: [
      "Start in plank position",
      "Lower body until chest nearly touches floor",
      "Push back up to starting position",
      "Repeat for desired reps",
    ],
  },
  {
    id: 3,
    name: "Yoga",
    category: "flexibility",
    description: "Full body stretching and flexibility",
    duration: 45,
    calories: 150,
    difficulty: "beginner",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    instructions: [
      "Start with breathing exercises",
      "Move through basic poses",
      "Hold each pose for 30 seconds",
      "End with relaxation",
    ],
  },
  {
    id: 4,
    name: "Cycling",
    category: "cardio",
    description: "Indoor or outdoor cycling",
    duration: 40,
    calories: 350,
    difficulty: "intermediate",
    image: "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400",
    instructions: [
      "Adjust seat height properly",
      "Start with warm-up pace",
      "Increase intensity gradually",
      "Cool down for last 5 minutes",
    ],
  },
  {
    id: 5,
    name: "Squats",
    category: "strength",
    description: "Lower body strength exercise",
    duration: 20,
    calories: 120,
    difficulty: "beginner",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower body as if sitting in chair",
      "Keep knees behind toes",
      "Return to standing position",
    ],
  },
  {
    id: 6,
    name: "Swimming",
    category: "cardio",
    description: "Full body workout in water",
    duration: 30,
    calories: 250,
    difficulty: "intermediate",
    image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400",
    instructions: [
      "Start with warm-up laps",
      "Alternate between strokes",
      "Maintain steady pace",
      "Cool down with easy swimming",
    ],
  },
  {
    id: 7,
    name: "Plank",
    category: "strength",
    description: "Core strengthening exercise",
    duration: 10,
    calories: 50,
    difficulty: "beginner",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    instructions: [
      "Get into push-up position",
      "Rest on forearms instead of hands",
      "Keep body in straight line",
      "Hold position for 30-60 seconds",
    ],
  },
  {
    id: 8,
    name: "Jump Rope",
    category: "cardio",
    description: "High-intensity cardio exercise",
    duration: 15,
    calories: 200,
    difficulty: "intermediate",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
    instructions: [
      "Hold rope handles at hip level",
      "Jump with both feet together",
      "Land softly on balls of feet",
      "Maintain steady rhythm",
    ],
  },
];

// GET all exercises
router.get("/", (req, res) => {
  try {
    console.log("🏋️ Fetching all exercises...");
    res.json({
      success: true,
      count: sampleExercises.length,
      exercises: sampleExercises,
    });
  } catch (error) {
    console.error("❌ Error fetching exercises:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercises",
      error: error.message,
    });
  }
});

// GET exercise by ID
router.get("/:id", (req, res) => {
  try {
    const exercise = sampleExercises.find(
      (e) => e.id === parseInt(req.params.id)
    );

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    console.log("✅ Exercise found:", exercise.name);

    res.json({
      success: true,
      exercise,
    });
  } catch (error) {
    console.error("❌ Error fetching exercise:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercise",
      error: error.message,
    });
  }
});

// GET exercises by category
router.get("/category/:category", (req, res) => {
  try {
    const exercises = sampleExercises.filter(
      (e) => e.category.toLowerCase() === req.params.category.toLowerCase()
    );

    console.log(
      `✅ Found ${exercises.length} exercises in category: ${req.params.category}`
    );

    res.json({
      success: true,
      count: exercises.length,
      exercises,
    });
  } catch (error) {
    console.error("❌ Error fetching exercises by category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercises",
      error: error.message,
    });
  }
});

module.exports = router;
