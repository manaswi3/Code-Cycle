import React, { useState } from 'react';
import { X, Sparkles, Loader2, Link2, AlertCircle, CheckCircle } from 'lucide-react';
import { fetchLeetCodeMetadata, createProblem } from '../services/api';

const COMMON_PATTERNS = [
  'Sliding Window',
  'Two Pointers',
  'Fast & Slow Pointers',
  'Monotonic Stack',
  'Binary Search',
  'Top-K / Heap',
  'Merge Intervals',
  'Dynamic Programming (1D/2D)',
  '0/1 Knapsack & Subset Sum',
  'Graph BFS / DFS',
  'Topological Sort',
  'Trie / Prefix Tree',
  'Backtracking',
  'Bit Manipulation',
  'Greedy',
  'Tree Traversal'
];

export default function AddProblemModal({ isOpen, onClose, onProblemAdded }) {
  const [url, setUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [fetchSuccess, setFetchSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    titleSlug: '',
    problemUrl: '',
    platform: 'LeetCode',
    difficulty: 'Medium',
    pattern: 'Sliding Window',
    topicTags: [],
    coreIntuition: '',
    edgeCases: '',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    codeSnippet: '',
    initialConfidence: 3
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAutoFetch = async () => {
    if (!url.trim()) {
      setFetchError('Please paste a valid problem URL first');
      return;
    }

    setIsFetching(true);
    setFetchError('');
    setFetchSuccess(false);

    try {
      const res = await fetchLeetCodeMetadata(url);
      const data = res.data.data;

      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        titleSlug: data.titleSlug || prev.titleSlug,
        problemUrl: url,
        difficulty: data.difficulty || prev.difficulty,
        topicTags: data.topicTags || [],
        platform: 'LeetCode'
      }));

      // Auto-suggest pattern if matched in tags
      const matchedTag = (data.topicTags || []).find(tag => 
        COMMON_PATTERNS.some(p => p.toLowerCase().includes(tag.toLowerCase()))
      );
      if (matchedTag) {
        const found = COMMON_PATTERNS.find(p => p.toLowerCase().includes(matchedTag.toLowerCase()));
        if (found) {
          setFormData(prev => ({ ...prev, pattern: found }));
        }
      }

      setFetchSuccess(true);
    } catch (err) {
      console.error(err);
      setFetchError(err.response?.data?.message || 'Could not auto-fetch from LeetCode. You can fill details manually below.');
      setFormData(prev => ({ ...prev, problemUrl: url }));
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.problemUrl || !formData.coreIntuition) {
      alert('Please fill the Title, URL, and Core Intuition');
      return;
    }

    setIsSubmitting(true);
    try {
      const edgeCasesList = formData.edgeCases
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      await createProblem({
        title: formData.title,
        titleSlug: formData.titleSlug,
        problemUrl: formData.problemUrl,
        platform: formData.platform,
        difficulty: formData.difficulty,
        pattern: formData.pattern,
        topicTags: formData.topicTags,
        journal: {
          coreIntuition: formData.coreIntuition,
          edgeCases: edgeCasesList,
          timeComplexity: formData.timeComplexity,
          spaceComplexity: formData.spaceComplexity,
          codeSnippet: formData.codeSnippet
        },
        initialConfidence: formData.initialConfidence
      });

      onProblemAdded();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save problem');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-[#0e141e] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00843d]" />
              Log Solved Problem & Schedule Revision
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Captures intuition & initializes SM-2 interval algorithm</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* URL & Auto-fetch Banner */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
            <label className="block text-xs font-bold text-[#00843d] uppercase tracking-wider">
              Paste Problem URL (Auto-Extract via LeetCode GraphQL)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://leetcode.com/problems/longest-substring-without-repeating-characters/"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00843d] shadow-2xs"
                />
              </div>
              <button
                type="button"
                onClick={handleAutoFetch}
                disabled={isFetching}
                className="px-4 py-2 bg-[#00843d] hover:bg-[#006e33] disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all shadow-sm"
              >
                {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Auto-Fill
              </button>
            </div>

            {fetchSuccess && (
              <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                <CheckCircle className="w-3.5 h-3.5" /> Metadata fetched from LeetCode successfully!
              </p>
            )}
            {fetchError && (
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {fetchError}
              </p>
            )}
          </div>

          {/* Title & Platform */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700">Problem Title</label>
              <input
                type="text"
                required
                placeholder="e.g. 3. Longest Substring Without Repeating Characters"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#00843d]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:border-[#00843d]"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Pattern Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Primary Algorithmic Pattern</span>
              <span className="text-[11px] text-[#00843d] font-bold">Classifies memory bucket</span>
            </label>
            <select
              value={formData.pattern}
              onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:border-[#00843d]"
            >
              {COMMON_PATTERNS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Structured DSA Journal Section */}
          <div className="border-t border-slate-200 pt-4 space-y-4">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Learning Journal (Intuition-First)
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>The "Aha!" Moment / Core Intuition</span>
                <span className="text-[11px] text-slate-400">What invariant or trigger solves this?</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Maintain a sliding window with left and right pointers. Use a map of char->last_index. When duplicate seen, jump left = max(left, last_index + 1)."
                value={formData.coreIntuition}
                onChange={(e) => setFormData({ ...formData, coreIntuition: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#00843d]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Tricky Gotchas & Edge Cases (1 per line)</span>
                <span className="text-[11px] text-slate-400">Where could you get Wrong Answer?</span>
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Empty string &#10;String with all identical characters ('bbbb')&#10;Spaces or special symbols"
                value={formData.edgeCases}
                onChange={(e) => setFormData({ ...formData, edgeCases: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#00843d]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Time Complexity</label>
                <input
                  type="text"
                  placeholder="O(N)"
                  value={formData.timeComplexity}
                  onChange={(e) => setFormData({ ...formData, timeComplexity: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#00843d]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Space Complexity</label>
                <input
                  type="text"
                  placeholder="O(min(N, M))"
                  value={formData.spaceComplexity}
                  onChange={(e) => setFormData({ ...formData, spaceComplexity: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#00843d]"
                />
              </div>
            </div>

            {/* Initial Confidence */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Initial Solving Confidence</span>
                <span className="text-[11px] text-slate-400">Higher confidence schedules revision in 3 days vs 1 day</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormData({ ...formData, initialConfidence: lvl })}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      formData.initialConfidence === lvl
                        ? 'bg-[#00843d] border-[#00843d] text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Level {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#00843d] hover:bg-[#006e33] active:bg-[#005a29] disabled:opacity-50 text-white text-sm font-bold rounded-lg shadow-sm shadow-emerald-700/20 transition-all flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save & Schedule SM-2
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
