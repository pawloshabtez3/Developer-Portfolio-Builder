const express = require("express");
const { z } = require("zod");
const { register, login, logout, me } = require("../controllers/authController");
const { validateBody } = require("../middleware/validate");
const { auth } = require("../middleware/auth");

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", auth, logout);
router.get("/me", auth, me);

module.exports = router;
