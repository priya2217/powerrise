const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  darkMode: { type: Boolean, default: false },
  notifications: { type: Boolean, default: false },
  publicProfile: { type: Boolean, default: true },
  emailUpdates: { type: Boolean, default: true },
  soundEffects: { type: Boolean, default: true },
  autoLogout: { type: Boolean, default: false },
  language: { type: String, default: "English" },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Settings", SettingsSchema);
