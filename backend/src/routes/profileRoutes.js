const express = require("express");
const { z } = require("zod");
const { getProfile, updateProfile } = require("../controllers/profileController");
const { validateBody } = require("../middleware/validate");
const { auth } = require("../middleware/auth");

const router = express.Router();

const profileSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(3),
  role: z.string().min(1),
  bio: z.string().min(1),
});

router.get("/", auth, getProfile);
router.put("/", auth, validateBody(profileSchema), updateProfile);

module.exports = router;
