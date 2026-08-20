const Session = require("../models/Session");
const Expo = require("../models/Expo");

// GET /api/sessions/expo/:expoId  — public schedule, ?search= matches title/topic/speaker
async function getSessionsByExpo(req, res) {
  const filter = { expo: req.params.expoId };

  if (req.query.search) {
    const term = new RegExp(req.query.search, "i");
    filter.$or = [{ title: term }, { topic: term }, { speaker: term }];
  }

  // attendees stay as raw ids so the public schedule never exposes who registered
  const sessions = await Session.find(filter).sort({ startTime: 1 });

  res.json({ count: sessions.length, sessions });
}

// POST /api/sessions  [admin]
async function createSession(req, res) {
  const { expo, title, startTime, endTime } = req.body;

  if (!expo || !title || !startTime || !endTime) {
    return res.status(400).json({ message: "expo, title, startTime and endTime are required" });
  }

  if (new Date(endTime) <= new Date(startTime)) {
    return res.status(400).json({ message: "endTime must be after startTime" });
  }

  const targetExpo = await Expo.findById(expo);
  if (!targetExpo) return res.status(404).json({ message: "Expo not found" });

  const session = await Session.create(req.body);

  req.app.get("io").emit("sessionCreated", session);
  res.status(201).json({ session });
}

// PUT /api/sessions/:id  [admin]
async function updateSession(req, res) {
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).json({ message: "Session not found" });

  const start = req.body.startTime || session.startTime;
  const end = req.body.endTime || session.endTime;
  if (new Date(end) <= new Date(start)) {
    return res.status(400).json({ message: "endTime must be after startTime" });
  }

  // attendees are managed through the bookmark route, not by a general edit
  delete req.body.attendees;
  delete req.body.expo;
  Object.assign(session, req.body);
  await session.save();

  const io = req.app.get("io");
  io.emit("sessionUpdated", session);
  // anyone who bookmarked this session gets a direct notice of the change
  session.attendees.forEach((attendeeId) => {
    io.to(String(attendeeId)).emit("bookmarkedSessionChanged", session);
  });

  res.json({ session });
}

// POST /api/sessions/:id/bookmark  [attendee]  — toggles bookmark/registration
async function toggleBookmark(req, res) {
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).json({ message: "Session not found" });

  const userId = String(req.user._id);
  const alreadyIn = session.attendees.some((id) => String(id) === userId);

  if (alreadyIn) {
    session.attendees = session.attendees.filter((id) => String(id) !== userId);
  } else {
    if (session.capacity > 0 && session.attendees.length >= session.capacity) {
      return res.status(400).json({ message: "This session is already full" });
    }
    session.attendees.push(req.user._id);
  }

  await session.save();

  req.app.get("io").emit("sessionUpdated", session);
  res.json({
    bookmarked: !alreadyIn,
    attendeeCount: session.attendees.length,
    session,
  });
}

module.exports = { getSessionsByExpo, createSession, updateSession, toggleBookmark };
