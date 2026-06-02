import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { saveUser, getApiSettings, saveApiSettings } from '../../utils/storage';
import { toast } from 'react-hot-toast';
import GlassCard from '../../components/UI/GlassCard';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import { FiShield, FiKey } from 'react-icons/fi';
import ParticleNetwork from '../../components/Effects/ParticleNetwork';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState(getApiSettings() || '');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Mock authentication
    saveUser({ email, name: email.split('@')[0], role: 'student' });
    if (apiKey) saveApiSettings(apiKey);
    
    toast.success('Logged in successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Dynamic Background Particle effect */}
      <ParticleNetwork opacity={0.5} />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-float pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-float pointer-events-none" style={{ animationDelay: '1.5s' }}></div>

      <GlassCard className="w-full max-w-md z-10 p-8 border border-slate-700/40 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center border border-primary/20 shadow-glow-primary/10 mb-4">
            <FiShield size={28} className="text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-center text-white tracking-tight">Security System Sign In</h2>
          <p className="text-slate-400 mt-1 text-xs font-semibold text-center">Login to your local PrivacyShield environment</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            label="Security Email / Identity" 
            type="email" 
            placeholder="operator@privacyshield.sec" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            label="Account Credentials" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div className="pt-4 border-t border-slate-800/80 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <FiKey className="text-primary" size={14} />
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Gemini Dev API Key (Optional)</label>
            </div>
            <Input 
              type="password" 
              placeholder="AIzaSy..." 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-xs"
            />
            <p className="text-[9px] text-slate-500 font-semibold mt-2 leading-relaxed">
              Required for real-time compliance diagnostics and AI conversation helpers. Key is encrypted and stored locally in sandbox state.
            </p>
          </div>

          <Button type="submit" className="w-full mt-6 py-3 shadow-lg shadow-primary/20">
            Establish Secure Session
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6 font-semibold">
          New operator? <Link to="/register" className="text-primary hover:text-primary/80 transition-colors font-bold underline">Create environment</Link>
        </p>
      </GlassCard>
    </div>
  );
};

export default Login;
