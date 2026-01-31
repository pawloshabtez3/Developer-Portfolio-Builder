const { AppError } = require("../utils/appError");

const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(
      new AppError("Validation failed", 400, result.error.flatten())
    );
  }
  req.body = result.data;
  return next();
};

module.exports = { validateBody };
