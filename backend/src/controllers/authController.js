const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Problem = require('../models/Problem');
const ReviewLog = require('../models/ReviewLog');
const { getDemoProblems, getDemoReviewLogs } = require('../utils/dummyData');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_dsa_secret_key_12345', {
    expiresIn: '30d'
  });
};

// Helper: Auto-seeds demo user if empty
async function autoSeedDemoUser(userId) {
  try {
    const count = await Problem.countDocuments({ userId });
    if (count === 0) {
      const sampleProblems = getDemoProblems(userId);
      const created = await Problem.insertMany(sampleProblems);
      const sampleLogs = getDemoReviewLogs(userId, created);
      await ReviewLog.insertMany(sampleLogs);
      console.log(`Auto-seeded ${created.length} demo problems for user ${userId}`);
    }
  } catch (err) {
    console.warn('Auto-seed warning:', err.message);
  }
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, targetGoal } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      targetGoal: targetGoal || 'Software Engineer Placement Season'
    });

    // Auto-seed if registering demo account
    if (email.toLowerCase() === 'student@college.edu') {
      await autoSeedDemoUser(user._id);
    }

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetGoal: user.targetGoal,
        dailyTargetReviewCount: user.dailyTargetReviewCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Auto-seed if demo account has no problems yet
    if (email.toLowerCase() === 'student@college.edu') {
      await autoSeedDemoUser(user._id);
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetGoal: user.targetGoal,
        dailyTargetReviewCount: user.dailyTargetReviewCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
