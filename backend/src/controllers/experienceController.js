const User = require("../models/User");
const { AppError } = require("../utils/appError");
const { asyncHandler } = require("../utils/asyncHandler");

const getExperience = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("experience");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const experience = [...user.experience].sort((a, b) => a.order - b.order);
  res.json({ data: experience });
});

const createExperience = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const maxOrder = user.experience.reduce(
    (max, item) => Math.max(max, item.order || 0),
    0
  );

  const payload = {
    ...req.body,
    endDate: req.body.endDate ? req.body.endDate : null,
    order: maxOrder + 1,
  };

  user.experience.push(payload);
  await user.save();

  const experience = [...user.experience].sort((a, b) => a.order - b.order);
  res.status(201).json({ data: experience });
});

const updateExperience = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const item = user.experience.id(req.params.id);
  if (!item) {
    throw new AppError("Experience not found", 404);
  }

  const payload = {
    ...req.body,
    endDate: req.body.endDate ? req.body.endDate : null,
  };

  Object.assign(item, payload);
  await user.save();

  const experience = [...user.experience].sort((a, b) => a.order - b.order);
  res.json({ data: experience });
});

const deleteExperience = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const item = user.experience.id(req.params.id);
  if (!item) {
    throw new AppError("Experience not found", 404);
  }

  item.deleteOne();
  await user.save();

  const experience = [...user.experience].sort((a, b) => a.order - b.order);
  res.json({ data: experience });
});

const reorderExperience = asyncHandler(async (req, res) => {
  const { orderedIds } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    throw new AppError("orderedIds must be a non-empty array", 400);
  }

  orderedIds.forEach((id, index) => {
    const item = user.experience.id(id);
    if (item) {
      item.order = index + 1;
    }
  });

  await user.save();
  const experience = [...user.experience].sort((a, b) => a.order - b.order);
  res.json({ data: experience });
});

module.exports = {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperience,
};
