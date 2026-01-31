const User = require("../models/User");
const { AppError } = require("../utils/appError");
const { asyncHandler } = require("../utils/asyncHandler");
const { calculateCompletion } = require("../utils/completion");

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const completion = calculateCompletion(user);

  res.json({
    data: {
      name: user.name,
      username: user.username,
      role: user.role,
      bio: user.bio,
      completion,
    },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, username, role, bio } = req.body;

  const existingUsername = await User.findOne({
    username,
    _id: { $ne: req.user.id },
  });
  if (existingUsername) {
    throw new AppError("Username already in use", 400);
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, username, role, bio },
    { new: true }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const completion = calculateCompletion(user);

  res.json({
    data: {
      name: user.name,
      username: user.username,
      role: user.role,
      bio: user.bio,
      completion,
    },
  });
});

module.exports = { getProfile, updateProfile };
