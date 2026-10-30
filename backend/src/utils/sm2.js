/**
 * SuperMemo SM-2 Spaced Repetition Algorithm & Ebbinghaus Forgetting Curve Calculator
 * 
 * References:
 * - P.A. Wozniak, "Optimization of learning" (1990)
 * - Hermann Ebbinghaus, "Memory: A Contribution to Experimental Psychology" (1885)
 */

/**
 * Calculates the next review date and updated SM-2 parameters.
 * 
 * @param {Object} params
 * @param {number} params.quality - Rating from 0 (complete blackout) to 5 (perfect recall)
 * @param {number} params.repetitionNumber - Current count of consecutive successful reviews (n)
 * @param {number} params.easinessFactor - Current easiness factor (EF, default 2.5)
 * @param {number} params.intervalDays - Current interval in days (I)
 * @returns {Object} { nextIntervalDays, nextRepetitionNumber, nextEasinessFactor, nextReviewDate }
 */
function calculateSM2({ quality, repetitionNumber = 0, easinessFactor = 2.5, intervalDays = 0 }) {
  // Clamp quality between 0 and 5
  const q = Math.max(0, Math.min(5, Math.round(quality)));

  // Calculate new Easiness Factor (EF')
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  let newEF = easinessFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  
  // EF cannot fall below 1.3
  if (newEF < 1.3) {
    newEF = 1.3;
  }
  // Round to 3 decimal places
  newEF = Math.round(newEF * 1000) / 1000;

  let newRepetition = 0;
  let newInterval = 1; // in days

  if (q >= 3) {
    // Successful recall
    if (repetitionNumber === 0) {
      newInterval = 1;
    } else if (repetitionNumber === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(intervalDays * newEF);
    }
    newRepetition = repetitionNumber + 1;
  } else {
    // Failed recall: reset repetitions to 0 and schedule immediate repetition (tomorrow)
    newRepetition = 0;
    newInterval = 1;
  }

  // Calculate target calendar date for next review
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
  // Normalize to midnight UTC/local start of day for clean daily querying
  nextReviewDate.setHours(0, 0, 0, 0);

  return {
    nextIntervalDays: newInterval,
    nextRepetitionNumber: newRepetition,
    nextEasinessFactor: newEF,
    nextReviewDate
  };
}

/**
 * Calculates current Memory Retention probability using Ebbinghaus exponential decay:
 * R = e^(- deltaT / S)
 * 
 * @param {Date|string} lastReviewedAt - Date of last successful review
 * @param {number} intervalDays - Current stability window (S) in days
 * @returns {number} Retention score between 0.0 and 1.0 (or percentage 0-100)
 */
function calculateRetentionScore(lastReviewedAt, intervalDays = 1) {
  if (!lastReviewedAt) {
    return 1.0; // Newly added
  }

  const lastDate = new Date(lastReviewedAt).getTime();
  const now = Date.now();
  const daysElapsed = Math.max(0, (now - lastDate) / (1000 * 60 * 60 * 24));
  
  // Stability S: minimum 1 day, scaled by intervalDays
  const stability = Math.max(1, intervalDays);
  
  // Retention R = e^(-t / S)
  const retention = Math.exp(-daysElapsed / stability);
  
  return Math.max(0, Math.min(1, Math.round(retention * 100) / 100));
}

module.exports = {
  calculateSM2,
  calculateRetentionScore
};
