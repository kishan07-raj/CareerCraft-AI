import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resendOTP: (data) => api.post('/auth/resend-otp', data),
  googleLogin: (data) => api.post('/auth/google-login', data)
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users')
};

// Resume APIs
export const resumeAPI = {
  getResume: () => api.get('/resume'),
  saveResume: (data) => api.post('/resume', data),
  updateResume: (data) => api.put('/resume', data),
  getAnalysis: () => api.get('/resume/analysis'),
  matchJob: (jobId) => api.get(`/resume/match/${jobId}`)
};

// Job APIs - Updated for params/pagination
export const jobAPI = {
  getAllJobs: (params = {}) => api.get('/jobs', { params }),
  getMatchingJobs: (params = {}) => api.get('/jobs/match', { params }),
  applyForJob: (jobId) => api.post(`/jobs/apply/${jobId}`),
  getUserApplications: () => api.get('/jobs/applications')
};

// Skill APIs
export const skillAPI = {
  getMySkills: () => api.get('/skills/my-skills'),
  addSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
  getGapAnalysis: () => api.get('/skills/gap-analysis')
};

// Recommendation APIs
export const recommendationAPI = {
  getJobRecommendations: () => api.get('/recommendations/jobs'),
  getSkillRecommendations: () => api.get('/recommendations/skills'),
  getLearningPath: () => api.get('/recommendations/learning-path'),
  getCareerInsights: () => api.get('/recommendations/insights')
};

export default api;

