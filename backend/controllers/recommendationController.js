const RecommendationService = require('../services/recommendationService');
const { getCareerInsights, getJobRecommendations } = require('../utils/recommendations');

exports.getCareerInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const insights = await getCareerInsights(userId);
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching career insights' });
  }
};

exports.getJobRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendations = await getJobRecommendations(userId);
    res.json(recommendations.slice(0, 5));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job recommendations' });
  }
};
