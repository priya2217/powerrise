const mongoose = require("mongoose");

const workoutPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "Please add workout plan name"],
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "Please add duration"],
  },
  exercises: {
    type: String,
    required: [true, "Please add exercises"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("WorkoutPlan", workoutPlanSchema);
