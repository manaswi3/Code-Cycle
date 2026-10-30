const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Problem = require('../models/Problem');
const ReviewLog = require('../models/ReviewLog');
const { getDemoProblems, getDemoReviewLogs } = require('./dummyData');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dsa_revision_tracker';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clean existing demo user
    await User.deleteMany({ email: 'student@college.edu' });

    // Create default student user
    const user = await User.create({
      name: 'Rohan Sharma',
      email: 'student@college.edu',
      password: 'password123',
      targetGoal: 'Campus Placement Season 2026',
      dailyTargetReviewCount: 5
    });

    console.log('Created user:', user.email);

    // Clean user's previous data
    await Problem.deleteMany({ userId: user._id });
    await ReviewLog.deleteMany({ userId: user._id });

    // Generate full rich dummy problem dataset
    const sampleProblems = getDemoProblems(user._id);
    const createdProblems = await Problem.insertMany(sampleProblems);
    console.log(`Successfully seeded ${createdProblems.length} sample DSA problems with SM-2 states!`);

    // Generate historical review logs for analytics & streaks
    const sampleLogs = getDemoReviewLogs(user._id, createdProblems);
    await ReviewLog.insertMany(sampleLogs);
    console.log(`Successfully seeded ${sampleLogs.length} historical review logs!`);

    await mongoose.disconnect();
    console.log('✅ Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
