// models/WorkoutPlan.js
const mongoose = require("mongoose");

const ExerciseRowSchema = new mongoose.Schema(
  {
    exercise: { type: String, required: true },
    sets: { type: Number, default: 3 },
    reps: { type: Number, default: 10 },
    rest: { type: String, default: "60s" },
  },
  { _id: false },
);

const WorkoutPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    exercises: { type: [ExerciseRowSchema], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("WorkoutPlan", WorkoutPlanSchema);
