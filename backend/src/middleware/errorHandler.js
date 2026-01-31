const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Server error";

  res.status(statusCode).json({
    error: {
      message,
      details: err.details || null,
    },
  });
};

module.exports = { errorHandler };
