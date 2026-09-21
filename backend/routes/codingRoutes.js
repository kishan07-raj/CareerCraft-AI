const express = require('express');
const router = express.Router();
const {
  getCodingTests,
  getCodingTestById,
  createCodingTest,
  submitTestAnswer,
  getUserCodingProgress,
  getAIGuidance,
} = require('../controllers/codingController');

// Middleware to check authentication 
const { protect } = require('../middleware/auth'); 

// Public routes
router.get('/tests', getCodingTests);
router.get('/tests/:id', getCodingTestById);

// Protected routes
router.post('/tests', protect, createCodingTest);
router.post('/submit-answer', protect, submitTestAnswer);
router.get('/progress', protect, getUserCodingProgress);
router.get('/ai-guidance', protect, getAIGuidance);

module.exports = router;
