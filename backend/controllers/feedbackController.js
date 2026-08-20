const Feedback = require("../models/Feedback");

// POST /api/feedback  [any logged-in user]
async function createFeedback(req, res) {
  const { type, message, expo } = req.body;

  if (!["suggestion", "issue"].includes(type)) {
    return res.status(400).json({ message: "Type must be suggestion or issue" });
  }

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  const feedback = await Feedback.create({
    user: req.user._id,
    expo: expo || null,
    type,
    message,
  });

  req.app.get("io").emit("feedbackCreated", feedback);
  res.status(201).json({ feedback });
}

// GET /api/feedback  [admin]  — ?status= and ?type= to filter the queue
async function getFeedback(req, res) {
  const { status, type } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;

  const feedback = await Feedback.find(filter)
    .populate("user", "name email role")
    .populate("expo", "title")
    .sort({ createdAt: -1 });

  res.json({ count: feedback.length, feedback });
}

module.exports = { createFeedback, getFeedback };
