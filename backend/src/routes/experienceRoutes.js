const express = require("express");
const { z } = require("zod");
const {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperience,
} = require("../controllers/experienceController");
const { validateBody } = require("../middleware/validate");
const { auth } = require("../middleware/auth");

const router = express.Router();

const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional().or(z.literal("")),
});

const reorderSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1),
});

router.get("/", auth, getExperience);
router.post("/", auth, validateBody(experienceSchema), createExperience);
router.put("/reorder", auth, validateBody(reorderSchema), reorderExperience);
router.put("/:id", auth, validateBody(experienceSchema), updateExperience);
router.delete("/:id", auth, deleteExperience);

module.exports = router;
