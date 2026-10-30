import React, { useState } from 'react';
import { Brain, Sparkles, Loader2 } from 'lucide-react';
import { registerUser, loginUser, isNetworkError, DEMO_TOKEN } from '../services/api';
import { DEMO_USER } from '../services/mockData';

export default function AuthModal({ isOpen, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverDown, setServerDown] = useState(false);

  if (!isOpen) return null;

  const describeError = (err) => {
    if (isNetworkError(err)) {
      setServerDown(true);
      return 'Cannot reach the server. Is the backend running on port 5000 (and MongoDB started)?';
    }
    setServerDown(false);
    return err.response?.data?.message || `Request failed (HTTP ${err.response.status})`;
  };

  // Explicit, user-chosen offline mode. Data lives only in this browser.
  const handleOfflineDemo = () => {
    localStorage.setItem('token', DEMO_TOKEN);
    onAuthSuccess(DEMO_USER);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let res;
      if (isLogin) {
        res = await loginUser({ email, password });
      } else {
        res = await registerUser({ name, email, password });
      }

      localStorage.setItem('token', res.data.token);
      onAuthSuccess(res.data.user);
    } catch (err) {
      setError(describeError(err));
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Evaluator / Demo Login
  const handleQuickDemo = async () => {
    setLoading(true);
    setError('');
    const demoEmail = 'student@college.edu';
    const demoPass = 'password123';

    try {
      let res;
      try {
        res = await loginUser({ email: demoEmail, password: demoPass });
      } catch (loginErr) {
        // Only create the demo account if it genuinely doesn't exist yet.
        if (loginErr.response?.status !== 401) throw loginErr;
        res = await registerUser({
          name: 'Rohan Sharma',
          email: demoEmail,
          password: demoPass,
          targetGoal: 'Campus Placement Season 2026'
        });
      }
      localStorage.setItem('token', res.data.token);
      onAuthSuccess(res.data.user);
    } catch (err) {
      setError(describeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 sm:p-8 space-y-5">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#00843d] flex items-center justify-center shadow-lg shadow-emerald-700/20">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#0e141e] tracking-tight">AlgoRecall</h2>
          <p className="text-xs text-slate-500 font-medium">
            {isLogin ? 'Sign in to access your spaced repetition queue' : 'Create an account to master DSA patterns'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
            {error}
            {serverDown && (
              <button
                type="button"
                onClick={handleOfflineDemo}
                className="block mt-2 underline font-bold text-rose-700"
              >
                Continue in offline demo (data stays in this browser only)
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                placeholder="Rohan Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#00843d] focus:bg-white transition-colors"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              required
              placeholder="student@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#00843d] focus:bg-white transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#00843d] focus:bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#00843d] hover:bg-[#006e33] active:bg-[#005a29] text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>

        {/* 1-Click Evaluator Mode */}
        <div className="pt-2 border-t border-slate-200 space-y-3">
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={loading}
            className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#00843d] border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-[#00843d]" />
            <span>1-Click Evaluator / Demo Login</span>
          </button>

          <div className="text-center text-xs text-slate-500 font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#00843d] hover:underline font-bold"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}