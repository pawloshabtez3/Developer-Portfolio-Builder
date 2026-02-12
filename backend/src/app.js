const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { AppError } = require("./utils/appError");
const { errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const skillsRoutes = require("./routes/skillsRoutes");
const projectsRoutes = require("./routes/projectsRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const publicRoutes = require("./routes/publicRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.get("/api/health", (req, res) => {
  res.json({ data: { status: "ok" } });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/resume", resumeRoutes);

app.use((req, res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(errorHandler);

module.exports = app;
