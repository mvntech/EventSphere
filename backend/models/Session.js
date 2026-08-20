const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    expo: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
    title: { type: String, required: true, trim: true },
    topic: { type: String, trim: true },
    speaker: { type: String, trim: true },
    location: { type: String, trim: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    capacity: { type: Number, default: 0 },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
