import React from 'react';
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Brain, 
  Play, 
  ExternalLink, 
  TrendingUp, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import PatternMatrix from './PatternMatrix';
import ProblemList from './ProblemList';

function formatRevisedText(lastReviewedAt) {
  if (!lastReviewedAt) return 'Newly added (1st review)';
  const diffMs = Date.now() - new Date(lastReviewedAt).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Revised today';
  if (diffDays === 1) return 'Revised 1 day before';
  return `Revised ${diffDays} days before`;
}

export default function Dashboard({
  user,
  queue = [],
  problems = [],
  analytics = null,
  onStartRecall,
  onOpenAddModal,
  onRefreshData
}) {
  const dueCount = queue.length;
  const masteredCount = problems.filter(p => p.status === 'MASTERED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HackerRank-Inspired Hero Banner */}
      <div className="relative bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200/90 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 left-1/3 w-64 h-64 bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-emerald-200/80 rounded-full text-xs font-bold text-[#00843d] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#00843d]" />
            <span>Target: {user?.targetGoal || 'Placements 2026'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0e141e] tracking-tight">
            Welcome back, {user?.name || 'Engineer'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-normal leading-relaxed">
            {dueCount > 0
              ? `You have ${dueCount} problem${dueCount > 1 ? 's' : ''} scheduled for revision today based on your SuperMemo SM-2 interval curve.`
              : 'You are all caught up on your spaced repetition queue for today! Keep up the daily recall habit.'}
          </p>
        </div>

        {dueCount > 0 ? (
          <button
            onClick={() => onStartRecall(0)}
            className="z-10 px-6 py-3.5 bg-[#00843d] hover:bg-[#006e33] active:bg-[#005a29] text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2.5 self-start md:self-auto shrink-0 group"
          >
            <Play className="w-4 h-4 fill-white transition-transform group-hover:scale-110" />
            <span>Start Daily Revision ({dueCount} Due)</span>
          </button>
        ) : (
          <button
            onClick={onOpenAddModal}
            className="z-10 px-6 py-3.5 bg-white hover:bg-slate-50 text-[#00843d] font-bold text-sm rounded-xl border border-emerald-300 transition-all shadow-xs flex items-center gap-2.5 self-start md:self-auto shrink-0"
          >
            <Brain className="w-4 h-4 text-[#00843d]" />
            <span>Log a New Solve</span>
          </button>
        )}
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-2 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Due Today</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0e141e]">
            {dueCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {dueCount > 0 ? 'Requires active recall test' : 'Queue cleared for today!'}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-2 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Tracked</span>
            <Brain className="w-4 h-4 text-[#00843d]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0e141e]">
            {problems.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Across {analytics?.patternHealthMatrix?.length || 0} patterns
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-2 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Mastered (Stage 4)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0e141e]">
            {masteredCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Surpasses 35+ day interval
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-2 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Reviewed Today</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0e141e]">
            {analytics?.reviewsToday || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Reinforced in memory
          </div>
        </div>

      </div>

      {/* Today's Queue Section */}
      {dueCount > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#0e141e] flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Scheduled for Review Today
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Capped at {user?.dailyTargetReviewCount || 5} questions per day to prevent cognitive burnout
              </p>
            </div>

            <button
              onClick={() => onStartRecall(0)}
              className="px-4 py-2 bg-[#00843d] hover:bg-[#006e33] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch Recall Session</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            {queue.map((item, idx) => (
              <div
                key={item._id}
                className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.difficulty === 'Easy'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : item.difficulty === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {item.difficulty}
                    </span>

                    {/* Mask pattern so it does not spoil the algorithmic approach */}
                    <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-slate-400" />
                      <span>Pattern Hidden</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#0e141e] line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Clean un-spoiled prompt instead of revealing core intuition */}
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>Active recall pending • Reason from brute force</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/70 text-[11px] text-slate-500 font-medium">
                  <span className="text-slate-600">
                    {formatRevisedText(item.lastReviewedAt)}
                  </span>
                  <button
                    onClick={() => onStartRecall(idx)}
                    className="text-[#00843d] hover:text-[#006e33] font-bold flex items-center gap-1"
                  >
                    <span>Test Recall</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pattern Memory Decay Matrix */}
      <PatternMatrix
        patterns={analytics?.patternHealthMatrix || []}
      />

      {/* All Problems Library */}
      <ProblemList
        problems={problems}
        onProblemDeleted={onRefreshData}
      />

    </div>
  );
}
