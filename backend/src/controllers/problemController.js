const Problem = require('../models/Problem');
const { extractTitleSlug, fetchLeetCodeQuestion } = require('../utils/leetcode');
const { calculateRetentionScore } = require('../utils/sm2');

// LeetCode GraphQL Proxy Endpoint
exports.fetchMetadata = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    const titleSlug = extractTitleSlug(url);
    if (!titleSlug) {
      return res.status(400).json({ 
        message: 'Could not extract LeetCode titleSlug from URL. Please use standard LeetCode format: https://leetcode.com/problems/<slug>/' 
      });
    }

    const metadata = await fetchLeetCodeQuestion(titleSlug);
    res.status(200).json({
      success: true,
      platform: 'LeetCode',
      data: metadata
    });
  } catch (error) {
    console.error('LeetCode GraphQL Fetch Error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch problem from LeetCode GraphQL API' 
    });
  }
};

// Create a newly solved problem with journal notes
exports.createProblem = async (req, res) => {
  try {
    const {
      title,
      titleSlug,
      problemUrl,
      platform,
      difficulty,
      pattern,
      topicTags,
      journal,
      initialConfidence // 1 to 5 (optional rating at first solve)
    } = req.body;

    if (!title || !problemUrl || !pattern || !journal?.coreIntuition) {
      return res.status(400).json({ 
        message: 'Title, Problem URL, Pattern, and Core Intuition are mandatory.' 
      });
    }

    // Set initial schedule:
    // If student felt high confidence initially (4-5), schedule first review in 3 days; otherwise 1 day.
    const initialDays = (initialConfidence && Number(initialConfidence) >= 4) ? 3 : 1;
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + initialDays);
    nextReviewDate.setHours(0, 0, 0, 0);

    const problem = await Problem.create({
      userId: req.user._id,
      title,
      titleSlug: titleSlug || extractTitleSlug(problemUrl) || '',
      problemUrl,
      platform: platform || 'LeetCode',
      difficulty: difficulty || 'Medium',
      pattern,
      topicTags: topicTags || [],
      journal: {
        coreIntuition: journal.coreIntuition,
        edgeCases: journal.edgeCases || [],
        timeComplexity: journal.timeComplexity || 'O(N)',
        spaceComplexity: journal.spaceComplexity || 'O(1)',
        codeSnippet: journal.codeSnippet || ''
      },
      repetitionNumber: 0,
      easinessFactor: 2.5,
      intervalDays: initialDays,
      nextReviewDate,
      lastReviewedAt: new Date()
    });

    res.status(201).json({
      success: true,
      data: problem
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all problems for current user with retention scores
exports.getProblems = async (req, res) => {
  try {
    const { pattern, difficulty, search } = req.query;
    const filter = { userId: req.user._id };

    if (pattern && pattern !== 'All') {
      filter.pattern = pattern;
    }
    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const problems = await Problem.find(filter).sort({ nextReviewDate: 1 });

    // Augment with current Ebbinghaus retention probability
    const augmented = problems.map(p => {
      const pObj = p.toObject();
      pObj.retentionScore = calculateRetentionScore(p.lastReviewedAt, p.intervalDays);
      pObj.isDue = new Date(p.nextReviewDate) <= new Date();
      return pObj;
    });

    res.status(200).json({
      success: true,
      count: augmented.length,
      data: augmented
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single problem by ID
exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findOne({ _id: req.params.id, userId: req.user._id });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const pObj = problem.toObject();
    pObj.retentionScore = calculateRetentionScore(problem.lastReviewedAt, problem.intervalDays);
    pObj.isDue = new Date(problem.nextReviewDate) <= new Date();

    res.status(200).json({
      success: true,
      data: pObj
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update problem details or journal notes
exports.updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.status(200).json({
      success: true,
      data: problem
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete problem
exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Problem removed successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
