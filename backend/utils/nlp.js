// NLP utilities for resume analysis
// This module provides functions for keyword extraction, ATS scoring, and ranking

// Common tech skills and keywords for matching
const TECH_KEYWORDS = [
  'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'php',
  'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring',
  'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap',
  'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git',
  'machine learning', 'deep learning', 'data science', 'nlp', 'computer vision',
  'agile', 'scrum', 'kanban', 'ci/cd', 'devops',
  'rest', 'graphql', 'microservices', 'api', 'graphql',
  'typescript', 'swift', 'kotlin', 'flutter', 'react native'
];

// Action verbs for resume strength
const ACTION_VERBS = [
  'led', 'managed', 'developed', 'created', 'implemented', 'designed',
  'built', 'optimized', 'improved', 'increased', 'reduced', 'automated',
  'integrated', 'deployed', 'maintained', 'collaborated', 'mentored'
];

// Extract keywords from resume text
const extractKeywords = (text) => {
  if (!text) return [];
  
  const textLower = text.toLowerCase();
  const words = textLower.split(/\W+/);
  
  // Find matching tech keywords
  const foundKeywords = TECH_KEYWORDS.filter(keyword => 
    textLower.includes(keyword)
  );
  
  // Find action verbs
  const foundActionVerbs = ACTION_VERBS.filter(verb => 
    words.includes(verb)
  );
  
  return {
    skills: foundKeywords,
    actionVerbs: foundActionVerbs,
    count: foundKeywords.length
  };
};

// Calculate ATS score based on various factors
const calculateATSScore = (resume) => {
  let score = 0;
  const maxScore = 100;
  const factors = [];
  
  // Check contact info (15 points)
  if (resume.personal?.name) {
    score += 5;
    factors.push({ factor: 'Name present', points: 5 });
  }
  if (resume.personal?.email) {
    score += 5;
    factors.push({ factor: 'Email present', points: 5 });
  }
  if (resume.personal?.phone) {
    score += 5;
    factors.push({ factor: 'Phone present', points: 5 });
  }
  
  // Check summary (15 points)
  if (resume.personal?.summary) {
    const summaryLength = resume.personal.summary.length;
    if (summaryLength > 50) {
      score += 15;
      factors.push({ factor: 'Summary present and adequate', points: 15 });
    } else {
      score += 5;
      factors.push({ factor: 'Short summary', points: 5 });
    }
  }
  
  // Check experience (25 points)
  if (resume.experience && resume.experience.length > 0) {
    const expScore = Math.min(resume.experience.length * 8, 25);
    score += expScore;
    factors.push({ factor: `${resume.experience.length} experience entries`, points: expScore });
  }
  
  // Check education (15 points)
  if (resume.education && resume.education.length > 0) {
    score += 15;
    factors.push({ factor: 'Education present', points: 15 });
  }
  
  // Check skills (20 points)
  if (resume.skills && resume.skills.length > 0) {
    const skillScore = Math.min(resume.skills.length * 4, 20);
    score += skillScore;
    factors.push({ factor: `${resume.skills.length} skills listed`, points: skillScore });
  }
  
  // Check projects (10 points)
  if (resume.projects && resume.projects.length > 0) {
    score += 10;
    factors.push({ factor: 'Projects present', points: 10 });
  }
  
  return {
    score: Math.min(score, maxScore),
    maxScore,
    factors,
    rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Improvement'
  };
};

// Rank resume against job requirements
const rankResumeAgainstJob = (resume, job) => {
  const resumeSkills = (resume.skills || []).map(s => s.toLowerCase());
  const jobSkills = (job.requiredSkills || []).map(s => s.toLowerCase());
  
  // Calculate matching skills
  const matchingSkills = jobSkills.filter(skill => 
    resumeSkills.some(resumeSkill => resumeSkill.includes(skill) || skill.includes(resumeSkill))
  );
  
  // Calculate match score
  const matchScore = jobSkills.length > 0 
    ? Math.round((matchingSkills.length / jobSkills.length) * 100)
    : 0;
  
  // Identify missing skills
  const missingSkills = jobSkills.filter(skill => 
    !matchingSkills.includes(skill) && 
    !resumeSkills.some(resumeSkill => resumeSkill.includes(skill) || skill.includes(resumeSkill))
  );
  
  return {
    matchScore,
    matchingSkills,
    missingSkills,
    resumeSkills: resumeSkills,
    jobSkills: jobSkills,
    recommendation: matchScore >= 70 ? 'Strong match' : matchScore >= 50 ? 'Moderate match' : 'Consider improving match'
  };
};

// Get improvement suggestions
const getSuggestions = (resume, atsScore) => {
  const suggestions = [];
  
  if (!resume.personal?.summary) {
    suggestions.push({
      priority: 'high',
      message: 'Add a professional summary to highlight your career goals and key strengths'
    });
  }
  
  if (!resume.experience || resume.experience.length === 0) {
    suggestions.push({
      priority: 'high',
      message: 'Add work experience to showcase your professional history'
    });
  }
  
  if (!resume.education || resume.education.length === 0) {
    suggestions.push({
      priority: 'medium',
      message: 'Add education details to strengthen your profile'
    });
  }
  
  if (!resume.skills || resume.skills.length < 5) {
    suggestions.push({
      priority: 'high',
      message: 'Add more relevant skills to improve job matching'
    });
  }
  
  if (!resume.projects || resume.projects.length === 0) {
    suggestions.push({
      priority: 'medium',
      message: 'Add projects to demonstrate practical experience'
    });
  }
  
  // Check for action verbs in experience
  const hasActionVerbs = resume.experience?.some(exp => 
    ACTION_VERBS.some(verb => exp.description?.toLowerCase().includes(verb))
  );
  
  if (!hasActionVerbs) {
    suggestions.push({
      priority: 'medium',
      message: 'Use action verbs in your experience descriptions (e.g., "Led", "Developed", "Implemented")'
    });
  }
  
  return suggestions;
};

module.exports = {
  extractKeywords,
  calculateATSScore,
  rankResumeAgainstJob,
  getSuggestions,
  TECH_KEYWORDS,
  ACTION_VERBS
};
