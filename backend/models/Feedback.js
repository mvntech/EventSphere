const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expo: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", default: null },
    type: { type: String, enum: ["suggestion", "issue"], required: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["open", "reviewed", "resolved"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
