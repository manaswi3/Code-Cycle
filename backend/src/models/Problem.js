const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Problem title is required'],
    trim: true
  },
  titleSlug: {
    type: String,
    trim: true,
    index: true
  },
  problemUrl: {
    type: String,
    required: [true, 'Problem URL is required'],
    trim: true
  },
  platform: {
    type: String,
    enum: ['LeetCode', 'GeeksforGeeks', 'Codeforces', 'HackerRank', 'Other'],
    default: 'LeetCode'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  pattern: {
    type: String,
    required: [true, 'Pattern category is required (e.g. Sliding Window, Two Pointers)'],
    trim: true,
    index: true
  },
  topicTags: [{
    type: String,
    trim: true
  }],

  // Full problem description with examples & constraints (LeetCode style)
  description: {
    statement: { type: String, default: '' },
    examples: [{
      input: String,
      output: String,
      explanation: String
    }],
    constraints: [String]
  },

  // Structured DSA Journal (Intuition-first)
  journal: {
    coreIntuition: {
      type: String,
      required: [true, 'Core intuition/approach summary is required']
    },
    edgeCases: [{
      type: String,
      trim: true
    }],
    timeComplexity: {
      type: String,
      default: 'O(N)'
    },
    spaceComplexity: {
      type: String,
      default: 'O(1)'
    },
    codeSnippet: {
      type: String,
      default: ''
    }
  },

  // SuperMemo SM-2 Spaced Repetition Parameters
  repetitionNumber: {
    type: Number,
    default: 0
  },
  easinessFactor: {
    type: Number,
    default: 2.5
  },
  intervalDays: {
    type: Number,
    default: 0
  },
  nextReviewDate: {
    type: Date,
    default: () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(0, 0, 0, 0);
      return d;
    },
    index: true
  },
  lastReviewedAt: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['LEARNING', 'REVIEWING', 'MASTERED'],
    default: 'LEARNING'
  }
}, { timestamps: true });

problemSchema.index({ userId: 1, nextReviewDate: 1 });
problemSchema.index({ userId: 1, pattern: 1 });

module.exports = mongoose.model('Problem', problemSchema);
