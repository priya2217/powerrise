const express = require("express");
const router = express.Router();
const Exercise = require("../models/Exercise");
const { protect } = require("../middleware/auth");

// @route   GET /api/exercises
// @desc    Get all exercises for logged in user
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const exercises = await Exercise.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/exercises
// @desc    Create new exercise
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { name, category, description, duration, video_url } = req.body;

    const exercise = await Exercise.create({
      user: req.user._id,
      name,
      category,
      description,
      duration,
      video_url,
    });

    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/exercises/:id
// @desc    Update exercise
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    // Check user ownership
    if (exercise.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedExercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedExercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/exercises/:id
// @desc    Delete exercise
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    // Check user ownership
    if (exercise.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await exercise.deleteOne();

    res.json({ message: "Exercise removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
