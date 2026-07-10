const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (!err.isOperational) {
    console.error(err.stack);
  }

  if (err.isOperational) {
    return res.status(statusCode).json({ message: err.message });
  }

  res.status(statusCode).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
};

module.exports = errorHandler;
