const mongoose = require("mongoose");

const expoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    theme: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    floorPlanImage: { type: String },
    status: {
      type: String,
      enum: ["draft", "published", "ongoing", "completed", "cancelled"],
      default: "draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expo", expoSchema);
