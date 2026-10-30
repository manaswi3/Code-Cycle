import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Loader2,
  BookOpen,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { evaluateRecall, submitReview } from '../services/api';

export default function ActiveRecallModal({ isOpen, onClose, queue = [], onQueueComplete, user, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
  
  // 4 Reasoning Answers
  const [answers, setAnswers] = useState({
    naiveApproach: '',
    bottleneck: '',
    optimalApproach: '',
    complexityReason: ''
  });

  // State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState(null);
  const [frictionLevel, setFrictionLevel] = useState('EFFORTLESS'); // EFFORTLESS, HESITANT, STRUGGLED
  const [secondsRemaining, setSecondsRemaining] = useState(180);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);

  const currentProblem = queue[currentIndex];

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex || 0);
      resetCardState();
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    let interval = null;
    if (secondsRemaining > 0 && !aiEvaluation && isOpen) {
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
  }, [secondsRemaining, aiEvaluation, isOpen]);

  // Auto-trigger evaluation when time runs out (0 seconds remaining)
  useEffect(() => {
    if (secondsRemaining === 0 && !aiEvaluation && isOpen && !isEvaluating && currentProblem) {
      handleRunEvaluation(true);
    }
  }, [secondsRemaining, aiEvaluation, isOpen, isEvaluating, currentProblem]);

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

  if (!isOpen || !currentProblem) {
    if (finished) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-8 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#00843d]">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-[#0e141e]">Daily Revision Complete!</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Great session, {user?.name || 'Engineer'}! Your algorithmic reasoning was evaluated and your spaced repetition intervals have been recalibrated.
            </p>
            <button
              onClick={() => {
                setFinished(false);
                onClose();
              }}
              className="w-full py-3 bg-[#00843d] hover:bg-[#006e33] text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-700/20"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }
    return null;
  }

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
        alert('Could not run AI evaluation. Please verify your connection.');
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Calculate composite SM-2 rating from AI score + cognitive friction
      const baseRating = aiEvaluation?.suggestedQuality || 4;
      let finalQuality = baseRating;

      if (frictionLevel === 'STRUGGLED') {
        finalQuality = Math.max(1, baseRating - 2); // Heavily penalized if memory required heavy struggle
      } else if (frictionLevel === 'HESITANT') {
        finalQuality = Math.max(2, baseRating - 1);
      }

      await submitReview(currentProblem._id, {
        quality: finalQuality,
        aiScore: aiEvaluation?.score || 80,
        frictionLevel,
        timeSpentSeconds: 180 - secondsRemaining
      });

      // Immediately refresh parent stats & queue
      if (onQueueComplete) {
        onQueueComplete();
      }

      if (currentIndex + 1 < queue.length) {
        setCurrentIndex(prev => prev + 1);
        resetCardState();
      } else {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
        setFinished(true);
      }
    } catch (err) {
      alert('Failed to record review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl my-6 overflow-hidden shadow-2xl flex flex-col">
        
        {/* Top bar */}
        <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00843d] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              Question {currentIndex + 1} of {queue.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Interview Reasoning & Recall
            </span>
          </div>

          <div className="flex items-center gap-4">
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

            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Problem Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                currentProblem.difficulty === 'Easy'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : currentProblem.difficulty === 'Medium'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {currentProblem.difficulty}
              </span>
              <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                Pattern: {aiEvaluation ? currentProblem.pattern : 'Hidden (Recall it below)'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#0e141e] tracking-tight">
              {currentProblem.title}
            </h2>
          </div>

          <a
            href={currentProblem.problemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors shadow-2xs"
          >
            <span>Solve on LeetCode</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* Stage 1: The 4 Reasoning Questions */}
          {!aiEvaluation ? (
            <div className="space-y-4">
              <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#00843d] flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    Interview Progression Prompts
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Articulate your thought process as you would to a senior tech interviewer.
                  </p>
                </div>
              </div>

              {/* Q1: Naive Approach */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>1. Naive / Brute Force Approach</span>
                  <span className="text-[11px] text-slate-400 font-normal">What is the baseline brute force solution?</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Generate all possible subarrays or substrings using nested loops..."
                  value={answers.naiveApproach}
                  onChange={(e) => setAnswers({ ...answers, naiveApproach: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00843d] focus:bg-white"
                />
              </div>

              {/* Q2: Bottleneck */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>2. The Bottleneck</span>
                  <span className="text-[11px] text-slate-400 font-normal">What causes redundant work / why must it be optimized?</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Re-evaluating overlapping substrings causes O(N^3) time and leads to TLE..."
                  value={answers.bottleneck}
                  onChange={(e) => setAnswers({ ...answers, bottleneck: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00843d] focus:bg-white"
                />
              </div>

              {/* Q3: Optimal Pattern & DS */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>3. Optimal Pattern & Data Structure (No Code / Syntax)</span>
                  <span className="text-[11px] text-slate-400 font-normal">Explain the core invariant and state transitions</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Use a Sliding Window with Two Pointers. Maintain a Hash Map storing character to last seen index..."
                  value={answers.optimalApproach}
                  onChange={(e) => setAnswers({ ...answers, optimalApproach: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00843d] focus:bg-white"
                />
              </div>

              {/* Q4: Complexity Proof */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>4. Time & Space Complexity (With Mathematical Reason)</span>
                  <span className="text-[11px] text-slate-400 font-normal">Must justify Big-O</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Time: O(N) because each element is visited at most twice. Space: O(min(N, Sigma)) for the hash map."
                  value={answers.complexityReason}
                  onChange={(e) => setAnswers({ ...answers, complexityReason: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00843d] focus:bg-white"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleRunEvaluation(false)}
                disabled={isEvaluating}
                className="w-full py-3.5 bg-[#00843d] hover:bg-[#006e33] active:bg-[#005a29] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
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
            /* Stage 2: Classy AI Review Breakdown */
            <div className="space-y-5 animate-in fade-in duration-300">
              
              {/* Header Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#00843d]">
                    Interviewer Analysis
                  </span>
                  <h3 className="text-base font-extrabold text-[#0e141e]">
                    {aiEvaluation.greeting}
                  </h3>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-emerald-200 rounded-xl shadow-2xs self-start sm:self-auto">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Recall Score</div>
                    <div className="text-xl font-extrabold text-[#00843d]">
                      {aiEvaluation.score}<span className="text-xs text-slate-400">/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* What You Nailed */}
              {aiEvaluation.nailed && aiEvaluation.nailed.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#00843d] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    What You Nailed
                  </h4>
                  <ul className="bg-emerald-50/40 border border-emerald-200/80 rounded-xl p-3.5 space-y-1.5 text-xs text-slate-700 font-medium">
                    {aiEvaluation.nailed.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#00843d] font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Refinements & Corrections */}
              {aiEvaluation.corrections && aiEvaluation.corrections.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Precision & Corrections
                  </h4>
                  <div className="space-y-2">
                    {aiEvaluation.corrections.map((corr, idx) => (
                      <div key={idx} className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-3.5 text-xs space-y-1">
                        <div className="text-slate-500">
                          <span className="font-semibold text-slate-700">What you stated: </span>
                          "{corr.stated}"
                        </div>
                        <div className="text-slate-800 font-medium">
                          <span className="font-bold text-[#00843d]">More precise approach: </span>
                          {corr.improved}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Crucial Points Missed */}
              {aiEvaluation.missed && aiEvaluation.missed.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Points Omitted
                  </h4>
                  <ul className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1 text-xs text-slate-600 font-medium">
                    {aiEvaluation.missed.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-slate-400 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reference to Saved Journal */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Your Original Reference Journal:
                </div>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-lg leading-relaxed">
                  {currentProblem.journal?.coreIntuition}
                </p>
              </div>

              {/* Stage 3: Student Cognitive Friction Selection */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="text-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0e141e]">
                    How was your mental effort recalling this approach?
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Combined with your AI reasoning score to schedule the next optimal revision date.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <button
                    onClick={() => setFrictionLevel('EFFORTLESS')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      frictionLevel === 'EFFORTLESS'
                        ? 'bg-emerald-50 border-[#00843d] ring-1 ring-[#00843d]'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#00843d]">Instant Recall</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Flowed naturally with minimal pause.</div>
                  </button>

                  <button
                    onClick={() => setFrictionLevel('HESITANT')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      frictionLevel === 'HESITANT'
                        ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-amber-700">Some Hesitation</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Needed a minute to piece invariant together.</div>
                  </button>

                  <button
                    onClick={() => setFrictionLevel('STRUGGLED')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      frictionLevel === 'STRUGGLED'
                        ? 'bg-rose-50 border-rose-500 ring-1 ring-rose-500'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-rose-700">Heavy Struggle</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Blanked out / needed deep mental exertion.</div>
                  </button>
                </div>

                {/* Final Submit / Recalibrate button */}
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="w-full mt-3 py-3 bg-[#00843d] hover:bg-[#006e33] active:bg-[#005a29] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Lock In Evaluation & Update SM-2 Interval</span>
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
