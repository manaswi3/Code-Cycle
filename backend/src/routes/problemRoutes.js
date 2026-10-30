const express = require('express');
const router = express.Router();
const {
  fetchMetadata,
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem
} = require('../controllers/problemController');
const { protect } = require('../middleware/auth');

// Public or protected: LeetCode metadata lookup
router.post('/fetch-metadata', fetchMetadata);

// Protected routes
router.use(protect);

router.route('/')
  .get(getProblems)
  .post(createProblem);

router.route('/:id')
  .get(getProblemById)
  .put(updateProblem)
  .delete(deleteProblem);

module.exports = router;
