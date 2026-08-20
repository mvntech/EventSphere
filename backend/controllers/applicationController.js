const ExhibitorApplication = require("../models/ExhibitorApplication");
const Expo = require("../models/Expo");

// POST /api/applications  [exhibitor]
async function createApplication(req, res) {
  const { expo, companyDetails, productsOrServices, documents } = req.body;

  if (!expo || !companyDetails || !companyDetails.name) {
    return res.status(400).json({ message: "expo and companyDetails.name are required" });
  }

  const targetExpo = await Expo.findById(expo);
  if (!targetExpo) return res.status(404).json({ message: "Expo not found" });

  const existing = await ExhibitorApplication.findOne({ expo, exhibitor: req.user._id });
  if (existing) {
    return res.status(400).json({ message: "You have already applied to this expo" });
  }

  const application = await ExhibitorApplication.create({
    expo,
    exhibitor: req.user._id,
    companyDetails,
    productsOrServices,
    documents,
  });

  req.app.get("io").emit("applicationCreated", application);
  res.status(201).json({ application });
}

// GET /api/applications/mine  [exhibitor]
async function getMyApplications(req, res) {
  const applications = await ExhibitorApplication.find({ exhibitor: req.user._id })
    .populate("expo", "title startDate endDate location status")
    .sort({ createdAt: -1 });

  res.json({ count: applications.length, applications });
}

// GET /api/applications/expo/:expoId  [admin]  — ?status=pending to triage
async function getApplicationsByExpo(req, res) {
  const filter = { expo: req.params.expoId };
  if (req.query.status) filter.status = req.query.status;

  const applications = await ExhibitorApplication.find(filter)
    .populate("exhibitor", "name email company phone")
    .populate("reviewedBy", "name email")
    .sort({ createdAt: -1 });

  res.json({ count: applications.length, applications });
}

// PUT /api/applications/:id/status  [admin]
async function updateApplicationStatus(req, res) {
  const { status, reviewNotes } = req.body;

  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Status must be pending, approved or rejected" });
  }

  const application = await ExhibitorApplication.findById(req.params.id);
  if (!application) return res.status(404).json({ message: "Application not found" });

  application.status = status;
  application.reviewNotes = reviewNotes;
  application.reviewedBy = req.user._id;
  await application.save();

  // the exhibitor is listening on their own room, so the decision lands live
  req.app.get("io").to(String(application.exhibitor)).emit("applicationReviewed", application);
  res.json({ application });
}

module.exports = {
  createApplication,
  getMyApplications,
  getApplicationsByExpo,
  updateApplicationStatus,
};
