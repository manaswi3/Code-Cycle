/**
 * Client-side Realistic Mock Dataset for Demo User (Rohan Sharma)
 * Features full LeetCode-style descriptions, examples, and constraints.
 */

export const INITIAL_DEMO_PROBLEMS = [
  {
    _id: 'demo-p1',
    title: '3. Longest Substring Without Repeating Characters',
    titleSlug: 'longest-substring-without-repeating-characters',
    problemUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    platform: 'LeetCode',
    difficulty: 'Medium',
    pattern: 'Sliding Window',
    topicTags: ['Hash Table', 'String', 'Sliding Window'],
    description: {
      statement: 'Given a string `s`, find the length of the longest substring without duplicate characters.',
      examples: [
        {
          input: 's = "abcabcbb"',
          output: '3',
          explanation: 'The answer is "abc", with the length of 3.'
        },
        {
          input: 's = "bbbbb"',
          output: '1',
          explanation: 'The answer is "b", with the length of 1.'
        },
        {
          input: 's = "pwwkew"',
          output: '3',
          explanation: 'The answer is "wke", with the length of 3. Notice that the answer must be a substring, "pwke" is a subsequence.'
        }
      ],
      constraints: [
        '0 <= s.length <= 5 * 10^4',
        's consists of English letters, digits, symbols and spaces.'
      ]
    },
    journal: {
      coreIntuition: 'Maintain a window [left, right]. Use a hash map of char -> last seen index. When duplicate seen, jump left to max(left, lastSeen + 1) to avoid re-evaluating.',
      edgeCases: ['Empty string ""', 'All identical characters "bbbbb"', 'Single character "a"'],
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(min(N, Sigma))'
    },
    repetitionNumber: 1,
    easinessFactor: 2.5,
    intervalDays: 1,
    nextReviewDate: new Date().toISOString(), // DUE TODAY
    lastReviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'REVIEWING',
    retentionScore: 0.65
  },
  {
    _id: 'demo-p2',
    title: '15. 3Sum',
    titleSlug: '3sum',
    problemUrl: 'https://leetcode.com/problems/3sum/',
    platform: 'LeetCode',
    difficulty: 'Medium',
    pattern: 'Two Pointers',
    topicTags: ['Array', 'Two Pointers', 'Sorting'],
    description: {
      statement: 'Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`. Notice that the solution set must not contain duplicate triplets.',
      examples: [
        {
          input: 'nums = [-1,0,1,2,-1,-4]',
          output: '[[-1,-1,2],[-1,0,1]]',
          explanation: 'The distinct triplets are [-1,0,1] and [-1,-1,2]. The order of output does not matter.'
        },
        {
          input: 'nums = [0,1,1]',
          output: '[]',
          explanation: 'The only possible triplet does not sum up to 0.'
        },
        {
          input: 'nums = [0,0,0]',
          output: '[[0,0,0]]',
          explanation: 'The only possible triplet sums up to 0.'
        }
      ],
      constraints: [
        '3 <= nums.length <= 3000',
        '-10^5 <= nums[i] <= 10^5'
      ]
    },
    journal: {
      coreIntuition: 'Sort array first. Fix element i, then use two pointers (left = i+1, right = n-1) to find pairs summing to -nums[i]. Skip duplicates to guarantee unique triplets.',
      edgeCases: ['Array with fewer than 3 elements', 'All zeros [0, 0, 0, 0]'],
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(1) extra'
    },
    repetitionNumber: 1,
    easinessFactor: 2.4,
    intervalDays: 1,
    nextReviewDate: new Date().toISOString(), // DUE TODAY
    lastReviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'REVIEWING',
    retentionScore: 0.60
  },
  {
    _id: 'demo-p3',
    title: '739. Daily Temperatures',
    titleSlug: 'daily-temperatures',
    problemUrl: 'https://leetcode.com/problems/daily-temperatures/',
    platform: 'LeetCode',
    difficulty: 'Medium',
    pattern: 'Monotonic Stack',
    topicTags: ['Array', 'Stack', 'Monotonic Stack'],
    description: {
      statement: 'Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.',
      examples: [
        {
          input: 'temperatures = [73,74,75,71,69,72,76,73]',
          output: '[1,1,4,2,1,1,0,0]',
          explanation: 'For day 0 (73), day 1 is warmer (74) -> wait 1 day. For day 2 (75), day 6 is warmer (76) -> wait 4 days.'
        },
        {
          input: 'temperatures = [30,40,50,60]',
          output: '[1,1,1,0]',
          explanation: 'Each consecutive day is warmer.'
        }
      ],
      constraints: [
        '1 <= temperatures.length <= 10^5',
        '30 <= temperatures[i] <= 100'
      ]
    },
    journal: {
      coreIntuition: 'Keep a monotonically decreasing stack storing indices. When current temperature is warmer than stack top index temperature, pop and compute index difference (days waited).',
      edgeCases: ['Temperatures strictly decreasing (result is all 0s)', 'All temperatures identical'],
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)'
    },
    repetitionNumber: 0,
    easinessFactor: 2.5,
    intervalDays: 1,
    nextReviewDate: new Date().toISOString(), // DUE TODAY
    lastReviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'LEARNING',
    retentionScore: 0.40
  },
  {
    _id: 'demo-p4',
    title: '300. Longest Increasing Subsequence',
    titleSlug: 'longest-increasing-subsequence',
    problemUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    platform: 'LeetCode',
    difficulty: 'Medium',
    pattern: 'Dynamic Programming (1D/2D)',
    topicTags: ['Array', 'Binary Search', 'Dynamic Programming'],
    description: {
      statement: 'Given an integer array `nums`, return the length of the longest strictly increasing subsequence.',
      examples: [
        {
          input: 'nums = [10,9,2,5,3,7,101,18]',
          output: '4',
          explanation: 'The longest increasing subsequence is [2,3,7,101], therefore the length is 4.'
        },
        {
          input: 'nums = [0,1,0,3,2,3]',
          output: '4',
          explanation: 'The longest increasing subsequence is [0,1,2,3], length 4.'
        }
      ],
      constraints: [
        '1 <= nums.length <= 2500',
        '-10^4 <= nums[i] <= 10^4'
      ]
    },
    journal: {
      coreIntuition: 'Patience sorting / DP with tails array. Maintain array "tails" where tails[i] stores smallest tail of all increasing subsequences of length i+1. Use binary search to replace or append.',
      edgeCases: ['Strictly decreasing array (result = 1)', 'Array with duplicate elements'],
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)'
    },
    repetitionNumber: 1,
    easinessFactor: 2.3,
    intervalDays: 2,
    nextReviewDate: new Date().toISOString(), // DUE TODAY
    lastReviewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'REVIEWING',
    retentionScore: 0.48
  },
  {
    _id: 'demo-p5',
    title: '11. Container With Most Water',
    titleSlug: 'container-with-most-water',
    problemUrl: 'https://leetcode.com/problems/container-with-most-water/',
    platform: 'LeetCode',
    difficulty: 'Medium',
    pattern: 'Two Pointers',
    topicTags: ['Array', 'Two Pointers', 'Greedy'],
    description: {
      statement: 'You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`. Find two lines that together with the x-axis form a container, such that the container contains the most water.',
      examples: [
        {
          input: 'height = [1,8,6,2,5,4,8,3,7]',
          output: '49',
          explanation: 'The max area is between index 1 (height 8) and index 8 (height 7): area = min(8, 7) * (8 - 1) = 49.'
        }
      ],
      constraints: [
        'n == height.length',
        '2 <= n <= 10^5',
        '0 <= height[i] <= 10^4'
      ]
    },
    journal: {
      coreIntuition: 'Start with max width at pointers 0 and n-1. Area is limited by the shorter line. Moving the taller line can never yield larger area, so always move the shorter line inward.',
      edgeCases: ['Only 2 lines', 'All lines having equal height'],
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)'
    },
    repetitionNumber: 4,
    easinessFactor: 2.7,
    intervalDays: 28,
    nextReviewDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    lastReviewedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'MASTERED',
    retentionScore: 0.95
  }
];

export const DEMO_USER = {
  id: 'demo-user-123',
  name: 'Rohan Sharma',
  email: 'student@college.edu',
  targetGoal: 'Campus Placement Season 2026',
  dailyTargetReviewCount: 5
};
