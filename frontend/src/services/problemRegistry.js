/**
 * Problem Description & Constraints Registry
 * Provides LeetCode-accurate statements, formatted examples, and constraints.
 */

export const PROBLEM_REGISTRY = {
  'longest-substring-without-repeating-characters': {
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
        explanation: 'The answer is "wke", with the length of 3. Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ]
  },

  'daily-temperatures': {
    statement: 'Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.',
    examples: [
      {
        input: 'temperatures = [73,74,75,71,69,72,76,73]',
        output: '[1,1,4,2,1,1,0,0]',
        explanation: 'Day 0 is 73; next warmer day is Day 1 (74), so wait 1 day. Day 2 is 75; next warmer day is Day 6 (76), so wait 4 days.'
      },
      {
        input: 'temperatures = [30,40,50,60]',
        output: '[1,1,1,0]',
        explanation: 'Each consecutive day is warmer, so wait 1 day for each except the last.'
      },
      {
        input: 'temperatures = [30,60,90]',
        output: '[1,1,0]',
        explanation: 'Day 0 to Day 1 is 1 day. Day 1 to Day 2 is 1 day. Day 2 has no warmer temperature.'
      }
    ],
    constraints: [
      '1 <= temperatures.length <= 10^5',
      '30 <= temperatures[i] <= 100'
    ]
  },

  '3sum': {
    statement: 'Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.',
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
        explanation: 'nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0. The distinct triplets are [-1,0,1] and [-1,-1,2]. The order of the output and the order of the triplets does not matter.'
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

  'longest-increasing-subsequence': {
    statement: 'Given an integer array `nums`, return the length of the longest strictly increasing subsequence.\n\nA subsequence is an array that can be derived from another array by deleting some or no elements without changing the order of the remaining elements.',
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
      },
      {
        input: 'nums = [7,7,7,7,7,7,7]',
        output: '1',
        explanation: 'The longest strictly increasing subsequence has length 1.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 2500',
      '-10^4 <= nums[i] <= 10^4'
    ]
  },

  'container-with-most-water': {
    statement: 'You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.',
    examples: [
      {
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        output: '49',
        explanation: 'The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49 (between index 1 and index 8).'
      },
      {
        input: 'height = [1,1]',
        output: '1',
        explanation: 'Width is 1, height is 1, max area is 1.'
      }
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ]
  },

  'search-in-rotated-sorted-array': {
    statement: 'There is an integer array `nums` sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, `nums` is possibly rotated at an unknown pivot index `k` (`1 <= k < nums.length`).\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
    examples: [
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 0',
        output: '4',
        explanation: '0 is located at index 4.'
      },
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 3',
        output: '-1',
        explanation: '3 is not in nums.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 5000',
      '-10^4 <= nums[i] <= 10^4',
      'All values of nums are unique.',
      '-10^4 <= target <= 10^4'
    ]
  },

  'linked-list-cycle': {
    statement: 'Given `head`, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer.\n\nReturn `true` if there is a cycle in the linked list. Otherwise, return `false`.',
    examples: [
      {
        input: 'head = [3,2,0,-4], pos = 1',
        output: 'true',
        explanation: 'There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).'
      },
      {
        input: 'head = [1,2], pos = 0',
        output: 'true',
        explanation: 'There is a cycle in the linked list, where the tail connects to the 0th node.'
      },
      {
        input: 'head = [1], pos = -1',
        output: 'false',
        explanation: 'There is no cycle in the linked list.'
      }
    ],
    constraints: [
      'The number of the nodes in the list is in the range [0, 10^4].',
      '-10^5 <= Node.val <= 10^5',
      'pos is -1 or a valid index in the linked-list.'
    ]
  },

  'number-of-islands': {
    statement: 'Given an `m x n` 2D binary grid `grid` which represents a map of `\'1\'`s (land) and `\'0\'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
    examples: [
      {
        input: 'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]',
        output: '1',
        explanation: 'All adjacent 1s connect to form a single island.'
      },
      {
        input: 'grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]',
        output: '3',
        explanation: 'There are 3 isolated islands.'
      }
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is \'0\' or \'1\'.'
    ]
  }
};

/**
 * Resolves problem description, examples and constraints dynamically.
 */
export function getProblemDetails(problem) {
  if (!problem) return {};

  // Check if problem already has custom statement
  if (problem.description?.statement && problem.description?.examples?.length > 0) {
    return problem.description;
  }

  // Derive slug
  let slug = problem.titleSlug;
  if (!slug && problem.title) {
    slug = problem.title.toLowerCase()
      .replace(/^[0-9]+[\.\s]*/, '') // remove "739. "
      .trim()
      .replace(/[^a-z0-9]+/g, '-');
  }

  // Lookup in registry
  if (slug && PROBLEM_REGISTRY[slug]) {
    return PROBLEM_REGISTRY[slug];
  }

  // Soft fuzzy match
  for (const [key, val] of Object.entries(PROBLEM_REGISTRY)) {
    if (slug?.includes(key) || key.includes(slug)) {
      return val;
    }
  }

  // Default fallback if unknown problem
  return {
    statement: problem.description?.statement || `Given the problem requirements for "${problem.title}", analyze the input constraints, formulate the naive baseline, and identify the optimal algorithm and data structures to avoid redundant computation.`,
    examples: problem.description?.examples || [
      {
        input: 'See LeetCode problem page for full input format',
        output: 'Expected optimal output',
        explanation: 'Solve within optimal Big-O bounds.'
      }
    ],
    constraints: problem.description?.constraints || [
      'Follow optimal time and space limits as specified on the platform.'
    ]
  };
}
