const Problem = require('../models/Problem');
const ReviewLog = require('../models/ReviewLog');
const { calculateSM2, calculateRetentionScore } = require('../utils/sm2');
const { evaluateCandidateRecall } = require('../utils/aiEvaluator');

// GET /api/reviews/today - Get problems scheduled for review today
exports.getDailyQueue = async (req, res) => {
  try {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const userTarget = req.user.dailyTargetReviewCount || 5;

    const dueProblems = await Problem.find({
      userId: req.user._id,
      nextReviewDate: { $lte: endOfToday }
    })
      .sort({ intervalDays: 1, nextReviewDate: 1 })
      .limit(userTarget);

    const queue = dueProblems.map(p => {
      const pObj = p.toObject();
      pObj.retentionScore = calculateRetentionScore(p.lastReviewedAt, p.intervalDays);
      return pObj;
    });

    const totalOverdueCount = await Problem.countDocuments({
      userId: req.user._id,
      nextReviewDate: { $lte: endOfToday }
    });

    res.status(200).json({
      success: true,
      count: queue.length,
      totalOverdueCount,
      isCapped: totalOverdueCount > queue.length,
      dailyTarget: userTarget,
      data: queue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/reviews/:problemId/evaluate - AI reasoning evaluation
exports.evaluateRecall = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { answers } = req.body;

    const problem = await Problem.findOne({ _id: problemId, userId: req.user._id });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const evaluation = await evaluateCandidateRecall({
      problem,
      answers: answers || {},
      userName: req.user.name || 'Candidate'
    });

    res.status(200).json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    console.error('Recall evaluation error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/reviews/:problemId/submit - Complete a review session for a problem
exports.submitReview = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { quality, timeSpentSeconds, aiScore, frictionLevel } = req.body;

    if (quality === undefined || quality < 0 || quality > 5) {
      return res.status(400).json({ 
        message: 'Quality rating is required and must be an integer between 0 and 5' 
      });
    }

    const problem = await Problem.findOne({ _id: problemId, userId: req.user._id });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const previousInterval = problem.intervalDays;

    // Run pure SM-2 algorithm
    const sm2Result = calculateSM2({
      quality,
      repetitionNumber: problem.repetitionNumber,
      easinessFactor: problem.easinessFactor,
      intervalDays: problem.intervalDays
    });

    // Update Problem state
    problem.repetitionNumber = sm2Result.nextRepetitionNumber;
    problem.easinessFactor = sm2Result.nextEasinessFactor;
    problem.intervalDays = sm2Result.nextIntervalDays;
    problem.nextReviewDate = sm2Result.nextReviewDate;
    problem.lastReviewedAt = new Date();

    if (problem.repetitionNumber >= 4) {
      problem.status = 'MASTERED';
    } else {
      problem.status = 'REVIEWING';
    }

    await problem.save();

    // Log the review session with AI score & friction level
    const log = await ReviewLog.create({
      userId: req.user._id,
      problemId: problem._id,
      pattern: problem.pattern,
      rating: quality,
      aiScore: aiScore !== undefined ? aiScore : null,
      frictionLevel: frictionLevel || 'NONE',
      previousInterval,
      newInterval: sm2Result.nextIntervalDays,
      newEasinessFactor: sm2Result.nextEasinessFactor,
      timeSpentSeconds: timeSpentSeconds || 0,
      reviewedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Review recorded successfully',
      data: {
        problem,
        log,
        nextReviewInDays: sm2Result.nextIntervalDays,
        nextReviewDate: sm2Result.nextReviewDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reviews/analytics - Comprehensive dashboard analytics & Pattern Memory Matrix
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalProblems = await Problem.countDocuments({ userId });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const reviewsToday = await ReviewLog.countDocuments({
      userId,
      reviewedAt: { $gte: startOfToday }
    });

    const difficultyStats = await Problem.aggregate([
      { $match: { userId } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);

    const allProblems = await Problem.find({ userId });
    
    const patternMap = {};
    allProblems.forEach(p => {
      if (!patternMap[p.pattern]) {
        patternMap[p.pattern] = {
          name: p.pattern,
          total: 0,
          retentionSum: 0,
          masteredCount: 0,
          lastPracticed: null
        };
      }
      const score = calculateRetentionScore(p.lastReviewedAt, p.intervalDays);
      patternMap[p.pattern].total += 1;
      patternMap[p.pattern].retentionSum += score;
      if (p.status === 'MASTERED') patternMap[p.pattern].masteredCount += 1;

      if (!patternMap[p.pattern].lastPracticed || (p.lastReviewedAt && new Date(p.lastReviewedAt) > new Date(patternMap[p.pattern].lastPracticed))) {
        patternMap[p.pattern].lastPracticed = p.lastReviewedAt;
      }
    });

    const patternHealthMatrix = Object.values(patternMap).map(pat => {
      const avgRetention = Math.round((pat.retentionSum / pat.total) * 100);
      let healthStatus = 'FRESH';
      if (avgRetention < 50) healthStatus = 'CRITICAL';
      else if (avgRetention < 75) healthStatus = 'FADING';

      return {
        pattern: pat.name,
        totalProblems: pat.total,
        masteredProblems: pat.masteredCount,
        retentionPercentage: avgRetention,
        healthStatus,
        lastPracticed: pat.lastPracticed
      };
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentLogs = await ReviewLog.aggregate([
      { $match: { userId, reviewedAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$reviewedAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProblems,
        reviewsToday,
        difficultyStats,
        patternHealthMatrix,
        recentActivity: recentLogs
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
