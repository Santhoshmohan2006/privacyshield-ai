import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { getUser } from './utils/storage';
import { motion } from 'framer-motion';
import { FiShield } from 'react-icons/fi';

// Layout
import MainLayout from './components/Layout/MainLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Assistant from './pages/Assistant';
import QuizList from './pages/Quiz/QuizList';
import QuizActive from './pages/Quiz/QuizActive';
import QuizResult from './pages/Quiz/QuizResult';
import Analyzer from './pages/Analyzer';
import Compliance from './pages/Compliance';
import Scenarios from './pages/Scenarios';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    // 1.8 seconds premium splash screen timer
    const timer = setTimeout(() => setAppLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  if (appLoading) {
    return (
      <div className="min-h-screen bg-darkBg text-white flex flex-col items-center justify-center relative overflow-hidden select-none font-sans noise-overlay">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[80px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-[80px] animate-pulse pointer-events-none" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center space-y-6 z-10"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center border border-primary/20 shadow-glow-primary/20 mx-auto animate-pulse">
            <FiShield size={40} className="text-slate-950" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gradient tracking-tight">PrivacyShield AI</h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1.5">Establishing Secure Environment</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{
        className: 'dark:bg-slate-800 dark:text-white glass-dark border border-slate-700/50',
      }} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute><MainLayout theme={theme} toggleTheme={toggleTheme} /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/quiz" element={<QuizList />} />
          <Route path="/quiz/:id" element={<QuizActive />} />
          <Route path="/quiz/result/:id" element={<QuizResult />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
