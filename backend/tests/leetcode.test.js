const test = require('node:test');
const assert = require('node:assert/strict');
const { extractTitleSlug } = require('../src/utils/leetcode');

test('extractTitleSlug extracts correct slug from standard LeetCode problem URLs', () => {
  const url1 = 'https://leetcode.com/problems/longest-substring-without-repeating-characters/';
  assert.equal(extractTitleSlug(url1), 'longest-substring-without-repeating-characters');

  const url2 = 'https://leetcode.com/problems/trapping-rain-water/description/?envType=study-plan-v2';
  assert.equal(extractTitleSlug(url2), 'trapping-rain-water');

  const url3 = 'https://leetcode.com/problems/two-sum';
  assert.equal(extractTitleSlug(url3), 'two-sum');
});

test('extractTitleSlug returns null for invalid URLs', () => {
  assert.equal(extractTitleSlug('https://google.com'), null);
  assert.equal(extractTitleSlug(''), null);
  assert.equal(extractTitleSlug(null), null);
});
