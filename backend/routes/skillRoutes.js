const express = require('express');
const router = express.Router();
const { getUserSkills, createSkill, updateSkill, deleteSkill, getGapAnalysis } = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

// Public route - get skills for a user
router.get('/user/:userId', getUserSkills);

// Protected routes
router.get('/my-skills', protect, getUserSkills);
router.post('/', protect, createSkill);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);
router.get('/gap-analysis', protect, getGapAnalysis);

module.exports = router;
