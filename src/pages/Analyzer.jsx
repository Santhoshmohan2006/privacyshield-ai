import React, { useState, useEffect } from 'react';
import GlassCard from '../components/UI/GlassCard';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { analyzePrivacyRisk } from '../utils/nlp';
import { analyzeRiskExplanation, isGeminiOffline } from '../utils/gemini';
import { Link } from 'react-router-dom';
import { FiShield, FiAlertTriangle, FiCheckCircle, FiCopy, FiInfo, FiLayers, FiCpu } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const PRESETS = [
  {
    label: "Medical Health Records",
    text: "Patient John Doe visited City Clinic. Patient ID is #202-A, diagnosed with chronic diabetes. The clinical history was shared with our medical insurance provider under policy #A9983."
  },
  {
    label: "Financial Spoof",
    text: "URGENT: Verify my billing address 456 Elm St and credit card 4111-2222-3333-4444. Also my Social Security Number (SSN) is 000-12-3456. Email confirmation to mark.chen@finance-cloud.org."
  },
  {
    label: "Ad-Tech Data Harvesting",
    text: "We collect GPS coordinates and real-time location. Our app reserves the right to sell data to third-party advertisers, deploy tracking pixels, capture IP address arrays, and construct cookies."
  }
];

const GaugeMeter = ({ score, level }) => {
  const radius = 45;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  // Arc calculation for smooth loading
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorClass = 
    level === 'Low' ? 'text-emerald-400 ring-glow-success' :
    level === 'Medium' ? 'text-amber-400 ring-glow-warning' :
    'text-red-400 ring-glow-danger';

  return (
    <div className="relative w-32 h-32 flex items-center justify-center select-none mx-auto">
      <svg className="progress-ring transform -rotate-90" width="100" height="100">
        <circle
          className="text-slate-800"
          strokeWidth={stroke}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          className={`${colorClass} transition-all duration-1000 ease-out`}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-2xl font-black text-white">{Math.round(score)}</span>
        <span className="text-[7px] uppercase font-black text-slate-500 tracking-widest block">Index</span>
      </div>
    </div>
  );
};

const Analyzer = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(isGeminiOffline());
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error('Please input some text');
      return;
    }

    setLoading(true);
    setResult(null);
    setExplanation('');
    
    try {
      // 1. Run local regex/dictionary NLP
      const localAnalysis = analyzePrivacyRisk(text);
      setResult(localAnalysis);

      // 2. Generate Gemini explanation
      const aiExplain = await analyzeRiskExplanation(text, localAnalysis.scoreOutOf10);
      setExplanation(aiExplain);
    } catch (error) {
      toast.error('Analysis pipeline encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (presetText) => {
    setText(presetText);
    toast.success('Preset loaded');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 select-none">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-white tracking-tight">Privacy Risk Analyzer</h1>
          {isOffline && (
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-[9px] font-black uppercase tracking-wider animate-pulse">
              Simulated
            </span>
          )}
        </div>
        <p className="text-slate-400 text-xs font-semibold mt-1">Identify PII leaks and track compliance exposures using localized NLP tokenizers</p>
      </div>

      {isOffline && (
        <div className="px-5 py-2.5 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-center justify-between text-amber-400 text-[10px] font-semibold animate-fade-in">
          <div className="flex items-center gap-2">
            <FiInfo size={12} className="shrink-0 animate-pulse text-amber-400" />
            <span>AI Compliance Diagnosis is operating in localized offline fallback mode. Save a Gemini API key in settings to enable live AI audits.</span>
          </div>
          <Link to="/profile" className="underline hover:text-white transition-colors">
            Configure Key
          </Link>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Side: Input area & presets */}
        <GlassCard className="flex flex-col justify-between border border-slate-700/40">
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight">Audit Text Input</h2>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Local Scan</span>
            </div>

            {/* Presets Chips */}
            <div className="flex flex-wrap gap-2 py-1">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(preset.text)}
                  className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-slate-900 border border-slate-800 hover:border-primary/40 text-slate-400 hover:text-white transition-all"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <Input
              as="textarea"
              rows={12}
              placeholder="Paste email, company logs, database schema or diagnostic documents here to audit for personal identifiers..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 font-mono text-xs resize-none"
            />
          </div>

          <Button 
            onClick={handleAnalyze} 
            disabled={loading || !text.trim()} 
            className="w-full mt-6 py-3 shadow-lg shadow-primary/20"
          >
            {loading ? 'Performing Local NLP Scan...' : 'Analyze Document Risks'}
          </Button>
        </GlassCard>

        {/* Right Side: Results output & gauge */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-[400px]"
            >
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-t-2 border-primary border-r-2 rounded-full animate-spin mx-auto" />
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Compiling NLP Tokenizer Weights...</p>
              </div>
            </motion.div>
          )}

          {!loading && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Score and Circular arc gauge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassCard className="text-center flex flex-col justify-between py-6">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Privacy Risk Score</span>
                  <GaugeMeter score={result.score} level={result.level} />
                  <p className={`font-black text-sm uppercase tracking-widest mt-2 ${
                    result.level === 'Low' ? 'text-emerald-400 glow-success' :
                    result.level === 'Medium' ? 'text-amber-400 glow-warning' :
                    'text-red-400 glow-danger'
                  }`}>
                    {result.level} Severity Risk
                  </p>
                </GlassCard>

                {/* Highlighted text preview */}
                <GlassCard className="flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-850 pb-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">PII Highlights</span>
                    <FiLayers className="text-slate-400" size={14} />
                  </div>
                  <div 
                    className="text-[11px] leading-relaxed font-mono custom-scroll overflow-y-auto max-h-36 p-3 rounded-xl bg-slate-950/60 border border-slate-850 whitespace-pre-wrap select-text selection:bg-primary/30"
                    dangerouslySetInnerHTML={{ __html: result.highlightedText }}
                  />
                  <div className="flex gap-4 mt-2 justify-end text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400" /> High</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Med</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Low</span>
                  </div>
                </GlassCard>
              </div>

              {/* Keyword List breakdown */}
              {result.matches.length > 0 && (
                <GlassCard>
                  <h3 className="font-bold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FiAlertTriangle className="text-amber-400" /> Tokenizer Extracted Detections ({result.matches.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matches.map((m, i) => (
                      <span 
                        key={i} 
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border flex items-center gap-1.5 ${
                          m.severity === 'High' 
                            ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {m.term}
                        <span className="bg-slate-950/60 px-1 py-0.5 rounded text-[8px] text-slate-400">{m.category}</span>
                      </span>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Gemini AI explanation */}
              <GlassCard className="space-y-3">
                <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                  <FiCpu className="text-primary animate-pulse" /> AI Compliance Diagnosis
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/30 p-3.5 rounded-xl border border-slate-850 select-text">
                  {explanation || 'Synthesizing contextual legal feedback from model...'}
                </p>
              </GlassCard>
            </motion.div>
          )}

          {!loading && !result && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center text-slate-500 border border-slate-800 border-dashed rounded-3xl min-h-[400px] p-8"
            >
              <FiShield size={42} className="mb-4 text-primary animate-pulse" />
              <h3 className="font-bold text-sm text-gray-300">Analyzer Standby</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-2 leading-relaxed">
                Provide text manually or click a preset shortcut above to compile our neural privacy audit dashboard.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Analyzer;
