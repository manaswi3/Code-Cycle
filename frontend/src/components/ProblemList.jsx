import React, { useState } from 'react';
import { Search, ExternalLink, Trash2, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { deleteProblem } from '../services/api';

export default function ProblemList({ problems = [], onProblemDeleted }) {
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.pattern.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}"?`)) {
      try {
        await deleteProblem(id);
        onProblemDeleted();
      } catch (err) {
        alert('Failed to delete problem');
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
      
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#0e141e]">Your Problem Library</h3>
          <p className="text-xs text-slate-500 mt-0.5">All solved problems with personal journal entries and SM-2 state</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search problem or pattern..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00843d] focus:bg-white w-44 sm:w-56 transition-all"
            />
          </div>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:border-[#00843d] focus:bg-white"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Table / List */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          No problems found matching your criteria.
        </div>
      ) : (
        <div className="space-y-2.5 pt-1">
          {filtered.map((problem) => {
            const isExpanded = expandedId === problem._id;
            const retentionPct = Math.round((problem.retentionScore || 1) * 100);

            return (
              <div
                key={problem._id}
                className="bg-white border border-slate-200/90 rounded-xl overflow-hidden hover:border-slate-300 transition-all shadow-2xs"
              >
                <div className="p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      problem.difficulty === 'Easy'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : problem.difficulty === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {problem.difficulty}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#0e141e] truncate">
                          {problem.title}
                        </span>
                        <a
                          href={problem.problemUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-[#00843d] transition-colors shrink-0"
                          title="Open on LeetCode"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-medium">
                        <span className="text-[#00843d] font-semibold">{problem.pattern}</span>
                        <span>•</span>
                        <span>Interval: {problem.intervalDays}d</span>
                        <span>•</span>
                        <span>Next: {new Date(problem.nextReviewDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Retention pill */}
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                      retentionPct > 70 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : retentionPct > 45 
                        ? 'bg-amber-50 text-amber-700 border-amber-200' 
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {retentionPct}% Recall
                    </span>

                    {/* Expand journal button */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : problem._id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title="View Notes"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleDelete(problem._id, problem.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete problem"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Journal */}
                {isExpanded && (
                  <div className="px-4 py-3.5 bg-slate-50/80 border-t border-slate-200 text-xs space-y-2.5">
                    <div>
                      <span className="font-bold text-[#00843d]">Core Intuition: </span>
                      <span className="text-slate-700 leading-relaxed">{problem.journal.coreIntuition}</span>
                    </div>

                    {problem.journal.edgeCases && problem.journal.edgeCases.length > 0 && (
                      <div>
                        <span className="font-bold text-amber-700">Edge Cases: </span>
                        <span className="text-slate-600">{problem.journal.edgeCases.join(', ')}</span>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-500 font-medium flex flex-wrap gap-4 pt-1 border-t border-slate-200/60">
                      <span>Time: <strong className="text-slate-700">{problem.journal.timeComplexity}</strong></span>
                      <span>Space: <strong className="text-slate-700">{problem.journal.spaceComplexity}</strong></span>
                      <span>SM-2 Factor (EF): <strong className="text-slate-700">{problem.easinessFactor}</strong></span>
                      <span>Repetitions (n): <strong className="text-slate-700">{problem.repetitionNumber}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
