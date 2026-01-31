const User = require("../models/User");
const { AppError } = require("../utils/appError");
const { asyncHandler } = require("../utils/asyncHandler");

const getSkills = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("skills");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.json({ data: user.skills });
});

const updateSkills = asyncHandler(async (req, res) => {
  const { skills } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { skills },
    { new: true }
  ).select("skills");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({ data: user.skills });
});

module.exports = { getSkills, updateSkills };
