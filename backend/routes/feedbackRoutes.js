const express = require("express");
const { createFeedback, getFeedback } = require("../controllers/feedbackController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createFeedback);
router.get("/", protect, authorize("admin"), getFeedback);

module.exports = router;
