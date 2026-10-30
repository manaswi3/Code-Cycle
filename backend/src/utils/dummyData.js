/**
 * Rich Dummy DSA Problem Dataset for Demo User (Rohan Sharma / student@college.edu)
 * Covers multiple algorithmic patterns, realistic intuitions, tricky edge cases, and SM-2 states.
 */

function getDemoProblems(userId) {
  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(now - 1 * DAY_MS);
  const threeDaysAgo = new Date(now - 3 * DAY_MS);
  const fiveDaysAgo = new Date(now - 5 * DAY_MS);
  const eightDaysAgo = new Date(now - 8 * DAY_MS);
  const twentyDaysAgo = new Date(now - 20 * DAY_MS);

  return [
    // 1. Sliding Window (Due Today)
    {
      userId,
      title: '3. Longest Substring Without Repeating Characters',
      titleSlug: 'longest-substring-without-repeating-characters',
      problemUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
      platform: 'LeetCode',
      difficulty: 'Medium',
      pattern: 'Sliding Window',
      topicTags: ['Hash Table', 'String', 'Sliding Window'],
      journal: {
        coreIntuition: 'Maintain a window [left, right]. Use a hash map of char -> last seen index. When duplicate seen, jump left to max(left, lastSeen + 1) to avoid re-evaluating.',
        edgeCases: ['Empty string ""', 'All identical characters "bbbbb"', 'Single character "a"', 'String with spaces and symbols'],
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(min(N, Sigma))'
      },
      repetitionNumber: 1,
      easinessFactor: 2.5,
      intervalDays: 1,
      nextReviewDate: today, // DUE TODAY
      lastReviewedAt: threeDaysAgo,
      status: 'REVIEWING'
    },

    // 2. Sliding Window (Reviewing)
    {
      userId,
      title: '76. Minimum Window Substring',
      titleSlug: 'minimum-window-substring',
      problemUrl: 'https://leetcode.com/problems/minimum-window-substring/',
      platform: 'LeetCode',
      difficulty: 'Hard',
      pattern: 'Sliding Window',
      topicTags: ['Hash Table', 'String', 'Sliding Window'],
      journal: {
        coreIntuition: 'Count characters required from target string T. Expand right pointer until window has all required characters, then shrink left pointer to find minimum valid window.',
        edgeCases: ['Target string T is longer than source string S', 'Multiple valid windows of identical length', 'No valid window exists'],
        timeComplexity: 'O(N + M)',
        spaceComplexity: 'O(Sigma)'
      },
      repetitionNumber: 2,
      easinessFactor: 2.4,
      intervalDays: 3,
      nextReviewDate: new Date(now + 2 * DAY_MS),
      lastReviewedAt: yesterday,
      status: 'REVIEWING'
    },

    // 3. Two Pointers (Due Today)
    {
      userId,
      title: '15. 3Sum',
      titleSlug: '3sum',
      problemUrl: 'https://leetcode.com/problems/3sum/',
      platform: 'LeetCode',
      difficulty: 'Medium',
      pattern: 'Two Pointers',
      topicTags: ['Array', 'Two Pointers', 'Sorting'],
      journal: {
        coreIntuition: 'Sort array first. Fix element i, then use two pointers (left = i+1, right = n-1) to find pairs summing to -nums[i]. Skip duplicates for i, left, and right to guarantee unique triplets.',
        edgeCases: ['Array with fewer than 3 elements', 'All zeros [0, 0, 0, 0]', 'Large negative numbers causing integer wrap'],
        timeComplexity: 'O(N^2)',
        spaceComplexity: 'O(1) extra auxiliary'
      },
      repetitionNumber: 1,
      easinessFactor: 2.4,
      intervalDays: 1,
      nextReviewDate: today, // DUE TODAY
      lastReviewedAt: threeDaysAgo,
      status: 'REVIEWING'
    },

    // 4. Two Pointers (Mastered)
    {
      userId,
      title: '11. Container With Most Water',
      titleSlug: 'container-with-most-water',
      problemUrl: 'https://leetcode.com/problems/container-with-most-water/',
      platform: 'LeetCode',
      difficulty: 'Medium',
      pattern: 'Two Pointers',
      topicTags: ['Array', 'Two Pointers', 'Greedy'],
      journal: {
        coreIntuition: 'Start with max width at pointers 0 and n-1. Area is limited by the shorter line. Moving the taller line can never yield larger area, so always move the shorter line inward.',
        edgeCases: ['Only 2 lines', 'All lines having equal height', 'Decreasing staircase heights'],
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)'
      },
      repetitionNumber: 4,
      easinessFactor: 2.7,
      intervalDays: 28,
      nextReviewDate: new Date(now + 20 * DAY_MS),
      lastReviewedAt: eightDaysAgo,
      status: 'MASTERED'
    },

    // 5. Monotonic Stack (Due Today)
    {
      userId,
      title: '739. Daily Temperatures',
      titleSlug: 'daily-temperatures',
      problemUrl: 'https://leetcode.com/problems/daily-temperatures/',
      platform: 'LeetCode',
      difficulty: 'Medium',
      pattern: 'Monotonic Stack',
      topicTags: ['Array', 'Stack', 'Monotonic Stack'],
      journal: {
        coreIntuition: 'Keep a monotonically decreasing stack storing indices. When current temperature is warmer than stack top index temperature, pop and compute index difference (days waited).',
        edgeCases: ['Temperatures strictly decreasing (result is all 0s)', 'All temperatures identical', 'Single day temperature'],
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)'
      },
      repetitionNumber: 0,
      easinessFactor: 2.5,
      intervalDays: 1,
      nextReviewDate: today, // DUE TODAY
      lastReviewedAt: yesterday,
      status: 'LEARNING'
    },

    // 6. Monotonic Stack (Reviewing)
    {
      userId,
      title: '84. Largest Rectangle in Histogram',
      titleSlug: 'largest-rectangle-in-histogram',
      problemUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
      platform: 'LeetCode',
      difficulty: 'Hard',
      pattern: 'Monotonic Stack',
      topicTags: ['Array', 'Stack', 'Monotonic Stack'],
      journal: {
        coreIntuition: 'For each bar, find how far it can extend left and right where all bars >= current height. Maintain a monotonically increasing stack to determine boundaries.',
        edgeCases: ['Heights strictly increasing or strictly decreasing', 'All heights zero', 'Single tall bar'],
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)'
      },
      repetitionNumber: 1,
      easinessFactor: 2.2,
      intervalDays: 2,
      nextReviewDate: new Date(now + 1 * DAY_MS),
      lastReviewedAt: threeDaysAgo,
      status: 'REVIEWING'
    },

    // 7. Binary Search (Mastered)
    {
      userId,
      title: '33. Search in Rotated Sorted Array',
      titleSlug: 'search-in-rotated-sorted-array',
      problemUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
      platform: 'LeetCode',
      difficulty: 'Medium',
      pattern: 'Binary Search',
      topicTags: ['Array', 'Binary Search'],
      journal: {
        coreIntuition: 'In any rotated sorted array, one half (left or right of mid) is guaranteed to be strictly sorted. Determine which half is sorted, then check if target falls in its bounds.',
        edgeCases: ['Array rotated 0 times (already sorted)', '1 or 2 elements', 'Target not present'],
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)'
      },
      repetitionNumber: 4,
      easinessFactor: 2.6,
      intervalDays: 30,
      nextReviewDate: new Date(now + 22 * DAY_MS),
      lastReviewedAt: eightDaysAgo,
      status: 'MASTERED'
    },

    // 8. Dynamic Programming (Due Today)
    {
      userId,
      title: '300. Longest Increasing Subsequence',
      titleSlug: 'longest-increasing-subsequence',
      problemUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/',
      platform: 'LeetCode',
      difficulty: 'Medium',
      pattern: 'Dynamic Programming (1D/2D)',
      topicTags: ['Array', 'Binary Search', 'Dynamic Programming'],
      journal: {
        coreIntuition: 'Patience sorting / DP with tails array. Maintain array "tails" where tails[i] stores smallest tail of all increasing subsequences of length i+1. Use binary search to replace or append.',
        edgeCases: ['Strictly decreasing array (result = 1)', 'Array with duplicate elements', 'Negative numbers'],
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(N)'
      },
      repetitionNumber: 1,
      easinessFactor: 2.3,
      intervalDays: 2,
      nextReviewDate: today, // DUE TODAY
      lastReviewedAt: fiveDaysAgo,
      status: 'REVIEWING'
    },

    // 9. Fast & Slow Pointers (Mastered)
    {
      userId,
      title: '141. Linked List Cycle',
      titleSlug: 'linked-list-cycle',
      problemUrl: 'https://leetcode.com/problems/linked-list-cycle/',
      platform: 'LeetCode',
      difficulty: 'Easy',
      pattern: 'Fast & Slow Pointers',
      topicTags: ['Linked List', 'Two Pointers'],
      journal: {
        coreIntuition: 'Floyds Tortoise and Hare algorithm. Slow moves 1 step, fast moves 2 steps. If a cycle exists, fast pointer will inevitably lap slow inside the loop.',
        edgeCases: ['Empty list (head == null)', 'Single node without cycle', 'Single node self-looping'],
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)'
      },
      repetitionNumber: 5,
      easinessFactor: 2.8,
      intervalDays: 45,
      nextReviewDate: new Date(now + 35 * DAY_MS),
      lastReviewedAt: twentyDaysAgo,
      status: 'MASTERED'
    },

    // 10. Graph BFS / DFS (Reviewing)
    {
      userId,
      title: '200. Number of Islands',
      titleSlug: 'number-of-islands',
      problemUrl: 'https://leetcode.com/problems/number-of-islands/',
      platform: 'LeetCode',
      difficulty: 'Medium',
      pattern: 'Graph BFS / DFS',
      topicTags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'],
      journal: {
        coreIntuition: 'Iterate through grid. Whenever an unvisited "1" is encountered, increment island count and trigger DFS/BFS to sink all connected land cells by flipping them to "0".',
        edgeCases: ['Grid with all "0"s (no islands)', 'Grid with all "1"s (single giant island)', '1x1 grid'],
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(M * N) recursion stack'
      },
      repetitionNumber: 3,
      easinessFactor: 2.5,
      intervalDays: 14,
      nextReviewDate: new Date(now + 8 * DAY_MS),
      lastReviewedAt: fiveDaysAgo,
      status: 'REVIEWING'
    }
  ];
}

function getDemoReviewLogs(userId, problems) {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();

  const logs = [];
  problems.forEach((p, index) => {
    // Generate 1-2 realistic past reviews
    logs.push({
      userId,
      problemId: p._id,
      pattern: p.pattern,
      rating: 4,
      previousInterval: 0,
      newInterval: 1,
      newEasinessFactor: 2.5,
      timeSpentSeconds: 65,
      reviewedAt: new Date(now - (index + 1) * DAY_MS)
    });

    if (p.repetitionNumber > 1) {
      logs.push({
        userId,
        problemId: p._id,
        pattern: p.pattern,
        rating: 5,
        previousInterval: 1,
        newInterval: 6,
        newEasinessFactor: 2.6,
        timeSpentSeconds: 42,
        reviewedAt: new Date(now - Math.max(1, index) * DAY_MS)
      });
    }
  });

  return logs;
}

module.exports = {
  getDemoProblems,
  getDemoReviewLogs
};
