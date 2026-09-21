const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['job_match', 'skill_gap', 'application_update', 'roadmap', 'course_recommendation', 'system'],
    default: 'system'
  },
  read: {
    type: Boolean,
    default: false
  },
  data: {
    type: mongoose.Schema.Types.Mixed // jobId, courseId, etc.
  },
  sentViaEmail: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for unread notifications
notificationSchema.index({ user: 1, read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);

