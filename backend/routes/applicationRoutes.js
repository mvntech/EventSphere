const express = require("express");
const {
  createApplication,
  getMyApplications,
  getApplicationsByExpo,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, authorize("exhibitor"), createApplication);
router.get("/mine", protect, authorize("exhibitor"), getMyApplications);
router.get("/expo/:expoId", protect, authorize("admin"), getApplicationsByExpo);
router.put("/:id/status", protect, authorize("admin"), updateApplicationStatus);

module.exports = router;
