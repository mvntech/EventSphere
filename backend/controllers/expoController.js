const Expo = require("../models/Expo");
const Booth = require("../models/Booth");
const Session = require("../models/Session");
const ExhibitorApplication = require("../models/ExhibitorApplication");

// GET /api/expos  — supports ?status= and ?search= for the public browse page
async function getExpos(req, res) {
  const { status, search } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (search) {
    const term = new RegExp(search, "i");
    filter.$or = [{ title: term }, { theme: term }, { location: term }, { description: term }];
  }

  const expos = await Expo.find(filter)
    .populate("organizer", "name email")
    .sort({ startDate: 1 });

  res.json({ count: expos.length, expos });
}

// GET /api/expos/:id
async function getExpo(req, res) {
  const expo = await Expo.findById(req.params.id).populate("organizer", "name email");
  if (!expo) return res.status(404).json({ message: "Expo not found" });
  res.json({ expo });
}

// POST /api/expos  [admin]
async function createExpo(req, res) {
  const { title, description, location, startDate, endDate } = req.body;

  if (!title || !description || !location || !startDate || !endDate) {
    return res.status(400).json({
      message: "Title, description, location, startDate and endDate are required",
    });
  }

  if (new Date(endDate) < new Date(startDate)) {
    return res.status(400).json({ message: "endDate cannot be before startDate" });
  }

  const expo = await Expo.create({ ...req.body, organizer: req.user._id });

  req.app.get("io").emit("expoCreated", expo);
  res.status(201).json({ expo });
}

// PUT /api/expos/:id  [admin]
async function updateExpo(req, res) {
  const expo = await Expo.findById(req.params.id);
  if (!expo) return res.status(404).json({ message: "Expo not found" });

  const start = req.body.startDate || expo.startDate;
  const end = req.body.endDate || expo.endDate;
  if (new Date(end) < new Date(start)) {
    return res.status(400).json({ message: "endDate cannot be before startDate" });
  }

  // organizer is set at creation and must not be reassigned through a general update
  delete req.body.organizer;
  Object.assign(expo, req.body);
  await expo.save();

  req.app.get("io").emit("expoUpdated", expo);
  res.json({ expo });
}

// DELETE /api/expos/:id  [admin]
async function deleteExpo(req, res) {
  const expo = await Expo.findById(req.params.id);
  if (!expo) return res.status(404).json({ message: "Expo not found" });

  // remove everything hanging off this expo so no orphaned records are left behind
  await Booth.deleteMany({ expo: expo._id });
  await Session.deleteMany({ expo: expo._id });
  await ExhibitorApplication.deleteMany({ expo: expo._id });
  await expo.deleteOne();

  req.app.get("io").emit("expoDeleted", { _id: req.params.id });
  res.json({ message: "Expo and its booths, sessions and applications were deleted" });
}

module.exports = { getExpos, getExpo, createExpo, updateExpo, deleteExpo };
