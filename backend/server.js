require("dotenv").config(); // Load .env variables
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Simple route
app.get("/", (req, res) => {
  res.send("Welcome to Powerrise Fitness API");
});

// JWT Example: generate token
app.post("/login", (req, res) => {
  const { username } = req.body;

  // Normally, you'd validate username/password from DB
  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET, // Use the strong secret from .env
    { expiresIn: "1h" }
  );

  res.json({ message: "Login successful", token });
});

// JWT Example: verify token
app.get("/protected", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    res.json({ message: "Protected data accessed", user: decoded });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
