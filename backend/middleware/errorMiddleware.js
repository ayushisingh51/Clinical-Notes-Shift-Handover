const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Mongoose invalid ObjectId
  if (err.name === "CastError") {
    statusCode = 400;

    return res.status(statusCode).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;

    return res.status(statusCode).json({
      success: false,
      message: Object.values(err.errors)
        .map((error) => error.message)
        .join(", "),
    });
  }

  // Duplicate MongoDB value
  if (err.code === 11000) {
    statusCode = 400;

    const field = Object.keys(err.keyValue || {})[0];

    return res.status(statusCode).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Multer errors
  if (err.name === "MulterError") {
    statusCode = 400;

    return res.status(statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Normal errors
  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
  });
};

module.exports = errorHandler;