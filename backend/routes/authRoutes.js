const express = require('express');
const { register, login, verifyOtp, resendOtp, googleLogin } = require('../controllers/authController');

const router = express.Router();

// Register user
router.post('/register', register);

// Login user
router.post('/login', login);

// Verify OTP
router.post('/verify-otp', verifyOtp);

// Resend OTP
router.post('/resend-otp', resendOtp);

// Google login
router.post('/google-login', googleLogin);

module.exports = router;
