const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  context: {
    type: mongoose.Schema.Types.Mixed // user skills, career goals for context
  }
}, {
  timestamps: true
});

// Index for chat history
chatMessageSchema.index({ user: 1, sessionId: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);

