const Skill = require('../models/skill');
const Job = require('../models/job');
const User = require('../models/user');

// GET all skills for a user
exports.getUserSkills = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const skills = await Skill.find({ userId });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE a new skill
exports.createSkill = async (req, res) => {
  const { name, proficiency } = req.body;
  try {
    const userId = req.user.id;
    const skill = await Skill.create({ userId, name, proficiency });
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE a skill
exports.updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE a skill
exports.deleteSkill = async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET skill gap analysis
exports.getGapAnalysis = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userSkills = user.resume?.skills || [];
    
    // Get all jobs to analyze required skills
    const jobs = await Job.find();
    
    // Count skill demand from jobs
    const skillDemand = {};
    jobs.forEach(job => {
      job.requiredSkills.forEach(skill => {
        skillDemand[skill] = (skillDemand[skill] || 0) + 1;
      });
    });
    
    // Sort by demand
    const demandedSkills = Object.entries(skillDemand)
      .sort((a, b) => b[1] - a[1])
      .map(([skill, count]) => ({ skill, demand: count }));
    
    // Find gaps
    const userSkillSet = new Set(userSkills.map(s => s.toLowerCase()));
    const gaps = demandedSkills
      .filter(s => !userSkillSet.has(s.skill.toLowerCase()))
      .slice(0, 10);
    
    // Find strengths
    const strengths = demandedSkills
      .filter(s => userSkillSet.has(s.skill.toLowerCase()))
      .slice(0, 10);
    
    res.json({
      userSkills: userSkills,
      demandedSkills,
      gaps,
      strengths,
      analysis: {
        totalJobsAnalyzed: jobs.length,
        uniqueSkillsDemanded: Object.keys(skillDemand).length,
        skillsMatchRate: demandedSkills.length > 0 
          ? Math.round((strengths.length / demandedSkills.length) * 100)
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
