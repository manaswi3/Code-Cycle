const express = require('express');
const router = express.Router();
const {
  getDailyQueue,
  evaluateRecall,
  submitReview,
  getAnalytics
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/today', getDailyQueue);
router.post('/:problemId/evaluate', evaluateRecall);
router.post('/:problemId/submit', submitReview);
router.get('/analytics', getAnalytics);

module.exports = router;
