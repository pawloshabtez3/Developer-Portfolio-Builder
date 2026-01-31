const express = require("express");
const { z } = require("zod");
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} = require("../controllers/projectsController");
const { validateBody } = require("../middleware/validate");
const { auth } = require("../middleware/auth");

const router = express.Router();

const urlField = z.string().url().optional().or(z.literal(""));

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  liveUrl: urlField,
  githubUrl: urlField,
  visibility: z.enum(["public", "private"]),
});

const reorderSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1),
});

router.get("/", auth, getProjects);
router.post("/", auth, validateBody(projectSchema), createProject);
router.put("/reorder", auth, validateBody(reorderSchema), reorderProjects);
router.put("/:id", auth, validateBody(projectSchema), updateProject);
router.delete("/:id", auth, deleteProject);

module.exports = router;
