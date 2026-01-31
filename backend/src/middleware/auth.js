const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/appError");

const auth = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return next(new AppError("Authentication required", 401));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

module.exports = { auth };
