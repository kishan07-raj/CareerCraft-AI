const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCareerInsights, getJobRecommendations } = require('../controllers/recommendationController');

// GET job recommendations
router.get('/jobs', protect, async (req, res) => {
  try {
    const recommendations = await RecommendationService.getJobRecommendations(req.user.id);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET skill recommendations
router.get('/skills', protect, async (req, res) => {
  try {
    const gaps = await RecommendationService.getSkillGapAnalysis(req.user.id);
    res.json(gaps);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET learning path
router.get('/roadmap', protect, async (req, res) => {
  try {
    const roadmap = await RecommendationService.getCareerRoadmap(req.user.id);
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET career insights
router.get('/insights', protect, async (req, res) => {
  try {
    const insights = await RecommendationService.getCareerInsights(req.user.id); // Add method if needed
    res.json(insights);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
