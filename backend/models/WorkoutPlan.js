const mongoose = require("mongoose");

const WorkoutPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    exercises: [
      {
        exercise: String,
        sets: Number,
        reps: Number,
        rest: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkoutPlan", WorkoutPlanSchema);
