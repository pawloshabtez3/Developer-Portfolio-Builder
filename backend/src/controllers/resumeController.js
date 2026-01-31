const User = require("../models/User");
const { AppError } = require("../utils/appError");
const { asyncHandler } = require("../utils/asyncHandler");
const { calculateCompletion } = require("../utils/completion");
const { enhanceResumeContent } = require("../services/geminiService");
const { generateResumePDF } = require("../services/pdfService");

const MINIMUM_COMPLETION = 70;

/**
 * Generate a resume PDF for the authenticated user
 * POST /api/resume/generate
 */
const generateResume = asyncHandler(async (req, res) => {
  // Fetch full user data
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Check profile completion
  const completion = calculateCompletion(user);
  if (completion < MINIMUM_COMPLETION) {
    throw new AppError(
      `Profile must be at least ${MINIMUM_COMPLETION}% complete to generate a resume. Current: ${completion}%`,
      400
    );
  }

  // Prepare user data for enhancement
  const userData = {
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio,
    location: user.location,
    linkedIn: user.linkedIn,
    github: user.github,
    portfolio: user.portfolio,
    skills: user.skills,
    projects: user.projects
      .filter((p) => p.visibility === "public")
      .sort((a, b) => a.order - b.order)
      .map((p) => ({
        title: p.title,
        description: p.description,
        liveUrl: p.liveUrl,
      })),
    experience: user.experience.sort((a, b) => a.order - b.order).map((e) => ({
      company: e.company,
      role: e.role,
      startDate: e.startDate,
      endDate: e.endDate,
    })),
  };

  // Enhance content with Gemini AI
  const enhancedContent = await enhanceResumeContent(userData);

  // Generate PDF
  const pdfBuffer = await generateResumePDF(userData, enhancedContent);

  // Set response headers for PDF download
  const filename = `${user.name?.replace(/\s+/g, "_") || "Resume"}_Resume.pdf`;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Length", pdfBuffer.length);

  // Send PDF buffer
  res.send(pdfBuffer);
});

module.exports = { generateResume };
