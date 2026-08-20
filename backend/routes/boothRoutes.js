const express = require("express");
const {
  getBoothsByExpo,
  createBooth,
  updateBooth,
  reserveBooth,
} = require("../controllers/boothController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/expo/:expoId", getBoothsByExpo);
router.post("/expo/:expoId", protect, authorize("admin"), createBooth);
router.put("/:id", protect, authorize("admin", "exhibitor"), updateBooth);
router.post("/:id/reserve", protect, authorize("exhibitor"), reserveBooth);

module.exports = router;
