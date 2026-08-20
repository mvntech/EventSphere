const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    expo: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", default: null },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
