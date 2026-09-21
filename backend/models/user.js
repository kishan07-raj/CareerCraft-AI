const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic authentication fields
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },
  googleId: { type: String },
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
  
  // Profile information
  profile: {
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    phone: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' }
  },
  
  // Resume data
  resume: {
    personal: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      summary: { type: String, default: '' }
    },
    experience: [{
      id: { type: Number },
      title: { type: String },
      company: { type: String },
      location: { type: String },
      startDate: { type: String },
      endDate: { type: String },
      description: { type: String }
    }],
    education: [{
      id: { type: Number },
      degree: { type: String },
      school: { type: String },
      location: { type: String },
      graduationYear: { type: String }
    }],
    skills: [{ type: String }],
    projects: [{
      id: { type: Number },
      title: { type: String },
      description: { type: String },
      technologies: [{ type: String }]
    }],
    awards: [{
      id: { type: Number },
      title: { type: String },
      issuer: { type: String },
      date: { type: String }
    }]
  },
  
  // Job applications
  jobApplications: [{
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    appliedDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'reviewing', 'interview', 'rejected', 'accepted'], default: 'pending' },
    notes: { type: String }
  }],
  
  // Dashboard statistics
  dashboardStats: {
    totalJobs: { type: Number, default: 0 },
    matchedJobs: { type: Number, default: 0 },
    skillsCount: { type: Number, default: 0 },
    resumeScore: { type: Number, default: 0 },
    codingScore: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    totalAttempts: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
