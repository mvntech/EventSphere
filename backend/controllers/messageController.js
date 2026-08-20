const Message = require("../models/Message");
const User = require("../models/User");

// POST /api/messages  [any logged-in user]
async function sendMessage(req, res) {
  const { receiver, content, expo } = req.body;

  if (!receiver || !content) {
    return res.status(400).json({ message: "receiver and content are required" });
  }

  if (String(receiver) === String(req.user._id)) {
    return res.status(400).json({ message: "You cannot message yourself" });
  }

  const recipient = await User.findById(receiver);
  if (!recipient) return res.status(404).json({ message: "Recipient not found" });

  const message = await Message.create({
    expo: expo || null,
    sender: req.user._id,
    receiver,
    content,
  });

  await message.populate("sender", "name email role company");

  req.app.get("io").to(String(receiver)).emit("newMessage", message);
  res.status(201).json({ message });
}

// GET /api/messages/:userId  — the conversation between the caller and that user
async function getConversation(req, res) {
  const otherUserId = req.params.userId;

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: otherUserId },
      { sender: otherUserId, receiver: req.user._id },
    ],
  })
    .populate("sender", "name email role company")
    .populate("receiver", "name email role company")
    .sort({ createdAt: 1 });

  // opening a thread marks the other side's messages as read
  await Message.updateMany(
    { sender: otherUserId, receiver: req.user._id, read: false },
    { read: true }
  );

  res.json({ count: messages.length, messages });
}

module.exports = { sendMessage, getConversation };
