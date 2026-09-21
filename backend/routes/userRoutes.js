const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  registerUser, 
  loginUser, 
  getProfile, 
  updateProfile, 
  getStats 
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/stats', protect, getStats);

module.exports = router;
