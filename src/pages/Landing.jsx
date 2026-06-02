import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiCpu, FiBookOpen, FiArrowRight, FiLock, FiStar, FiCheckCircle } from 'react-icons/fi';
import Button from '../components/UI/Button';
import GlassCard from '../components/UI/GlassCard';
import ParticleNetwork from '../components/Effects/ParticleNetwork';
import TypeWriter from '../components/UI/TypeWriter';
import AnimatedCounter from '../components/UI/AnimatedCounter';

const Landing = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { 
      icon: <FiCpu size={26} />, 
      title: 'AI Awareness Assistant', 
      desc: 'Engage with Gemini to receive custom privacy guidance, compliance breakdowns, and direct explanations.' 
    },
    { 
      icon: <FiBookOpen size={26} />, 
      title: 'Gamified Scenarios & Quizzes', 
      desc: 'Master GDPR policies, differential privacy, and cybersecurity threats through simulated choose-your-own-adventure challenges.' 
    },
    { 
      icon: <FiShield size={26} />, 
      title: 'Advanced Risk Analyzer', 
      desc: 'Input files or texts to scan for SSNs, credit cards, location points, and credentials using our localized NLP tokenizer engine.' 
    },
  ];

  const testimonials = [
    { name: 'Sarah Jenkins', role: 'Data Protection Officer', text: 'PrivacyShield completely gamified our developers\' data awareness training. Simply brilliant!' },
    { name: 'Marcus Chen', role: 'Lead AI Engineer', text: 'The interactive simulations for federated learning and data minimization are the best in the industry.' }
  ];

  return (
    <div className="min-h-screen bg-darkBg text-white relative overflow-hidden font-sans noise-overlay">
      {/* Background Interactive Canvas Particle Network */}
      <ParticleNetwork opacity={0.65} />

      {/* Mouse Following Ambient Gradient Orbs */}
      <div 
        className="absolute w-[450px] h-[450px] rounded-full bg-primary/10 mix-blend-screen filter blur-[120px] pointer-events-none transition-transform duration-300 ease-out hidden md:block"
        style={{
          transform: `translate(${mousePos.x - 225}px, ${mousePos.y - 225}px)`,
          top: 0,
          left: 0,
        }}
      />
      <div className="absolute top-[-10%] left-[-15%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[140px] pointer-events-none animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-15%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[140px] pointer-events-none animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Navbar */}
      <nav className="relative z-20 flex justify-between items-center p-6 lg:px-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="p-2 bg-slate-900/80 rounded-xl border border-primary/20 shadow-glow-primary/10">
            <FiShield className="text-primary text-2xl" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gradient tracking-tight">PrivacyShield</h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">Responsible AI</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
          <Button onClick={() => navigate('/register')} className="shadow-lg shadow-primary/20">Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 mt-16 lg:mt-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-[11px] font-bold text-slate-300 tracking-wide uppercase select-none">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            V2.0 AI Compliance Engine
          </div>

          <h2 className="text-4xl lg:text-7xl font-black leading-tight tracking-tight">
            Master Data Privacy with <br className="hidden md:block"/>
            <TypeWriter 
              words={['Intelligent AI', 'GDPR Compliance', 'Data Minimization', 'Surveillance Defense']} 
              speed={80} 
              deleteSpeed={40} 
              delayBetween={2500} 
              className="text-gradient" 
            />
          </h2>
          <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Learn state-of-the-art responsible AI development, data minimization, and GDPR compliance through real-time AI simulations, PII regex scanning, and gamified scenarios.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button onClick={() => navigate('/register')} className="py-4 px-8 text-base rounded-full group shadow-xl shadow-primary/20 border border-primary/30">
              Start Learning Now
              <FiArrowRight className="group-hover:translate-x-1.5 transition-transform" />
            </Button>
            <Button onClick={() => navigate('/login')} variant="outline" className="py-4 px-8 text-base rounded-full">
              Explore Demo Dashboard
            </Button>
          </div>
        </motion.div>

        {/* Animated Counter Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl mt-24 py-8 px-6 bg-slate-900/40 rounded-3xl border border-slate-800/80 backdrop-blur-md">
          <div className="text-center">
            <AnimatedCounter to={25000} suffix="+" className="text-2xl lg:text-3xl font-black text-white block" />
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1 block">PII Risks Detected</span>
          </div>
          <div className="text-center border-l border-slate-850">
            <AnimatedCounter to={6} suffix=" Topics" className="text-2xl lg:text-3xl font-black text-primary block" />
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1 block">Gamified Courses</span>
          </div>
          <div className="text-center border-l border-slate-850">
            <AnimatedCounter to={100} suffix="%" className="text-2xl lg:text-3xl font-black text-secondary block" />
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1 block">GDPR Compliance</span>
          </div>
          <div className="text-center border-l border-slate-850">
            <AnimatedCounter to={5} prefix="Level " className="text-2xl lg:text-3xl font-black text-emerald-400 block" />
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1 block">Max Gamification Level</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl mt-24 pb-12">
          {features.map((feature, idx) => (
            <GlassCard key={idx} delay={0.15 * idx} className="text-center p-8 flex flex-col items-center select-none">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-inner border border-primary/20 shadow-glow-primary/10">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-3 text-white tracking-wide">{feature.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{feature.desc}</p>
            </GlassCard>
          ))}
        </div>

        {/* Testimonials */}
        <div className="w-full max-w-5xl mt-12 pb-24 border-t border-slate-900/60 pt-16">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
            <h3 className="text-2xl font-bold text-white tracking-tight">Endorsed by Security Teams</h3>
            <p className="text-slate-400 text-xs font-semibold">Join thousands of practitioners building secure AI models.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <GlassCard key={idx} delay={0.3} className="p-6 relative select-none flex flex-col">
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => <FiStar key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-slate-300 text-xs italic leading-relaxed flex-1">"{t.text}"</p>
                <div className="mt-6 flex items-center justify-between border-t border-slate-850 pt-4">
                  <div>
                    <h4 className="font-bold text-xs text-white leading-none">{t.name}</h4>
                    <span className="text-[10px] text-slate-500 font-semibold mt-1 block">{t.role}</span>
                  </div>
                  <FiCheckCircle size={18} className="text-emerald-400" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <FiShield size={16} className="text-primary" />
            <span>&copy; 2026 PrivacyShield AI. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">GDPR Audit Hub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
