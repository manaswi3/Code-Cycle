import React from 'react';
import { Layers, Activity, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function PatternMatrix({ patterns = [], onSelectPattern }) {
  if (!patterns || patterns.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center shadow-xs">
        <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-slate-700">No Pattern Health Data Yet</h4>
        <p className="text-xs text-slate-500 mt-1">Log problems under patterns like Sliding Window or Two Pointers to view memory decay.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#0e141e] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#00843d]" />
            Pattern Memory Decay Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Calculated via Ebbinghaus exponential forgetting curve (R = e<sup>-t/S</sup>)
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Fresh (&gt;75%)
          </span>
          <span className="flex items-center gap-1.5 text-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Fading (50-75%)
          </span>
          <span className="flex items-center gap-1.5 text-rose-700">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Critical (&lt;50%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
        {patterns.map((item) => {
          const isCritical = item.healthStatus === 'CRITICAL';
          const isFading = item.healthStatus === 'FADING';

          return (
            <div
              key={item.pattern}
              className={`p-4 rounded-xl border transition-all shadow-2xs ${
                isCritical
                  ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                  : isFading
                  ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                  : 'bg-emerald-50/20 border-emerald-200/80 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#0e141e] truncate pr-2">
                  {item.pattern}
                </h4>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  isCritical
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : isFading
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {item.retentionPercentage}% Recall
                </span>
              </div>

              {/* Memory Retention Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden border border-slate-200/50">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCritical
                      ? 'bg-rose-500'
                      : isFading
                      ? 'bg-amber-500'
                      : 'bg-[#00b862]'
                  }`}
                  style={{ width: `${item.retentionPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-200/60 font-medium">
                <span>{item.totalProblems} Problems ({item.masteredProblems} Mastered)</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3" />
                  {item.lastPracticed ? new Date(item.lastPracticed).toLocaleDateString() : 'Never'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
