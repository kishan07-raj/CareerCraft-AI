const mongoose = require('mongoose');

const codingTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
    enum: ['JavaScript', 'HTML', 'CSS', 'React'],
  },
  topic: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  type: {
    type: String,
    enum: ['MCQ', 'Coding'],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
  }],
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
  },
  codeSnippet: {
    type: String,
  },
  expectedOutput: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CodingTest', codingTestSchema);
