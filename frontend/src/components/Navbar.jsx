import React from 'react';
import { Brain, Plus, Flame, Target, LogOut, CheckCircle2 } from 'lucide-react';

export default function Navbar({ user, onOpenAddModal, onLogout, queueCount = 0 }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00843d] flex items-center justify-center shadow-md shadow-emerald-700/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-[#0e141e]">AlgoRecall</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-[#00843d] border border-emerald-200 px-2 py-0.5 rounded-full">
                SM-2 Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">DSA Pattern-First Spaced Repetition</p>
          </div>
        </div>

        {/* Center Target Indicator */}
        <div className="hidden md:flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 text-xs shadow-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Target className="w-3.5 h-3.5 text-[#00843d]" />
            <span className="font-semibold text-slate-800">{user?.targetGoal || 'Placement Season'}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1.5 text-amber-600 font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>3-Day Streak</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {queueCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs text-amber-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              {queueCount} due today
            </div>
          )}

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#00843d] hover:bg-[#006e33] active:bg-[#005a29] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all shadow-emerald-700/20"
          >
            <Plus className="w-4 h-4" />
            <span>Log Problem</span>
          </button>

          <button
            onClick={onLogout}
            title="Sign out"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
