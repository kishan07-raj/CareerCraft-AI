const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/user');
const { extractKeywords, calculateATSScore, rankResumeAgainstJob, getSuggestions } = require('../utils/nlp');
const Job = require('../models/job');

// GET resume - Get user's resume
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.resume || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST resume - Save/update resume
router.post('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.resume = req.body;
    await user.save();

    res.json({
      message: 'Resume saved successfully',
      resume: user.resume
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT resume - Update resume
router.put('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.resume = {
      ...user.resume,
      ...req.body
    };
    await user.save();

    res.json({
      message: 'Resume updated successfully',
      resume: user.resume
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET analysis - Get resume analysis (ATS score, keywords, suggestions)
router.get('/analysis', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resume = user.resume || {};
    
    // Get ATS score
    const atsScore = calculateATSScore(resume);
    
    // Extract keywords
    const summaryText = resume.personal?.summary || '';
    const experienceText = resume.experience?.map(exp => exp.description).join(' ') || '';
    const keywords = extractKeywords(summaryText + ' ' + experienceText);
    
    // Get suggestions
    const suggestions = getSuggestions(resume, atsScore.score);
    
    res.json({
      atsScore,
      keywords,
      suggestions,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET match/:jobId - Compare resume against a specific job
router.get('/match/:jobId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const resume = user.resume || {};
    const ranking = rankResumeAgainstJob(resume, job);
    
    res.json({
      ranking,
      job: {
        id: job._id,
        title: job.title,
        company: job.company,
        requiredSkills: job.requiredSkills
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
