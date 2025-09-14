/* server/src/middleware/error.js */
function notFound(req, res, next) {
  res.status(404).json({ message: `Not found: ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  // Mongoose CastError (invalid ObjectId) → 400
  if (err?.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  // ValidationError → 400
  if (err?.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  const status = err.status || err.statusCode || 500;
  const payload = {
    message: err.message || 'Internal Server Error',
  };

  // Show stack only in dev
  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }

  // Optional: log to server console
  // eslint-disable-next-line no-console
  console.error('💥 Error:', { url: req.originalUrl, status, message: payload.message, stack: payload.stack });

  res.status(status).json(payload);
}

module.exports = { notFound, errorHandler };
