const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const auth = require("../middleware/auth");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// POST /api/ai-chat
router.post("/", auth, async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a message",
      });
    }

    console.log("AI chat request from user:", req.user.id);

    const systemPrompt = {
      role: "system",
      content:
        "You are Fitzy AI, a friendly and knowledgeable fitness assistant. " +
        "Answer questions about workouts, nutrition, recovery, and wellness. " +
        "Keep responses practical, encouraging, and concise.",
    };

    const messages = [
      systemPrompt,
      ...(Array.isArray(history) ? history.slice(-10) : []),
      {
        role: "user",
        content: message,
      },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    res.json({
      success: true,
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI chat error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get AI response",
    });
  }
});

module.exports = router;
