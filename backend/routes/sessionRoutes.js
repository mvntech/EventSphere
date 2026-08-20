const express = require("express");
const {
  getSessionsByExpo,
  createSession,
  updateSession,
  toggleBookmark,
} = require("../controllers/sessionController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/expo/:expoId", getSessionsByExpo);
router.post("/", protect, authorize("admin"), createSession);
router.put("/:id", protect, authorize("admin"), updateSession);
router.post("/:id/bookmark", protect, authorize("attendee"), toggleBookmark);

module.exports = router;
