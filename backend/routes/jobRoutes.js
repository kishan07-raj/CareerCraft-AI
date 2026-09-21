const express = require('express');
const router = express.Router();
const { getAllJobs, createJob, updateJob, deleteJob, getMatchingJobs, applyForJob, getUserApplications } = require('../controllers/jobController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getAllJobs);

// Protected routes
router.get('/match', protect, getMatchingJobs);
router.get('/applications', protect, getUserApplications);
router.post('/apply/:id', protect, applyForJob);

// Admin routes
router.post('/', protect, admin, createJob);
router.put('/:id', protect, admin, updateJob);
router.delete('/:id', protect, admin, deleteJob);

module.exports = router;
