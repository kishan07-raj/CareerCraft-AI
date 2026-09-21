// Move recommendation logic from utils/recommendations.js to service layer
const User = require('../models/user');
const Job = require('../models/job');
const Course = require('../models/course');
const { generateCareerRoadmap, analyzeResume } = require('../config/openai');

class RecommendationService {
  static async getJobRecommendations(userId) {
    const user = await User.findById(userId).select('resume.skills');
    const userSkills = user.resume.skills || [];
    const jobs = await Job.find({}, { title: 1, company: 1, location: 1, requiredSkills: 1 });

    const recommendations = jobs.map(job => {
      const matchScore = this.calculateMatchScore(userSkills, job.requiredSkills);
      return {
        job,
        matchScore,
        matchingSkills: this.getMatchingSkills(userSkills, job.requiredSkills),
        missingSkills: this.getMissingSkills(userSkills, job.requiredSkills)
      };
    }).filter(r => r.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    return recommendations;
  }

  static async getSkillGapAnalysis(userId) {
    const user = await User.findById(userId).select('resume.skills');
    const jobs = await Job.find();
    
    const skillDemand = {};
    jobs.forEach(job => {
      job.requiredSkills.forEach(skill => {
        skillDemand[skill.toLowerCase()] = (skillDemand[skill.toLowerCase()] || 0) + 1;
      });
    });

    const userSkillsLower = user.resume.skills.map(s => s.toLowerCase());
    const gaps = Object.entries(skillDemand)
      .filter(([skill]) => !userSkillsLower.includes(skill))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill, demand]) => ({
        skill,
        demand,
        priority: demand > 5 ? 'high' : 'medium'
      }));

    return gaps;
  }

  static async getCareerRoadmap(userId) {
    const user = await User.findById(userId).select('resume profile');
    return generateCareerRoadmap({
      skills: user.resume.skills,
      experience: user.resume.experience,
      interests: user.profile.bio || ''
    });
  }

  static async recommendCourses(userId, skills) {
    const courses = await Course.find({
      skills: { $in: skills }
    }).sort({ rating: -1 }).limit(10);

    return courses;
  }

  static calculateMatchScore(userSkills, jobSkills) {
    const userLower = userSkills.map(s => s.toLowerCase());
    const jobLower = jobSkills.map(s => s.toLowerCase());
    const matches = jobLower.filter(skill => userLower.some(us => us.includes(skill) || skill.includes(us)));
    return jobLower.length > 0 ? Math.round((matches.length / jobLower.length) * 100) : 0;
  }

  static getMatchingSkills(userSkills, jobSkills) {
    const userLower = userSkills.map(s => s.toLowerCase());
    const jobLower = jobSkills.map(s => s.toLowerCase());
    return jobLower.filter(skill => userLower.some(us => us.includes(skill) || skill.includes(us)));
  }

  static getMissingSkills(userSkills, jobSkills) {
    const matching = this.getMatchingSkills(userSkills, jobSkills);
    return jobSkills.filter(skill => !matching.some(m => m.toLowerCase().includes(skill.toLowerCase())));
  }
}

module.exports = RecommendationService;

