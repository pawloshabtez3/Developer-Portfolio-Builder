const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    liveUrl: { type: String, trim: true },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ExperienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    role: { type: String, trim: true },
    bio: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    // Contact fields for resume
    linkedIn: { type: String, trim: true },
    github: { type: String, trim: true },
    portfolio: { type: String, trim: true },
    location: { type: String, trim: true },
    skills: { type: [String], default: [] },
    projects: { type: [ProjectSchema], default: [] },
    experience: { type: [ExperienceSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
