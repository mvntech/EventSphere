const mongoose = require("mongoose");

const boothSchema = new mongoose.Schema(
  {
    expo: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
    boothNumber: { type: String, required: true, trim: true },
    size: { type: String, trim: true },
    // coordinates on the floor plan image, used to place the booth marker
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ["available", "reserved", "occupied"],
      default: "available",
    },
    exhibitor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    productsShowcased: [{ type: String, trim: true }],
    staffInfo: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

boothSchema.index({ expo: 1, boothNumber: 1 }, { unique: true });

module.exports = mongoose.model("Booth", boothSchema);
