const User = require("../models/User");
const { AppError } = require("../utils/appError");
const { asyncHandler } = require("../utils/asyncHandler");

const getProjects = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("projects");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const projects = [...user.projects].sort((a, b) => a.order - b.order);
  res.json({ data: projects });
});

const createProject = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const maxOrder = user.projects.reduce(
    (max, project) => Math.max(max, project.order || 0),
    0
  );

  const payload = {
    ...req.body,
    liveUrl: req.body.liveUrl || undefined,
    githubUrl: req.body.githubUrl || undefined,
    order: maxOrder + 1,
  };

  user.projects.push(payload);
  await user.save();

  const projects = [...user.projects].sort((a, b) => a.order - b.order);
  res.status(201).json({ data: projects });
});

const updateProject = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const project = user.projects.id(req.params.id);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const payload = {
    ...req.body,
    liveUrl: req.body.liveUrl || undefined,
    githubUrl: req.body.githubUrl || undefined,
  };

  Object.assign(project, payload);
  await user.save();

  const projects = [...user.projects].sort((a, b) => a.order - b.order);
  res.json({ data: projects });
});

const deleteProject = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const project = user.projects.id(req.params.id);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  project.deleteOne();
  await user.save();

  const projects = [...user.projects].sort((a, b) => a.order - b.order);
  res.json({ data: projects });
});

const reorderProjects = asyncHandler(async (req, res) => {
  const { orderedIds } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    throw new AppError("orderedIds must be a non-empty array", 400);
  }

  orderedIds.forEach((id, index) => {
    const project = user.projects.id(id);
    if (project) {
      project.order = index + 1;
    }
  });

  await user.save();
  const projects = [...user.projects].sort((a, b) => a.order - b.order);
  res.json({ data: projects });
});

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
};
