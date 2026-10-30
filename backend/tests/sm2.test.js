const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateSM2, calculateRetentionScore } = require('../src/utils/sm2');

test('SM-2: First successful review (q=4) sets interval to 1 and increments repetition', () => {
  const result = calculateSM2({
    quality: 4,
    repetitionNumber: 0,
    easinessFactor: 2.5,
    intervalDays: 0
  });

  assert.equal(result.nextIntervalDays, 1);
  assert.equal(result.nextRepetitionNumber, 1);
  assert.equal(result.nextEasinessFactor, 2.5); // (5-4) => 2.5 + (0.1 - 1*(0.08 + 0.02)) = 2.5
});

test('SM-2: Second successful review (q=5) sets interval to 6 and raises EF', () => {
  const result = calculateSM2({
    quality: 5,
    repetitionNumber: 1,
    easinessFactor: 2.5,
    intervalDays: 1
  });

  assert.equal(result.nextIntervalDays, 6);
  assert.equal(result.nextRepetitionNumber, 2);
  assert.equal(result.nextEasinessFactor, 2.6); // Raised EF
});

test('SM-2: Failed review (q=1) resets repetition to 0 and interval to 1', () => {
  const result = calculateSM2({
    quality: 1,
    repetitionNumber: 4,
    easinessFactor: 2.6,
    intervalDays: 15
  });

  assert.equal(result.nextIntervalDays, 1);
  assert.equal(result.nextRepetitionNumber, 0);
  assert.ok(result.nextEasinessFactor < 2.6); // EF penalized
  assert.ok(result.nextEasinessFactor >= 1.3); // Minimum floor maintained
});

test('Retention score drops exponentially with time', () => {
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  
  // Stability = 3 days, elapsed = 3 days => R = e^(-1) ~ 0.37
  const retention = calculateRetentionScore(threeDaysAgo, 3);
  assert.ok(retention >= 0.35 && retention <= 0.38, `Expected ~0.37, got ${retention}`);
});
