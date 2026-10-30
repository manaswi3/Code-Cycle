const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluateCandidateRecall } = require('../src/utils/aiEvaluator');

test('evaluateCandidateRecall produces classy structured evaluation', async () => {
  const dummyProblem = {
    title: '3. Longest Substring Without Repeating Characters',
    pattern: 'Sliding Window',
    journal: {
      coreIntuition: 'Maintain a window [left, right] using a hash map to record last seen indices.',
      edgeCases: ['All identical characters bbbbb', 'Empty string'],
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(min(N, Sigma))'
    }
  };

  const dummyAnswers = {
    naiveApproach: 'Generate all possible substrings using two nested loops and check uniqueness using a set.',
    bottleneck: 'Generating all substrings takes O(N^3) time and causes TLE on large strings.',
    optimalApproach: 'Use a sliding window with left and right pointers. When a duplicate is encountered, slide the left pointer.',
    complexityReason: 'Time is O(N) because each character is visited at most twice. Space is O(N) for storing characters.'
  };

  const result = await evaluateCandidateRecall({
    problem: dummyProblem,
    answers: dummyAnswers,
    userName: 'Rohan'
  });

  assert.ok(result.greeting.includes('Rohan'));
  assert.ok(result.score >= 70, `Expected score >= 70, got ${result.score}`);
  assert.ok(Array.isArray(result.nailed));
  assert.ok(result.nailed.length > 0);
  assert.ok(result.suggestedQuality >= 3 && result.suggestedQuality <= 5);
});
