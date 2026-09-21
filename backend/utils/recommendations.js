// AI Recommendation Engine
// Provides personalized recommendations based on user data and market trends

const Job = require('../models/job');
const User = require('../models/user');
const Skill = require('../models/skill');

// Get job recommendations based on user profile
const getJobRecommendations = async (userId) => {
  try {
    const user = await User.findById(userId);
    const userSkills = user.resume?.skills || [];
    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    
    // Get all jobs
    const jobs = await Job.find();
    
    // Calculate match scores
    const recommendations = jobs.map(job => {
      const jobSkillsLower = job.requiredSkills.map(s => s.toLowerCase());
      
      // Find matching skills
      const matchingSkills = jobSkillsLower.filter(skill => 
        userSkillsLower.some(userSkill => 
          userSkill.includes(skill) || skill.includes(userSkill)
        )
      );
      
      // Calculate match score
      const matchScore = jobSkillsLower.length > 0 
        ? Math.round((matchingSkills.length / jobSkillsLower.length) * 100)
        : 0;
      
      return {
        job: {
          id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          requiredSkills: job.requiredSkills
        },
        matchScore,
        matchingSkills,
        missingSkills: jobSkillsLower.filter(skill => !matchingSkills.includes(skill))
      };
    });
    
    // Sort by match score and return top recommendations
    return recommendations
      .filter(r => r.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);
  } catch (error) {
    throw error;
  }
};

// Get skill recommendations based on job market demand
const getSkillRecommendations = async (userId) => {
  try {
    const user = await User.findById(userId);
    const userSkills = (user.resume?.skills || []).map(s => s.toLowerCase());
    
    // Get all jobs to analyze demand
    const jobs = await Job.find();
    
    // Count skill demand
    const skillDemand = {};
    jobs.forEach(job => {
      job.requiredSkills.forEach(skill => {
        const skillLower = skill.toLowerCase();
        skillDemand[skillLower] = (skillDemand[skillLower] || 0) + 1;
      });
    });
    
    // Sort by demand and filter out skills user already has
    const recommendations = Object.entries(skillDemand)
      .filter(([skill]) => !userSkills.includes(skill))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill, demand]) => ({
        skill,
        demand,
        priority: demand > 5 ? 'high' : demand > 2 ? 'medium' : 'low'
      }));
    
    return recommendations;
  } catch (error) {
    throw error;
  }
};

// Get learning path recommendations
const getLearningPath = async (userId) => {
  try {
    const user = await User.findById(userId);
    const userSkills = (user.resume?.skills || []).map(s => s.toLowerCase());
    
    // Get high-demand skills user doesn't have
    const jobs = await Job.find();
    const skillDemand = {};
    jobs.forEach(job => {
      job.requiredSkills.forEach(skill => {
        const skillLower = skill.toLowerCase();
        skillDemand[skillLower] = (skillDemand[skillLower] || 0) + 1;
      });
    });
    
    const gaps = Object.entries(skillDemand)
      .filter(([skill]) => !userSkills.includes(skill))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    // Create learning path
    const learningPath = gaps.map(([skill, demand], index) => ({
      order: index + 1,
      skill,
      demand,
      estimatedTime: getEstimatedTime(skill),
      priority: index < 2 ? 'high' : 'medium'
    }));
    
    return learningPath;
  } catch (error) {
    throw error;
  }
};

// Estimate learning time based on skill complexity
const getEstimatedTime = (skill) => {
  const skillTimes = {
    'javascript': '2-3 months',
    'python': '3-4 months',
    'java': '3-4 months',
    'react': '2-3 months',
    'angular': '3-4 months',
    'vue': '2-3 months',
    'node': '2-3 months',
    'docker': '1-2 months',
    'kubernetes': '2-3 months',
    'aws': '3-4 months',
    'azure': '3-4 months',
    'gcp': '3-4 months',
    'machine learning': '6+ months',
    'deep learning': '6+ months',
    'data science': '6+ months'
  };
  
  return skillTimes[skill.toLowerCase()] || '2-3 months';
};

// Get career insights based on profile
const getCareerInsights = async (userId) => {
  try {
    const user = await User.findById(userId);
    const userSkills = user.resume?.skills || [];
    const experienceCount = user.resume?.experience?.length || 0;
    const educationCount = user.resume?.education?.length || 0;
    
    // Get job market stats
    const jobs = await Job.find();
    const totalJobs = jobs.length;
    
    // Calculate profile strength
    let profileStrength = 0;
    if (userSkills.length > 0) profileStrength += 20;
    if (userSkills.length > 5) profileStrength += 10;
    if (experienceCount > 0) profileStrength += 25;
    if (experienceCount > 2) profileStrength += 15;
    if (educationCount > 0) profileStrength += 15;
    if (user.resume?.personal?.summary) profileStrength += 15;
    
    // Build recommendations array
    const profileRecommendations = [];
    if (profileStrength < 60) profileRecommendations.push('Complete your profile to get better job matches');
    if (userSkills.length < 5) profileRecommendations.push('Add more relevant skills to improve your profile');
    if (!user.resume?.personal?.summary) profileRecommendations.push('Add a professional summary to stand out');
    
    return {
      profileStrength: Math.min(profileStrength, 100),
      profileStrengthRating: profileStrength >= 80 ? 'Strong' : profileStrength >= 60 ? 'Good' : profileStrength >= 40 ? 'Fair' : 'Needs Improvement',
      stats: {
        skillsCount: userSkills.length,
        experienceCount,
        educationCount,
        totalJobsAvailable: totalJobs
      },
      recommendations: profileRecommendations
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getJobRecommendations,
  getSkillRecommendations,
  getLearningPath,
  getCareerInsights
};
