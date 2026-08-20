const Booth = require("../models/Booth");
const Expo = require("../models/Expo");
const User = require("../models/User");
const ExhibitorApplication = require("../models/ExhibitorApplication");

// GET /api/booths/expo/:expoId
// public: powers both the floor plan and the attendee-facing exhibitor search.
// ?status=available  ?search=robotics  (matches booth number, products, or exhibitor company/name)
async function getBoothsByExpo(req, res) {
  const { status, search } = req.query;
  const filter = { expo: req.params.expoId };

  if (status) filter.status = status;

  if (search) {
    const term = new RegExp(search, "i");
    const matchingExhibitors = await User.find({
      role: "exhibitor",
      $or: [{ name: term }, { company: term }],
    }).select("_id");

    filter.$or = [
      { boothNumber: term },
      { productsShowcased: term },
      { exhibitor: { $in: matchingExhibitors.map((u) => u._id) } },
    ];
  }

  const booths = await Booth.find(filter)
    .populate("exhibitor", "name email company profileImage")
    .sort({ boothNumber: 1 });

  res.json({ count: booths.length, booths });
}

// POST /api/booths/expo/:expoId  [admin]
async function createBooth(req, res) {
  const { boothNumber } = req.body;
  if (!boothNumber) {
    return res.status(400).json({ message: "boothNumber is required" });
  }

  const expo = await Expo.findById(req.params.expoId);
  if (!expo) return res.status(404).json({ message: "Expo not found" });

  const duplicate = await Booth.findOne({ expo: expo._id, boothNumber });
  if (duplicate) {
    return res.status(400).json({ message: "That booth number already exists for this expo" });
  }

  const booth = await Booth.create({ ...req.body, expo: expo._id });

  req.app.get("io").emit("boothCreated", booth);
  res.status(201).json({ booth });
}

// PUT /api/booths/:id  [admin, exhibitor]
// admins manage allocation; an exhibitor may only edit the booth they hold, and only its content.
async function updateBooth(req, res) {
  const booth = await Booth.findById(req.params.id);
  if (!booth) return res.status(404).json({ message: "Booth not found" });

  if (req.user.role === "exhibitor") {
    if (String(booth.exhibitor) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only edit a booth assigned to you" });
    }
    const { productsShowcased, staffInfo } = req.body;
    if (productsShowcased !== undefined) booth.productsShowcased = productsShowcased;
    if (staffInfo !== undefined) booth.staffInfo = staffInfo;
  } else {
    delete req.body.expo;
    Object.assign(booth, req.body);
  }

  await booth.save();

  req.app.get("io").emit("boothUpdated", booth);
  res.json({ booth });
}

// POST /api/booths/:id/reserve  [exhibitor]
async function reserveBooth(req, res) {
  const booth = await Booth.findById(req.params.id);
  if (!booth) return res.status(404).json({ message: "Booth not found" });

  if (booth.status !== "available") {
    return res.status(400).json({ message: "That booth is no longer available" });
  }

  // an exhibitor can only take a booth at an expo they have been approved for.
  const approved = await ExhibitorApplication.findOne({
    expo: booth.expo,
    exhibitor: req.user._id,
    status: "approved",
  });

  if (!approved) {
    return res.status(403).json({
      message: "You need an approved application for this expo before reserving a booth",
    });
  }

  const alreadyHeld = await Booth.findOne({ expo: booth.expo, exhibitor: req.user._id });
  if (alreadyHeld) {
    return res.status(400).json({
      message: `You already hold booth ${alreadyHeld.boothNumber} at this expo`,
    });
  }

  booth.exhibitor = req.user._id;
  booth.status = "reserved";
  await booth.save();

  req.app.get("io").emit("boothUpdated", booth);
  res.json({ booth });
}

module.exports = { getBoothsByExpo, createBooth, updateBooth, reserveBooth };
