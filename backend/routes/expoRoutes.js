const express = require("express");
const {
  getExpos,
  getExpo,
  createExpo,
  updateExpo,
  deleteExpo,
} = require("../controllers/expoController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getExpos);
router.get("/:id", getExpo);
router.post("/", protect, authorize("admin"), createExpo);
router.put("/:id", protect, authorize("admin"), updateExpo);
router.delete("/:id", protect, authorize("admin"), deleteExpo);

module.exports = router;
