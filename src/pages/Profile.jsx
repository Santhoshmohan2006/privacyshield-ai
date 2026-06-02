import React, { useState, useEffect } from 'react';
import GlassCard from '../components/UI/GlassCard';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { getUser, getApiSettings, saveApiSettings, getBadges, getXP, getLevelInfo } from '../utils/storage';
import { FiUser, FiSettings, FiAward, FiLock, FiStar, FiMail, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const BADGE_TEMPLATES = [
  {
    key: 'First Step',
    name: 'First Step',
    desc: 'Finished first privacy audit.',
    color: 'from-primary/10 to-accent/10 text-primary border-primary/30 shadow-glow-primary/10'
  },
  {
    key: 'Perfect Score',
    name: 'Perfect Score',
    desc: '100% correct quiz answer ratio.',
    color: 'from-secondary/10 to-accent/10 text-secondary border-secondary/30 shadow-glow-warning/10'
  },
  {
    key: 'Speed Demon',
    name: 'Speed Demon',
    desc: 'Finished with elite accuracy.',
    color: 'from-accent/10 to-primary/10 text-accent border-accent/30 shadow-glow-secondary/10'
  },
  {
    key: 'Privacy Expert',
    name: 'Privacy Expert',
    desc: 'Complete all 6 platform topics.',
    color: 'from-primary/20 to-secondary/20 text-primary border-primary/40 shadow-glow-success/10'
  },
  {
    key: 'Scenario Master',
    name: 'Scenario Master',
    desc: 'Solved choose-your-own-adventure.',
    color: 'from-secondary/20 to-primary/10 text-secondary border-secondary/40 shadow-glow-primary/10'
  }
];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [badges, setBadges] = useState([]);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    setUser(getUser());
    setApiKey(getApiSettings() || '');
    setBadges(getBadges());
    setXp(getXP());
  }, []);

  const handleSaveSettings = () => {
    saveApiSettings(apiKey);
    toast.success('Gemini client config updated!');
    setTimeout(() => window.location.reload(), 1000);
  };

  if (!user) return null;

  const levelInfo = getLevelInfo(xp);
  const xpPercentage = ((xp - levelInfo.prevLevelXP) / (levelInfo.nextLevelXP - levelInfo.prevLevelXP)) * 100;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 select-none">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Identity & Settings</h1>
        <p className="text-slate-400 text-xs font-semibold mt-1">Manage local Gemini endpoints and audit gamification achievements</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Side: Avatar, level progress */}
        <div className="space-y-6">
          <GlassCard className="flex flex-col items-center text-center p-8 border border-slate-700/40 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/20 mb-6 border border-white/10 relative group">
              <span className="text-3xl font-black text-slate-950">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            
            <h2 className="text-lg font-bold text-white tracking-tight">{user.name}</h2>
            <p className="text-slate-400 text-xs flex items-center gap-1.5 mt-1 font-semibold">
              <FiMail size={12} /> {user.email}
            </p>
            <span className="mt-4 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-black uppercase tracking-wider">
              {user.role} Compliance
            </span>
          </GlassCard>

          {/* Gamification Level Status Card */}
          <GlassCard className="p-6 border border-slate-700/40">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Security Tier Progress</span>
            <div className="mt-3 flex justify-between items-end">
              <div>
                <span className="text-2xl font-black text-white">Level {levelInfo.currentLevel}</span>
                <span className="text-[10px] text-primary uppercase font-black block mt-0.5 tracking-wider">{levelInfo.levelName}</span>
              </div>
              <span className="text-xs text-slate-400 font-bold">{xp} / {levelInfo.nextLevelXP} XP</span>
            </div>
            <div className="h-2 w-full bg-slate-900 border border-slate-850 rounded-full overflow-hidden mt-4">
              <div 
                className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-1000 ease-out" 
                style={{ width: `${Math.max(xpPercentage, 5)}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-500 font-semibold mt-2.5 block leading-normal">
              Earn XP by completing quizzes perfectly and making the right choices in Interactive Scenarios.
            </span>
          </GlassCard>
        </div>

        {/* Right Side Settings & Badges */}
        <div className="md:col-span-2 space-y-6">
          {/* Gemini API config */}
          <GlassCard className="border border-slate-700/40">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 tracking-tight">
              <FiSettings className="text-primary" /> Application Endpoints
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 block">
                  Google Gemini Developer API Key
                </label>
                <div className="flex gap-2">
                  <Input 
                    type="password" 
                    placeholder="Enter your Gemini 1.5/2.0 API Key" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSaveSettings} className="rounded-xl shadow-lg shadow-primary/10">Save Key</Button>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-3">
                  ⚠️ Note: Your API key is encrypted and saved strictly inside local sandbox cookies. It never touches third-party server endpoints.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Gamified Achievements/Badges */}
          <GlassCard className="border border-slate-700/40">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 tracking-tight">
              <FiAward className="text-amber-400 animate-bounce" /> Gamification Achievements
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BADGE_TEMPLATES.map((tmpl) => {
                const isEarned = badges.includes(tmpl.key);
                return (
                  <div 
                    key={tmpl.key} 
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-300 ${
                      isEarned 
                        ? `bg-gradient-to-br ${tmpl.color}` 
                        : 'bg-slate-950/20 border-slate-850 opacity-40 hover:opacity-50'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl border ${
                      isEarned 
                        ? 'bg-slate-950/60 border-yellow-500/20 text-yellow-400 shadow-inner' 
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}>
                      {isEarned ? <FiAward size={20} /> : <FiLock size={18} />}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-gray-200 block">{tmpl.name}</span>
                      <span className="text-[9px] text-slate-400 font-semibold leading-normal block">{tmpl.desc}</span>
                      {isEarned && (
                        <span className="inline-flex items-center gap-1 text-[8px] text-emerald-400 font-black uppercase tracking-wider mt-1.5">
                          <FiCheck size={10} /> Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Profile;
