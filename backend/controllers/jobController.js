const axios = require('axios');
const User = require('../models/user');
const Job = require('../models/job');

// RapidAPI JSearch config
const RAPIDAPI_HOST = 'jsearch.p.rapidapi.com';
const RAPIDAPI_BASE_URL = 'https://jsearch.p.rapidapi.com';

const getJobsFromAPI = async (queryParams = {}) => {
  try {
    const defaultParams = {
      query: 'software developer',
      page: 1,
      num_pages: 5,
      location: 'United States',
      ...queryParams
    };

    const response = await axios.post(
      `${RAPIDAPI_BASE_URL}/search`,
      { params: defaultParams },
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.data.map(job => ({
      id: job.id,
      title: job.title,
      company: job.employer_name,
      location: job.job_location || job.job_country,
      salary: job.job_highlighted_salary || 'Not specified',
      type: job.job_employment_type || 'Full-time',
      description: job.job_description,
      applyLink: job.job_apply_link || job.absolute_url || '#',
      requiredSkills: job.job_required_skills || [],
      postedDate: job.job_posted_at_datetime || 'Recent'
    }));
  } catch (error) {
    console.error('RapidAPI Error:', error.response?.data || error.message);
    // Fallback to MongoDB cache if API fails
    const cachedJobs = await Job.find().limit(20);
    return cachedJobs.map(job => ({
      ...job.toObject(),
      salary: job.salary || 'Not specified',
      applyLink: job.applyLink || '#'
    }));
  }
};

// GET all jobs with optional filters
exports.getAllJobs = async (req, res) => {
  try {
    const { skills, location, salary, type, page = 1, limit = 10 } = req.query;
    
    const queryParams = {};
    if (skills) queryParams.query = skills;
    if (location) queryParams.location = location;
    if (type) queryParams.job_type = type;

    const jobs = await getJobsFromAPI(queryParams);
    
    // Paginate
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedJobs = jobs.slice(startIndex, startIndex + parseInt(limit));
    
    res.json({
      jobs: paginatedJobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: jobs.length,
        totalPages: Math.ceil(jobs.length / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
};

// GET matching jobs for user
exports.getMatchingJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('resume.skills');
    const userSkills = user.resume?.skills || [];

    const { page = 1, limit = 10 } = req.query;
    const allJobs = await getJobsFromAPI({ query: userSkills.join(' ') });

    const matchedJobs = allJobs.map(job => {
      const matchingSkills = job.requiredSkills.filter(skill => 
        userSkills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()))
      );
      const matchScore = matchingSkills.length / Math.max(job.requiredSkills.length, 1) * 100;
      
      return {
        ...job,
        matchScore: Math.round(matchScore),
        matchingSkills
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedJobs = matchedJobs.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      jobs: paginatedJobs,
      userSkills,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: matchedJobs.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Apply for job
exports.applyForJob = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user.jobApplications) user.jobApplications = [];
    
    const hasApplied = user.jobApplications.some(app => app.jobId === id);
    if (hasApplied) {
      return res.status(400).json({ message: 'Already applied' });
    }

    user.jobApplications.push({
      jobId: id,
      appliedDate: new Date(),
      status: 'pending'
    });
    
    await user.save();
    res.json({ message: 'Application submitted!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user applications (populate from API if needed)
exports.getUserApplications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('jobApplications.jobId');
    res.json(user.jobApplications || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin CRUD stubs (Mongo cache)
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

