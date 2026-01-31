const express = require("express");
const { generateResume } = require("../controllers/resumeController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// POST /api/resume/generate - Generate and download resume PDF
router.post("/generate", auth, generateResume);

module.exports = router;
