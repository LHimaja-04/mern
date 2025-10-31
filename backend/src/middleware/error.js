// Centralized error handler
export function errorHandler(err, req, res, next) {
  console.error("ERR:", err);
  const code = err.status || 500;
  res.status(code).json({ message: err.message || "Server error" });
}
