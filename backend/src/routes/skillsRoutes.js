const express = require("express");
const { z } = require("zod");
const { getSkills, updateSkills } = require("../controllers/skillsController");
const { validateBody } = require("../middleware/validate");
const { auth } = require("../middleware/auth");

const router = express.Router();

const skillsSchema = z.object({
  skills: z.array(z.string().min(1)).default([]),
});

router.get("/", auth, getSkills);
router.put("/", auth, validateBody(skillsSchema), updateSkills);

module.exports = router;
