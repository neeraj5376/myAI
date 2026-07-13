import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Home Route
app.get("/", (req, res) => {
  res.send("Groq AI Server Running 🚀");
});

// Test Route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API Working",
  });
});

// Chat Route
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "No response generated";

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Groq Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate response",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});