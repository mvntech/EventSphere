const mongoose = require("mongoose");

const exhibitorApplicationSchema = new mongoose.Schema(
  {
    expo: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
    exhibitor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyDetails: {
      name: { type: String, required: true, trim: true },
      description: { type: String },
      website: { type: String, trim: true },
      logo: { type: String },
    },
    productsOrServices: [{ type: String, trim: true }],
    documents: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewNotes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExhibitorApplication", exhibitorApplicationSchema);
