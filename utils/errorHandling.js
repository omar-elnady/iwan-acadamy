export const asyncHandler = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next).catch((error) => {
      const err = new Error(error.message || "Server Error");
      err.statusCode = 500;
      return next(err);
    });
  };
};

export const globalHandlingError = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({ message: error.message, error, stack: error.stack });
};
