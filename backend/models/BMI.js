const mongoose = require("mongoose");

const BMISchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  height: Number,
  weight: Number,
  bmi: Number,
  category: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BMI", BMISchema);
