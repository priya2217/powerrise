const mongoose = require("mongoose");

const WorkoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, default: "Workout" },
    duration: { type: Number, required: true }, // minutes
    calories: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Workout", WorkoutSchema);
