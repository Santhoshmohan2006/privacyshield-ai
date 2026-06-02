import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiTrendingUp, FiAward, FiShield, FiActivity, FiCpu, FiMessageSquare, FiCompass, FiInfo } from 'react-icons/fi';
import GlassCard from '../components/UI/GlassCard';
import AnimatedCounter from '../components/UI/AnimatedCounter';
import { getScores, getBadges, getUser, getXP, getStreak, getActivities, getLevelInfo } from '../utils/storage';

const CircularProgress = ({ score, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    // Animate the circle filling in
    const progressOffset = circumference - (score / 100) * circumference;
    setOffset(progressOffset);
  }, [score, circumference]);

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg className="progress-ring transform -rotate-90" width={size} height={size}>
        <circle
          className="text-slate-800/80"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-primary ring-glow-primary transition-all duration-1000 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-2xl font-black text-white">{score}%</span>
        <span className="text-[8px] uppercase tracking-widest font-black text-slate-500 block">Audit</span>
      </div>
    </div>
  );
};

const ThreatRadar = () => {
  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center border border-slate-800 rounded-full bg-slate-950/40 overflow-hidden select-none">
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08)_0%,transparent_70%)]" />
      <div className="absolute inset-0 w-full h-full bg-gradient-conic from-primary/20 to-transparent rounded-full animate-spin-slow origin-center pointer-events-none" style={{ animationDuration: '5s' }} />
      <div className="absolute w-36 h-36 border border-slate-800/60 rounded-full" />
      <div className="absolute w-24 h-24 border border-slate-850 rounded-full" />
      <div className="absolute w-12 h-12 border border-slate-900 rounded-full" />
      <div className="absolute w-full h-[1px] bg-slate-800/40" />
      <div className="absolute h-full w-[1px] bg-slate-800/40" />
      <div className="absolute w-2 h-2 rounded-full bg-primary animate-ping-slow" style={{ top: '25%', left: '60%' }} />
      <div className="absolute w-2 h-2 rounded-full bg-secondary animate-pulse" style={{ bottom: '30%', left: '20%', animationDelay: '1s' }} />
      <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ top: '65%', right: '25%' }} />
      <span className="absolute bottom-3 text-[8px] uppercase font-black text-slate-500 tracking-widest">Threat Radar</span>
    </div>
  );
};

const Dashboard = () => {
  const user = getUser();
  const [scores, setScores] = useState([]);
  const [badges, setBadges] = useState([]);
  const [streak, setStreak] = useState(1);
  const [xp, setXp] = useState(0);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    setScores(getScores());
    setBadges(getBadges());
    setStreak(getStreak());
    setXp(getXP());
    setActivities(getActivities().slice(0, 5));
  }, []);

  const chartData = scores.length > 0 ? scores.map((s, i) => ({
    name: `Quiz ${s.quizId}`,
    score: (s.score / s.maxScore) * 100
  })) : [
    { name: 'Basics', score: 80 },
    { name: 'GDPR', score: 60 },
    { name: 'AI Models', score: 90 },
    { name: 'Cybersec', score: 70 },
  ];

  const averageScore = scores.length > 0 
    ? Math.round(scores.reduce((acc, curr) => acc + (curr.score/curr.maxScore)*100, 0) / scores.length) 
    : 85;

  const levelInfo = getLevelInfo(xp);

  // Generate calendar heatmap cells for the last 28 days
  const renderHeatmap = () => {
    const cells = [];
    const today = new Date();
    
    // Extract activity dates for comparison
    const activityDates = new Set(
      getActivities().map(act => new Date(act.timestamp).toDateString())
    );

    for (let i = 27; i >= 0; i--) {
      const cellDate = new Date();
      cellDate.setDate(today.getDate() - i);
      const isVal = activityDates.has(cellDate.toDateString());
      
      cells.push(
        <div 
          key={i} 
          className={`w-6.5 h-6.5 rounded-md transition-all duration-300 ${
            isVal 
              ? 'bg-primary border border-primary/40 glow-primary shadow-lg shadow-primary/20' 
              : 'bg-slate-900 border border-slate-800'
          }`}
          title={`${cellDate.toLocaleDateString()}: ${isVal ? 'Activity Logged' : 'No Activity'}`}
        />
      );
    }
    return cells;
  };

  return (
    <div className="space-y-6 py-4">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 text-xs font-semibold mt-1">
            Welcome back, <span className="text-primary">{user?.name || 'Practitioner'}</span>. Track compliance audits and learning metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Level {levelInfo.currentLevel} {levelInfo.levelName}</span>
          <div className="h-2 w-24 bg-slate-800 rounded-full overflow-hidden ml-2">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent" 
              style={{ width: `${((xp - levelInfo.prevLevelXP) / (levelInfo.nextLevelXP - levelInfo.prevLevelXP)) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-bold ml-1">{xp}/{levelInfo.nextLevelXP} XP</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/10 shadow-glow-primary/10">
            <FiShield size={22} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Privacy Rating</p>
            <AnimatedCounter to={averageScore} suffix="/100" className="text-xl lg:text-2xl font-black text-white mt-0.5 block" />
          </div>
        </GlassCard>
        
        <GlassCard className="flex items-center gap-4" delay={0.08}>
          <div className="p-3 bg-secondary/10 rounded-xl text-secondary border border-secondary/10 shadow-glow-secondary/10">
            <FiActivity size={22} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Quizzes Taken</p>
            <AnimatedCounter to={scores.length} className="text-xl lg:text-2xl font-black text-white mt-0.5 block" />
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4" delay={0.16}>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/10 shadow-glow-success/10">
            <FiAward size={22} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Badges Unlocked</p>
            <AnimatedCounter to={badges.length} className="text-xl lg:text-2xl font-black text-white mt-0.5 block" />
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4" delay={0.24}>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/10 shadow-glow-warning/10">
            <FiTrendingUp size={22} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Learning Streak</p>
            <AnimatedCounter to={streak} suffix=" Days" className="text-xl lg:text-2xl font-black text-white mt-0.5 block" />
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart progress card */}
        <GlassCard className="lg:col-span-2 h-96 flex flex-col justify-between" delay={0.32}>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Audit Progress History</h2>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Quiz & Compliance Trends</p>
          </div>
          <div className="flex-1 w-full mt-6 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#aeb784" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#aeb784" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(5,5,5,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#aeb784' }}
                />
                <Area type="monotone" dataKey="score" stroke="#aeb784" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Circular Progress Audit Score */}
        <GlassCard className="h-96 flex flex-col justify-between items-center py-8" delay={0.4}>
          <div className="text-center w-full">
            <h2 className="text-base font-bold text-white tracking-tight">Privacy Score Overview</h2>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Global Audit Health</p>
          </div>
          
          <CircularProgress score={averageScore} />

          <div className="text-center text-xs font-semibold text-slate-400 bg-slate-900/60 border border-slate-800/50 py-2 px-4 rounded-xl">
            {averageScore >= 80 ? '🔒 Outstanding Defense Posture' : '⚠️ Minor Audit Exposures Identified'}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Streak Heatmap Calendar */}
        <GlassCard className="lg:col-span-2 flex flex-col justify-between" delay={0.45}>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Compliance Learning Heatmap</h2>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Platform Activity tracking (Last 28 Days)</p>
          </div>
          <div className="flex flex-wrap gap-2.5 mt-6 py-4 justify-start">
            {renderHeatmap()}
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-800" />
              <span>Inactive</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-primary glow-primary border border-primary/30" />
              <span>Active Log</span>
            </div>
          </div>
        </GlassCard>

        {/* Dynamic Threat Radar */}
        <GlassCard className="flex flex-col justify-between items-center py-6" delay={0.5}>
          <div className="text-center w-full">
            <h2 className="text-base font-bold text-white tracking-tight">Active Cyber Scans</h2>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">PII Intrusion Detection Sweep</p>
          </div>
          
          <ThreatRadar />
        </GlassCard>
      </div>

      {/* Recent Activities Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 flex flex-col justify-between" delay={0.55}>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Recent Activity Log</h2>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Session Timestamps & Milestones</p>
          </div>
          
          <div className="space-y-4 mt-6">
            {activities.length === 0 ? (
              <p className="text-slate-500 text-xs font-semibold py-4">No recent activity found. Take a quiz or analyze text to get started.</p>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="flex items-start gap-4 p-3 rounded-xl bg-slate-950/20 border border-slate-850 hover:border-slate-800 transition-colors">
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-primary">
                    <FiInfo size={14} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-gray-200">{act.action}</h4>
                      <span className="text-[9px] text-slate-500 font-semibold">
                        {new Date(act.timestamp).toLocaleDateString()} {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">{act.details}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        {/* AI Recommendations */}
        <GlassCard className="flex flex-col justify-between" delay={0.6}>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">AI Compliance Directives</h2>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Automated recommendations</p>
          </div>
          <div className="space-y-4 mt-6 overflow-y-auto pr-1">
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border-l-2 border-primary">
              <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
                <FiCpu size={12} className="text-primary" /> Run Privacy Simulations
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Engage with Choose Your Own Adventure privacy scenarios to build operational compliance skills.</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-secondary/10 to-transparent border-l-2 border-secondary">
              <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
                <FiMessageSquare size={12} className="text-secondary" /> Direct Chat Inquiries
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Ask Gemini AI details regarding federated learning mathematical boundaries and localized TF-IDF metrics.</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border-l-2 border-emerald-500">
              <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
                <FiCompass size={12} className="text-emerald-400" /> Continuous Risk Scanning
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Run the local PII analyzer regularly using diverse text presets to master structural credit-card leaks.</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
