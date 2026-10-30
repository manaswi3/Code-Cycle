import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AddProblemModal from './components/AddProblemModal';
import RecallWorkspace from './components/RecallWorkspace';
import AuthModal from './components/AuthModal';
import { getMe, getDailyQueue, getProblems, getAnalytics } from './services/api';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // App view navigation: 'dashboard' | 'recall'
  const [currentView, setCurrentView] = useState('dashboard');

  // Data states
  const [queue, setQueue] = useState([]);
  const [problems, setProblems] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loadError, setLoadError] = useState('');

  // Modal & Index states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Initial Auth Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then(async (res) => {
          setUser(res.data.user);
          await loadDashboardData(); // wait, so we never flash an empty dashboard
        })
        .catch((err) => {
          // Only discard the token if the server actually rejected it
          if (err.response?.status === 401) localStorage.removeItem('token');
          setIsAuthOpen(true);
        })
        .finally(() => setLoading(false));
    } else {
      setIsAuthOpen(true);
      setLoading(false);
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      const [queueRes, probRes, analyticRes] = await Promise.all([
        getDailyQueue(),
        getProblems(),
        getAnalytics()
      ]);

      setQueue(queueRes.data.data || []);
      setProblems(probRes.data.data || []);
      setAnalytics(analyticRes.data.data || null);
      setLoadError('');
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      if (err.response?.status === 401) {
        handleLogout();
        return;
      }
      setLoadError(
        err.response
          ? `Server error while loading your data (HTTP ${err.response.status}).`
          : 'Cannot reach the server. Your data could not be loaded.'
      );
    }
  };

  const handleAuthSuccess = (authUser) => {
    setUser(authUser);
    setIsAuthOpen(false);
    loadDashboardData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCurrentView('dashboard');
    setIsAuthOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#00843d]" />
          <p className="text-xs uppercase tracking-widest font-bold text-slate-500">
            Initializing AlgoRecall Engine...
          </p>
        </div>
      </div>
    );
  }

  // Full-Screen Dedicated Split-View Interview Environment
  if (currentView === 'recall') {
    return (
      <RecallWorkspace
        queue={queue}
        initialIndex={startIndex}
        user={user}
        onBackToDashboard={() => {
          setCurrentView('dashboard');
          loadDashboardData();
        }}
        onQueueUpdated={loadDashboardData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0e141e] flex flex-col antialiased">
      <Navbar
        user={user}
        onOpenAddModal={() => setIsAddOpen(true)}
        onLogout={handleLogout}
        queueCount={queue.length}
      />

      <main className="flex-1">
        {loadError && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center justify-between gap-3">
              <span>{loadError}</span>
              <button onClick={loadDashboardData} className="font-bold underline shrink-0">Retry</button>
            </div>
          </div>
        )}
        <Dashboard
          user={user}
          queue={queue}
          problems={problems}
          analytics={analytics}
          onStartRecall={(idx = 0) => {
            setStartIndex(idx);
            setCurrentView('recall');
          }}
          onOpenAddModal={() => setIsAddOpen(true)}
          onRefreshData={loadDashboardData}
        />
      </main>

      <footer className="border-t border-slate-200 bg-white/60 py-6 text-center text-xs text-slate-500 font-medium">
        AlgoRecall • SuperMemo SM-2 & Ebbinghaus Forgetting Curve Implementation • Built for Campus Placements
      </footer>

      {/* Modals */}
      <AddProblemModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onProblemAdded={loadDashboardData}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}