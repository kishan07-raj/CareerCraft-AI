const rateLimit = require('express-rate-limit');

const createLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: message || 'Too many requests from this IP'
      });
    }
  });
};

// Login limiter
const loginLimiter = createLimiter(15 * 60 * 1000, 5, 'Too many login attempts, try again later');

// API limiter
const apiLimiter = createLimiter(15 * 60 * 1000, 100);

module.exports = { loginLimiter, apiLimiter };

