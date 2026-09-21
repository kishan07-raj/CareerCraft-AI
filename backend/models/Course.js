const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  platform: { 
    type: String, 
    enum: ['Coursera', 'Udemy', 'edX', 'freeCodeCamp', 'LinkedIn Learning', 'Other'],
    required: true 
  },
  url: { 
    type: String, 
    required: true 
  },
  duration: { 
    type: String, // e.g. "4 weeks", "12 hours"
    required: true 
  },
  level: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true 
  },
  skills: [{
    type: String,
    required: true 
  }],
  category: { 
    type: String, 
    required: true // 'web-development', 'data-science', etc.
  },
  rating: { 
    type: Number, 
    min: 0, 
    max: 5,
    default: 0 
  },
  price: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Course', courseSchema);

