const User = require("../models/User");
const { AppError } = require("../utils/appError");
const { asyncHandler } = require("../utils/asyncHandler");

const getPublicPortfolio = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const projects = user.projects
    .filter((project) => project.visibility === "public")
    .sort((a, b) => a.order - b.order);

  const experience = [...user.experience].sort((a, b) => a.order - b.order);

  res.json({
    data: {
      profile: {
        name: user.name,
        username: user.username,
        role: user.role,
        bio: user.bio,
      },
      skills: user.skills,
      projects,
      experience,
    },
  });
});

module.exports = { getPublicPortfolio };
