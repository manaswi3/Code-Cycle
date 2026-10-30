/**
 * LeetCode Official GraphQL Query Utility
 * Extracts problem titleSlug and queries LeetCode public GraphQL endpoint.
 */

/**
 * Extracts titleSlug from any valid LeetCode problem URL.
 * e.g., "https://leetcode.com/problems/longest-substring-without-repeating-characters/description/"
 * -> "longest-substring-without-repeating-characters"
 *
 * @param {string} url 
 * @returns {string|null} titleSlug
 */
function extractTitleSlug(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/leetcode\.com\/problems\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

/**
 * Fetches question metadata from LeetCode GraphQL API.
 * 
 * @param {string} titleSlug 
 * @returns {Promise<Object>} { title, difficulty, topicTags, questionId }
 */
async function fetchLeetCodeQuestion(titleSlug) {
  const query = `
    query getQuestionDetail($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        questionFrontendId
        title
        titleSlug
        difficulty
        topicTags {
          name
          slug
        }
      }
    }
  `;

  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    body: JSON.stringify({
      query,
      variables: { titleSlug }
    })
  });

  if (!response.ok) {
    throw new Error(`LeetCode API responded with HTTP status ${response.status}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(json.errors[0]?.message || 'GraphQL query error');
  }

  const question = json.data?.question;
  if (!question) {
    throw new Error(`Problem not found for slug: ${titleSlug}`);
  }

  return {
    questionId: question.questionFrontendId || question.questionId,
    title: question.title,
    titleSlug: question.titleSlug,
    difficulty: question.difficulty, // "Easy", "Medium", "Hard"
    topicTags: (question.topicTags || []).map(t => t.name)
  };
}

module.exports = {
  extractTitleSlug,
  fetchLeetCodeQuestion
};
