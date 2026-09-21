const mongoose = require('mongoose');

const userCodingProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  totalQuestions: {
    type: Number,
    default: 0,
  },
  correctAnswers: {
    type: Number,
    default: 0,
  },
  incorrectAnswers: {
    type: Number,
    default: 0,
  },
  percentage: {
    type: Number,
    default: 0,
  },
  lastAttempted: {
    type: Date,
    default: Date.now,
  },
  attempts: [{
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingTest',
    },
    userAnswer: String,
    isCorrect: Boolean,
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  }],
});

module.exports = mongoose.model('UserCodingProgress', userCodingProgressSchema);
