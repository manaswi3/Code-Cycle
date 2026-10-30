const mongoose = require('mongoose');

const reviewLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
    index: true
  },
  pattern: {
    type: String,
    required: true,
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  aiScore: {
    type: Number,
    default: null
  },
  frictionLevel: {
    type: String,
    enum: ['EFFORTLESS', 'HESITANT', 'STRUGGLED', 'NONE'],
    default: 'NONE'
  },
  previousInterval: {
    type: Number,
    default: 0
  },
  newInterval: {
    type: Number,
    required: true
  },
  newEasinessFactor: {
    type: Number,
    required: true
  },
  timeSpentSeconds: {
    type: Number,
    default: 0
  },
  reviewedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

reviewLogSchema.index({ userId: 1, reviewedAt: -1 });

module.exports = mongoose.model('ReviewLog', reviewLogSchema);
