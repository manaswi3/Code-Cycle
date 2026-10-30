// import axios from 'axios';
// import { INITIAL_DEMO_PROBLEMS, DEMO_USER } from './mockData';

// const API_BASE = '/api';

// const api = axios.create({
//   baseURL: API_BASE,
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   timeout: 5000
// });

// // Interceptor to inject JWT token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// function getLocalProblems() {
//   const stored = localStorage.getItem('algo_demo_problems');
//   if (!stored) {
//     localStorage.setItem('algo_demo_problems', JSON.stringify(INITIAL_DEMO_PROBLEMS));
//     return INITIAL_DEMO_PROBLEMS;
//   }
//   return JSON.parse(stored);
// }

// function saveLocalProblems(problems) {
//   localStorage.setItem('algo_demo_problems', JSON.stringify(problems));
// }

// function computeLocalAnalytics(problems) {
//   const patternMap = {};
//   problems.forEach(p => {
//     if (!patternMap[p.pattern]) {
//       patternMap[p.pattern] = {
//         pattern: p.pattern,
//         totalProblems: 0,
//         masteredProblems: 0,
//         retentionSum: 0,
//         lastPracticed: null
//       };
//     }
//     patternMap[p.pattern].totalProblems += 1;
//     patternMap[p.pattern].retentionSum += (p.retentionScore || 0.7);
//     if (p.status === 'MASTERED') patternMap[p.pattern].masteredProblems += 1;
//     if (!patternMap[p.pattern].lastPracticed || new Date(p.lastReviewedAt) > new Date(patternMap[p.pattern].lastPracticed)) {
//       patternMap[p.pattern].lastPracticed = p.lastReviewedAt;
//     }
//   });

//   const matrix = Object.values(patternMap).map(pat => {
//     const avg = Math.round((pat.retentionSum / pat.totalProblems) * 100);
//     let healthStatus = 'FRESH';
//     if (avg < 50) healthStatus = 'CRITICAL';
//     else if (avg < 75) healthStatus = 'FADING';

//     return {
//       pattern: pat.pattern,
//       totalProblems: pat.totalProblems,
//       masteredProblems: pat.masteredProblems,
//       retentionPercentage: avg,
//       healthStatus,
//       lastPracticed: pat.lastPracticed
//     };
//   });

//   const reviewsTodayCount = Number(localStorage.getItem('algo_reviews_today') || '0');

//   return {
//     totalProblems: problems.length,
//     reviewsToday: reviewsTodayCount,
//     patternHealthMatrix: matrix
//   };
// }

// // Auth APIs with offline fallback
// export const registerUser = async (userData) => {
//   try {
//     return await api.post('/auth/register', userData);
//   } catch (err) {
//     return { data: { success: true, token: 'offline-demo-token', user: DEMO_USER } };
//   }
// };

// export const loginUser = async (credentials) => {
//   try {
//     return await api.post('/auth/login', credentials);
//   } catch (err) {
//     return { data: { success: true, token: 'offline-demo-token', user: DEMO_USER } };
//   }
// };

// export const getMe = async () => {
//   try {
//     return await api.get('/auth/me');
//   } catch (err) {
//     return { data: { success: true, user: DEMO_USER } };
//   }
// };

// // Problem APIs with offline fallback
// export const fetchLeetCodeMetadata = async (url) => {
//   try {
//     return await api.post('/problems/fetch-metadata', { url });
//   } catch (err) {
//     const match = url.match(/problems\/([a-zA-Z0-9-_]+)/);
//     const slug = match ? match[1] : 'sample-problem';
//     const cleanTitle = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
//     return {
//       data: {
//         success: true,
//         data: {
//           title: cleanTitle,
//           titleSlug: slug,
//           difficulty: 'Medium',
//           topicTags: ['Array', 'Two Pointers']
//         }
//       }
//     };
//   }
// };

// export const createProblem = async (problemData) => {
//   try {
//     return await api.post('/problems', problemData);
//   } catch (err) {
//     const problems = getLocalProblems();
//     const newProb = {
//       _id: 'local-' + Date.now(),
//       ...problemData,
//       repetitionNumber: 0,
//       easinessFactor: 2.5,
//       intervalDays: 1,
//       nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
//       lastReviewedAt: new Date().toISOString(),
//       status: 'LEARNING',
//       retentionScore: 1.0
//     };
//     problems.unshift(newProb);
//     saveLocalProblems(problems);
//     return { data: { success: true, data: newProb } };
//   }
// };

// export const getProblems = async (params) => {
//   try {
//     return await api.get('/problems', { params });
//   } catch (err) {
//     const problems = getLocalProblems();
//     return { data: { success: true, data: problems } };
//   }
// };

// export const getProblemById = async (id) => {
//   try {
//     return await api.get(`/problems/${id}`);
//   } catch (err) {
//     const problems = getLocalProblems();
//     const found = problems.find(p => p._id === id);
//     return { data: { success: true, data: found } };
//   }
// };

// export const updateProblem = async (id, data) => {
//   try {
//     return await api.put(`/problems/${id}`, data);
//   } catch (err) {
//     const problems = getLocalProblems();
//     const index = problems.findIndex(p => p._id === id);
//     if (index !== -1) {
//       problems[index] = { ...problems[index], ...data };
//       saveLocalProblems(problems);
//     }
//     return { data: { success: true, data: problems[index] } };
//   }
// };

// export const deleteProblem = async (id) => {
//   try {
//     return await api.delete(`/problems/${id}`);
//   } catch (err) {
//     const problems = getLocalProblems();
//     const filtered = problems.filter(p => p._id !== id);
//     saveLocalProblems(filtered);
//     return { data: { success: true } };
//   }
// };

// // Revision / SM-2 APIs with offline fallback
// export const getDailyQueue = async () => {
//   try {
//     return await api.get('/reviews/today');
//   } catch (err) {
//     const problems = getLocalProblems();
//     const now = new Date();
//     // Due today: problems where nextReviewDate <= now
//     const queue = problems.filter(p => new Date(p.nextReviewDate) <= now).slice(0, 5);
//     return {
//       data: {
//         success: true,
//         count: queue.length,
//         data: queue
//       }
//     };
//   }
// };

// // AI Reasoning Evaluator API
// export const evaluateRecall = async (problemId, answers) => {
//   try {
//     return await api.post(`/reviews/${problemId}/evaluate`, { answers });
//   } catch (err) {
//     const opt = (answers?.optimalApproach || '').toLowerCase();
//     const nailed = [];
//     const corrections = [];
//     const missed = [];
//     let score = 75;

//     if (answers?.naiveApproach?.length > 10) {
//       nailed.push('Accurately formulated the naive brute force baseline.');
//       score += 5;
//     }
//     if (answers?.bottleneck?.length > 10) {
//       nailed.push('Identified the redundant computation bottleneck.');
//       score += 5;
//     }
//     if (opt.length > 20) {
//       nailed.push('Outlined a clear logical progression for optimal execution.');
//       score += 5;
//     }

//     if (answers?.complexityReason?.length < 10) {
//       missed.push('Complexity justification was brief. Make sure to specify both Time and Space.');
//       score -= 10;
//     } else {
//       nailed.push('Specified Big-O complexity expectations.');
//     }

//     score = Math.min(95, Math.max(50, score));

//     return {
//       data: {
//         success: true,
//         data: {
//           greeting: `Great job! Your reasoning is focused and structured.`,
//           score,
//           nailed,
//           corrections: [
//             {
//               stated: answers?.optimalApproach?.slice(0, 70) || 'Generic explanation',
//               improved: 'Ensure you highlight the exact data structure (e.g. Hash Map / Stack) that guarantees O(1) state lookup.'
//             }
//           ],
//           missed: [
//             'Remember to explicitly state edge cases like empty inputs or identical character sets.'
//           ],
//           suggestedQuality: score >= 85 ? 5 : score >= 70 ? 4 : 3
//         }
//       }
//     };
//   }
// };

// export const submitReview = async (problemId, data) => {
//   try {
//     return await api.post(`/reviews/${problemId}/submit`, data);
//   } catch (err) {
//     const problems = getLocalProblems();
//     const problem = problems.find(p => p._id === problemId);
//     if (problem) {
//       const q = data.quality;
//       let newInterval = 1;
//       if (q >= 3) {
//         newInterval = problem.repetitionNumber === 0 ? 1 : problem.repetitionNumber === 1 ? 6 : Math.round(problem.intervalDays * problem.easinessFactor);
//         problem.repetitionNumber += 1;
//       } else {
//         problem.repetitionNumber = 0;
//         newInterval = 1;
//       }
//       problem.intervalDays = newInterval;
      
//       // Schedule to future date so it clears from today's queue
//       const nextDate = new Date();
//       nextDate.setDate(nextDate.getDate() + newInterval);
//       nextDate.setHours(0, 0, 0, 0);
//       problem.nextReviewDate = nextDate.toISOString();
//       problem.lastReviewedAt = new Date().toISOString();
//       problem.retentionScore = 1.0;
//       if (problem.repetitionNumber >= 4) problem.status = 'MASTERED';
//       saveLocalProblems(problems);

//       // Increment daily reviewed count
//       const currentReviews = Number(localStorage.getItem('algo_reviews_today') || '0') + 1;
//       localStorage.setItem('algo_reviews_today', currentReviews.toString());
//     }
//     return { data: { success: true } };
//   }
// };

// export const getAnalytics = async () => {
//   try {
//     return await api.get('/reviews/analytics');
//   } catch (err) {
//     const problems = getLocalProblems();
//     return { data: { success: true, data: computeLocalAnalytics(problems) } };
//   }
// };

// export default api;


import axios from 'axios';
import { INITIAL_DEMO_PROBLEMS, DEMO_USER } from './mockData';

const API_BASE = '/api';

// Offline demo mode is ONLY entered when the user explicitly chooses it
// (AuthModal -> "Continue in offline demo"). It is never entered silently.
export const DEMO_TOKEN = 'offline-demo-token';
export const isDemoMode = () => localStorage.getItem('token') === DEMO_TOKEN;

// True only when the server could not be reached at all (no HTTP response).
export const isNetworkError = (err) => !err?.response;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

// Interceptor to inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function getLocalProblems() {
  const stored = localStorage.getItem('algo_demo_problems');
  if (!stored) {
    localStorage.setItem('algo_demo_problems', JSON.stringify(INITIAL_DEMO_PROBLEMS));
    return INITIAL_DEMO_PROBLEMS;
  }
  return JSON.parse(stored);
}

function saveLocalProblems(problems) {
  localStorage.setItem('algo_demo_problems', JSON.stringify(problems));
}

function computeLocalAnalytics(problems) {
  const patternMap = {};
  problems.forEach(p => {
    if (!patternMap[p.pattern]) {
      patternMap[p.pattern] = {
        pattern: p.pattern,
        totalProblems: 0,
        masteredProblems: 0,
        retentionSum: 0,
        lastPracticed: null
      };
    }
    patternMap[p.pattern].totalProblems += 1;
    patternMap[p.pattern].retentionSum += (p.retentionScore ?? 0.7);
    if (p.status === 'MASTERED') patternMap[p.pattern].masteredProblems += 1;
    if (!patternMap[p.pattern].lastPracticed || new Date(p.lastReviewedAt) > new Date(patternMap[p.pattern].lastPracticed)) {
      patternMap[p.pattern].lastPracticed = p.lastReviewedAt;
    }
  });

  const matrix = Object.values(patternMap).map(pat => {
    const avg = Math.round((pat.retentionSum / pat.totalProblems) * 100);
    let healthStatus = 'FRESH';
    if (avg < 50) healthStatus = 'CRITICAL';
    else if (avg < 75) healthStatus = 'FADING';

    return {
      pattern: pat.pattern,
      totalProblems: pat.totalProblems,
      masteredProblems: pat.masteredProblems,
      retentionPercentage: avg,
      healthStatus,
      lastPracticed: pat.lastPracticed
    };
  });

  const reviewsTodayCount = Number(localStorage.getItem('algo_reviews_today') || '0');

  return {
    totalProblems: problems.length,
    reviewsToday: reviewsTodayCount,
    patternHealthMatrix: matrix
  };
}

// Auth APIs — real server only. Errors propagate so the UI can show them.
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);

export const getMe = async () => {
  if (isDemoMode()) return { data: { success: true, user: DEMO_USER } };
  return api.get('/auth/me');
};

// Problem APIs — server by default, localStorage only in explicit demo mode
export const fetchLeetCodeMetadata = async (url) => {
  if (!isDemoMode()) {
    // LeetCode can be slow; give it more time than the default 5s.
    return api.post('/problems/fetch-metadata', { url }, { timeout: 15000 });
  }
  // Demo mode: derive only what is truly known (the title). No invented difficulty/tags.
  const match = url.match(/problems\/([a-zA-Z0-9-_]+)/);
  const slug = match ? match[1] : '';
  const title = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  return { data: { success: true, data: { title, titleSlug: slug, topicTags: [] } } };
};

export const createProblem = async (problemData) => {
  if (!isDemoMode()) return api.post('/problems', problemData);

    const problems = getLocalProblems();
    const newProb = {
      _id: 'local-' + Date.now(),
      ...problemData,
      repetitionNumber: 0,
      easinessFactor: 2.5,
      intervalDays: 1,
      nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      lastReviewedAt: new Date().toISOString(),
      status: 'LEARNING',
      retentionScore: 1.0
    };
    problems.unshift(newProb);
    saveLocalProblems(problems);
    return { data: { success: true, data: newProb } };
};

export const getProblems = async (params) => {
  if (!isDemoMode()) return api.get('/problems', { params });

    const problems = getLocalProblems();
    return { data: { success: true, data: problems } };
};

export const getProblemById = async (id) => {
  if (!isDemoMode()) return api.get(`/problems/${id}`);

    const problems = getLocalProblems();
    const found = problems.find(p => p._id === id);
    return { data: { success: true, data: found } };
};

export const updateProblem = async (id, data) => {
  if (!isDemoMode()) return api.put(`/problems/${id}`, data);

    const problems = getLocalProblems();
    const index = problems.findIndex(p => p._id === id);
    if (index !== -1) {
      problems[index] = { ...problems[index], ...data };
      saveLocalProblems(problems);
    }
    return { data: { success: true, data: problems[index] } };
};

export const deleteProblem = async (id) => {
  if (!isDemoMode()) return api.delete(`/problems/${id}`);

    const problems = getLocalProblems();
    const filtered = problems.filter(p => p._id !== id);
    saveLocalProblems(filtered);
    return { data: { success: true } };
};

// Revision / SM-2 APIs — server by default, localStorage only in explicit demo mode
export const getDailyQueue = async () => {
  if (!isDemoMode()) return api.get('/reviews/today');

    const problems = getLocalProblems();
    const now = new Date();
    // Due today: problems where nextReviewDate <= now
    const queue = problems.filter(p => new Date(p.nextReviewDate) <= now).slice(0, 5);
    return {
      data: {
        success: true,
        count: queue.length,
        data: queue
      }
    };
};

// AI Reasoning Evaluator API
export const evaluateRecall = async (problemId, answers) => {
  if (!isDemoMode()) return api.post(`/reviews/${problemId}/evaluate`, { answers });

    const opt = (answers?.optimalApproach || '').toLowerCase();
    const nailed = [];
    const corrections = [];
    const missed = [];
    let score = 75;

    if (answers?.naiveApproach?.length > 10) {
      nailed.push('Accurately formulated the naive brute force baseline.');
      score += 5;
    }
    if (answers?.bottleneck?.length > 10) {
      nailed.push('Identified the redundant computation bottleneck.');
      score += 5;
    }
    if (opt.length > 20) {
      nailed.push('Outlined a clear logical progression for optimal execution.');
      score += 5;
    }

    if (answers?.complexityReason?.length < 10) {
      missed.push('Complexity justification was brief. Make sure to specify both Time and Space.');
      score -= 10;
    } else {
      nailed.push('Specified Big-O complexity expectations.');
    }

    score = Math.min(95, Math.max(50, score));

    return {
      data: {
        success: true,
        data: {
          greeting: `Great job! Your reasoning is focused and structured.`,
          score,
          nailed,
          corrections: [
            {
              stated: answers?.optimalApproach?.slice(0, 70) || 'Generic explanation',
              improved: 'Ensure you highlight the exact data structure (e.g. Hash Map / Stack) that guarantees O(1) state lookup.'
            }
          ],
          missed: [
            'Remember to explicitly state edge cases like empty inputs or identical character sets.'
          ],
          suggestedQuality: score >= 85 ? 5 : score >= 70 ? 4 : 3
        }
      }
    };
};

export const submitReview = async (problemId, data) => {
  if (!isDemoMode()) return api.post(`/reviews/${problemId}/submit`, data);

    const problems = getLocalProblems();
    const problem = problems.find(p => p._id === problemId);
    if (problem) {
      const q = data.quality;
      let newInterval = 1;
      if (q >= 3) {
        newInterval = problem.repetitionNumber === 0 ? 1 : problem.repetitionNumber === 1 ? 6 : Math.round(problem.intervalDays * problem.easinessFactor);
        problem.repetitionNumber += 1;
      } else {
        problem.repetitionNumber = 0;
        newInterval = 1;
      }
      problem.intervalDays = newInterval;
      
      // Schedule to future date so it clears from today's queue
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + newInterval);
      nextDate.setHours(0, 0, 0, 0);
      problem.nextReviewDate = nextDate.toISOString();
      problem.lastReviewedAt = new Date().toISOString();
      problem.retentionScore = 1.0;
      if (problem.repetitionNumber >= 4) problem.status = 'MASTERED';
      saveLocalProblems(problems);

      // Increment daily reviewed count
      const currentReviews = Number(localStorage.getItem('algo_reviews_today') || '0') + 1;
      localStorage.setItem('algo_reviews_today', currentReviews.toString());
    }
    return { data: { success: true } };
};

export const getAnalytics = async () => {
  if (!isDemoMode()) return api.get('/reviews/analytics');

    const problems = getLocalProblems();
    return { data: { success: true, data: computeLocalAnalytics(problems) } };
};

export default api;