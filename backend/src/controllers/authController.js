const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { AppError } = require("../utils/appError");
const { asyncHandler } = require("../utils/asyncHandler");

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const normalizeEmail = (value = "") => value.trim().toLowerCase();
const normalizeUsername = (value = "") => value.trim().toLowerCase();

const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);
  const normalizedUsername = normalizeUsername(username);

  const existingEmail = await User.findOne({ email: normalizedEmail });
  if (existingEmail) {
    throw new AppError("Email already in use", 400);
  }

  const existingUsername = await User.findOne({ username: normalizedUsername });
  if (existingUsername) {
    throw new AppError("Username already in use", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    username: normalizedUsername,
    email: normalizedEmail,
    password: hashedPassword,
  });

  const token = signToken(user._id);
  setAuthCookie(res, token);

  res.status(201).json({
    data: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isBcryptHash =
    typeof user.password === "string" && user.password.startsWith("$2");

  let isMatch = false;
  if (isBcryptHash) {
    isMatch = await bcrypt.compare(password, user.password);
  } else {
    isMatch = password === user.password;
    if (isMatch) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }
  }

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = signToken(user._id);
  setAuthCookie(res, token);

  res.json({
    data: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });

  res.json({ data: { message: "Logged out" } });
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("name username email");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.json({ data: user });
});

module.exports = { register, login, logout, me };
