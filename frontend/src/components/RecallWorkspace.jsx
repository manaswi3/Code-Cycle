import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Loader2,
  BookOpen,
  Award,
  HelpCircle,
  Code2,
  ListOrdered
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { evaluateRecall, submitReview } from '../services/api';
import { getProblemDetails } from '../services/problemRegistry';

export default function RecallWorkspace({ queue = [], initialIndex = 0, user, onBackToDashboard, onQueueUpdated }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);

  // 4 Reasoning Answers
  const [answers, setAnswers] = useState({
    naiveApproach: '',
    bottleneck: '',
    optimalApproach: '',
    complexityReason: ''
  });

  // States
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState(null);
  const [frictionLevel, setFrictionLevel] = useState('EFFORTLESS');
  const [secondsRemaining, setSecondsRemaining] = useState(180);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompletedAll, setIsCompletedAll] = useState(false);

  const currentProblem = queue[currentIndex];

  useEffect(() => {
    setCurrentIndex(initialIndex || 0);
    resetCardState();
  }, [initialIndex]);

  // Timer: Countdown
  useEffect(() => {
    let interval = null;
    if (secondsRemaining > 0 && !aiEvaluation && currentProblem && !isCompletedAll) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [secondsRemaining, aiEvaluation, currentProblem, isCompletedAll]);

  // Auto-trigger evaluation when time reaches 00:00
  useEffect(() => {
    if (secondsRemaining === 0 && !aiEvaluation && !isEvaluating && currentProblem && !isCompletedAll) {
      handleRunEvaluation(true);
    }
  }, [secondsRemaining, aiEvaluation, isEvaluating, currentProblem, isCompletedAll]);

  const resetCardState = () => {
    setAnswers({
      naiveApproach: '',
      bottleneck: '',
      optimalApproach: '',
      complexityReason: ''
    });
    setAiEvaluation(null);
    setFrictionLevel('EFFORTLESS');
    setSecondsRemaining(180);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleRunEvaluation = async (isAuto = false) => {
    if (!isAuto && !answers.optimalApproach.trim()) {
      alert('Please explain at least your optimal pattern & approach before evaluating.');
      return;
    }

    setIsEvaluating(true);
    try {
      const res = await evaluateRecall(currentProblem._id, answers);
      setAiEvaluation(res.data.data);
    } catch (err) {
      if (!isAuto) {
        alert('Could not run AI evaluation. Please check your connection.');
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const baseRating = aiEvaluation?.suggestedQuality || 4;
      let finalQuality = baseRating;

      if (frictionLevel === 'STRUGGLED') {
        finalQuality = Math.max(1, baseRating - 2);
      } else if (frictionLevel === 'HESITANT') {
        finalQuality = Math.max(2, baseRating - 1);
      }

      await submitReview(currentProblem._id, {
        quality: finalQuality,
        aiScore: aiEvaluation?.score || 80,
        frictionLevel,
        timeSpentSeconds: 180 - secondsRemaining
      });

      if (onQueueUpdated) {
        onQueueUpdated();
      }

      if (currentIndex + 1 < queue.length) {
        setCurrentIndex(prev => prev + 1);
        resetCardState();
      } else {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 }
        });
        setIsCompletedAll(true);
      }
    } catch (err) {
      alert('Failed to save review');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Celebration view when all items finished
  if (isCompletedAll || !currentProblem) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-4">
        <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-8 text-center space-y-5 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#00843d]">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#0e141e]">Daily Revision Session Complete!</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Awesome job, {user?.name || 'Engineer'}! You articulated your algorithmic thought processes, received AI interviewer feedback, and your retention intervals are recalibrated.
          </p>
          <button
            onClick={onBackToDashboard}
            className="w-full py-3.5 bg-[#00843d] hover:bg-[#006e33] active:bg-[#005a29] text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-700/20"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const description = getProblemDetails(currentProblem);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      
      {/* Top Workspace Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 h-14 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Question Index Progress */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0e141e]">
              Question {currentIndex + 1} of {queue.length}
            </span>
            <div className="hidden sm:flex items-center gap-1">
              {queue.map((_, qIdx) => (
                <span
                  key={qIdx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    qIdx === currentIndex
                      ? 'bg-[#00843d] scale-125'
                      : qIdx < currentIndex
                      ? 'bg-emerald-400'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Top Bar: Timer & LeetCode Link */}
        <div className="flex items-center gap-3">
          {/* 3-Minute Countdown */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
            secondsRemaining === 0
              ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
              : secondsRemaining < 30
              ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
              : 'bg-white text-slate-700 border-slate-200'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{secondsRemaining === 0 ? "Time's Up!" : formatTimer(secondsRemaining)}</span>
          </div>

          <a
            href={currentProblem.problemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors shadow-2xs"
          >
            <span className="hidden sm:inline">LeetCode</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </header>

      {/* Main Split Screen Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: Problem Description (LeetCode Style)         */}
        {/* ========================================================= */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-xs sticky lg:top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
          
          {/* Title & Badges */}
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                currentProblem.difficulty === 'Easy'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : currentProblem.difficulty === 'Medium'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {currentProblem.difficulty}
              </span>

              <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-slate-400" />
                <span>Pattern Hidden (Deduce on Right)</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0e141e] tracking-tight">
              {currentProblem.title}
            </h1>
          </div>

          {/* Statement */}
          <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>
              {description.statement || 
                'Given the problem constraints, articulate the underlying pattern and design the optimal data structures and time/space complexity without jumping straight into syntax.'}
            </p>
          </div>

          {/* Examples */}
          {description.examples && description.examples.length > 0 && (
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Examples
              </h3>

              {description.examples.map((ex, exIdx) => (
                <div key={exIdx} className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 text-xs space-y-1.5 font-mono">
                  <div className="font-bold text-slate-700 font-sans">Example {exIdx + 1}:</div>
                  <div>
                    <span className="text-slate-500 font-semibold">Input: </span>
                    <span className="text-[#0e141e] font-bold">{ex.input}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold">Output: </span>
                    <span className="text-[#00843d] font-bold">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div className="font-sans text-slate-600 pt-1 border-t border-slate-200/60 mt-1">
                      <span className="font-semibold text-slate-700">Explanation: </span>
                      {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Constraints */}
          {description.constraints && description.constraints.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Constraints
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 font-mono">
                {description.constraints.map((c, cIdx) => (
                  <li key={cIdx}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Interview Note */}
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-3.5 text-xs text-emerald-900 leading-relaxed font-sans">
            <strong className="text-[#00843d] font-bold">Interview Guideline: </strong>
            Read the examples and edge cases carefully. Before writing optimal code, an interviewer expects you to formulate the naive approach, spot the computational bottleneck, and mathematically prove your Big-O complexity.
          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Interview Reasoning & Real-Time AI Review    */}
        {/* ========================================================= */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-xs">
          
          {!aiEvaluation ? (
            /* STAGE 1: Reasoning Input Prompts */
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00843d] flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Candidate Reasoning & Active Recall
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Answer concisely in 1–2 sentences. Timer auto-evaluates at 00:00.
                </p>
              </div>

              {/* Q1: Naive Approach */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>1. Extreme Naive / Brute Force Approach</span>
                  <span className="text-[11px] text-slate-400 font-normal">What is the baseline brute force?</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Generate all possible subarrays/substrings using nested loops..."
                  value={answers.naiveApproach}
                  onChange={(e) => setAnswers({ ...answers, naiveApproach: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00843d] focus:bg-white"
                />
              </div>

              {/* Q2: Bottleneck */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>2. The Bottleneck</span>
                  <span className="text-[11px] text-slate-400 font-normal">What causes redundant work / why optimize?</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Repeatedly checking overlapping elements causes O(N^3) time and TLE..."
                  value={answers.bottleneck}
                  onChange={(e) => setAnswers({ ...answers, bottleneck: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00843d] focus:bg-white"
                />
              </div>

              {/* Q3: Optimal Pattern & DS */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>3. Optimal Pattern & Data Structure (No Code/Syntax)</span>
                  <span className="text-[11px] text-slate-400 font-normal">Explain the core invariant and state</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Sliding window with two pointers. Use a Hash Map of char -> index. When duplicate seen, slide left pointer..."
                  value={answers.optimalApproach}
                  onChange={(e) => setAnswers({ ...answers, optimalApproach: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00843d] focus:bg-white"
                />
              </div>

              {/* Q4: Complexity Proof */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>4. Time & Space Complexity (With Reason)</span>
                  <span className="text-[11px] text-slate-400 font-normal">Justify Big-O</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Time: O(N) single pass. Space: O(min(N, Sigma)) for the hash map."
                  value={answers.complexityReason}
                  onChange={(e) => setAnswers({ ...answers, complexityReason: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00843d] focus:bg-white"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleRunEvaluation(false)}
                disabled={isEvaluating}
                className="w-full py-3.5 bg-[#00843d] hover:bg-[#006e33] active:bg-[#005a29] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 mt-2"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{secondsRemaining === 0 ? "Time's Up! Submitting your answers..." : "Analyzing Reasoning & Checking Journal..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze My Recall & Evaluate</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* STAGE 2: Chat-Style AI Mentor Feedback */
            <div className="space-y-4 animate-in fade-in duration-300">

              {/* Score Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#00843d]">Mentor Feedback</span>
                  <h3 className="text-base font-extrabold text-[#0e141e] mt-0.5">{aiEvaluation.greeting}</h3>
                </div>
                <div className={`flex flex-col items-center px-4 py-2.5 rounded-xl border shadow-xs ${
                  aiEvaluation.score >= 85 ? 'bg-emerald-50 border-emerald-200' :
                  aiEvaluation.score >= 60 ? 'bg-amber-50 border-amber-200' :
                  'bg-rose-50 border-rose-200'
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Score</span>
                  <span className={`text-2xl font-extrabold ${
                    aiEvaluation.score >= 85 ? 'text-[#00843d]' :
                    aiEvaluation.score >= 60 ? 'text-amber-600' :
                    'text-rose-600'
                  }`}>{aiEvaluation.score}<span className="text-xs font-normal text-slate-400">/100</span></span>
                </div>
              </div>

              {/* Chat-style section feedback */}
              <div className="space-y-3">
                {(aiEvaluation.chatFeedback || [
                  { section: 'Naive Approach', status: aiEvaluation.nailed?.length > 0 ? 'correct' : 'missed', feedback: aiEvaluation.nailed?.[0] || aiEvaluation.missed?.[0] || '' },
                  ...(aiEvaluation.corrections || []).map(c => ({ section: c.stated, status: 'partial', feedback: c.improved })),
                  ...(aiEvaluation.missed || []).slice(1).map(m => ({ section: 'Note', status: 'missed', feedback: m }))
                ].filter(f => f.feedback)).map((item, idx) => {
                  const isCorrect = item.status === 'correct';
                  const isPartial = item.status === 'partial';
                  const isMissed = item.status === 'missed';
                  return (
                    <div key={idx} className={`rounded-2xl border p-4 space-y-1.5 ${
                      isCorrect ? 'bg-emerald-50/60 border-emerald-200' :
                      isPartial ? 'bg-amber-50/50 border-amber-200' :
                      'bg-rose-50/40 border-rose-200'
                    }`}>
                      {/* Section label + status pill */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">{item.section}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isCorrect ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                          isPartial ? 'bg-amber-100 text-amber-700 border-amber-300' :
                          'bg-rose-100 text-rose-700 border-rose-300'
                        }`}>
                          {isCorrect ? 'Correct' : isPartial ? 'Needs Precision' : 'Missed'}
                        </span>
                      </div>

                      {/* Mentor's message as a chat bubble */}
                      <div className="flex items-start gap-2.5 pt-1">
                        <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-extrabold mt-0.5 ${
                          isCorrect ? 'bg-[#00843d] text-white' :
                          isPartial ? 'bg-amber-500 text-white' :
                          'bg-rose-500 text-white'
                        }`}>M</div>
                        <p className="text-xs text-slate-700 leading-relaxed">{item.feedback}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reference Answer */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Correct Approach Reference</div>
                <p className="text-xs text-slate-700 leading-relaxed">{currentProblem.journal?.coreIntuition}</p>
                <div className="flex items-center gap-3 pt-1 border-t border-slate-200 mt-1">
                  <span className="text-[11px] text-slate-500">Pattern: <strong className="text-[#00843d]">{currentProblem.pattern}</strong></span>
                  <span className="text-slate-300">|</span>
                  <span className="text-[11px] text-slate-500">Time: <strong className="text-slate-700">{currentProblem.journal?.timeComplexity}</strong></span>
                  <span className="text-slate-300">|</span>
                  <span className="text-[11px] text-slate-500">Space: <strong className="text-slate-700">{currentProblem.journal?.spaceComplexity}</strong></span>
                </div>
              </div>

              {/* Friction Rating */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-[#0e141e]">How hard was it to recall this?</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">This adjusts when you'll see this problem again (SM-2 interval).</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setFrictionLevel('EFFORTLESS')}
                    className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                      frictionLevel === 'EFFORTLESS'
                        ? 'bg-emerald-50 border-[#00843d] ring-1 ring-[#00843d]'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm">⚡</div>
                    <div className="text-[10px] font-bold text-[#00843d] mt-0.5">Instant</div>
                  </button>
                  <button
                    onClick={() => setFrictionLevel('HESITANT')}
                    className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                      frictionLevel === 'HESITANT'
                        ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm">🤔</div>
                    <div className="text-[10px] font-bold text-amber-600 mt-0.5">Hesitant</div>
                  </button>
                  <button
                    onClick={() => setFrictionLevel('STRUGGLED')}
                    className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                      frictionLevel === 'STRUGGLED'
                        ? 'bg-rose-50 border-rose-500 ring-1 ring-rose-500'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm">😤</div>
                    <div className="text-[10px] font-bold text-rose-600 mt-0.5">Struggled</div>
                  </button>
                </div>

                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#00843d] hover:bg-[#006e33] active:bg-[#005a29] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{currentIndex + 1 < queue.length ? 'Lock In & Next Problem' : 'Lock In & Finish Session'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
