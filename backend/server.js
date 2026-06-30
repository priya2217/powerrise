// server.js (FIXED VERSION)
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
const authRoutes = require("./routes/auth");
const exerciseRoutes = require("./routes/exercises");
const profileRoutes = require("./routes/profile");
const workoutsRoutes = require("./routes/workouts");
const bmiRoutes = require("./routes/bmi");
const settingsRoutes = require("./routes/settings");
const aiChatRoutes = require("./routes/aiChat");

app.use("/api/ai-chat", aiChatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/workouts", workoutsRoutes);
app.use("/api/bmi", bmiRoutes);
app.use("/api/settings", settingsRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Fitness App API",
    endpoints: {
      test: "GET /api/test",
      signup: "POST /api/auth/signup",
      login: "POST /api/auth/login",
      exercises: "GET /api/exercises",
      profile: "GET /api/profile",
      updateProfile: "POST /api/profile",
      workoutPlans: "GET /api/workouts",
      createPlan: "POST /api/workouts",
      bmi: "GET /api/bmi",
      settings: "GET /api/settings",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("🚀 Server running successfully!");
  console.log("📡 URL: http://localhost:" + PORT);
  console.log("✅ Test: http://localhost:" + PORT + "/api/test");
  console.log("=".repeat(50));
});