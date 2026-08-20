const express = require("express");
const { sendMessage, getConversation } = require("../controllers/messageController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:userId", protect, getConversation);

module.exports = router;
