import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import GlassCard from '../../components/UI/GlassCard';
import Button from '../../components/UI/Button';
import { FiAward, FiArrowLeft, FiCheck, FiX, FiShare2, FiCpu, FiAlertTriangle } from 'react-icons/fi';
import { chatWithGemini } from '../../utils/gemini';
import quizzesData from '../../data/quizzes.json';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ConfettiRain = () => {
  const colors = ['#aeb784', '#e3dbbb', '#f8f3e1', '#8e9766', '#c2ba99'];
  const pieces = Array.from({ length: 60 }).map((_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 6;
    return { id: i, left, delay, color, size };
  });

  return (
    <>
      {pieces.map(p => (
        <span 
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}vw`,
            animationDelay: `${p.delay}s`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`
          }}
        />
      ))}
    </>
  );
};

const CircularScoreGauge = ({ score, total }) => {
  const scorePercent = (score / total) * 100;
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scorePercent / 100) * circumference;

  const colorClass = 
    scorePercent >= 80 ? 'text-emerald-400 ring-glow-success' :
    scorePercent >= 50 ? 'text-amber-400 ring-glow-warning' :
    'text-red-400 ring-glow-danger';

  return (
    <div className="relative w-36 h-36 flex items-center justify-center select-none mx-auto mb-6">
      <svg className="progress-ring transform -rotate-90" width="120" height="120">
        <circle
          className="text-slate-900"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className={`${colorClass} transition-all duration-1000 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-3xl font-black text-white">{score}</span>
        <span className="text-lg text-slate-500">/{total}</span>
        <span className="text-[7px] uppercase tracking-widest font-black text-slate-500 block mt-1">Audit Score</span>
      </div>
    </div>
  );
};

const QuizResult = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('Generating personalized AI feedback...');

  const quiz = quizzesData.find(q => q.id === id);

  useEffect(() => {
    if (!state || !quiz) {
      navigate('/quiz');
      return;
    }

    const generateFeedback = async () => {
      try {
        const prompt = `I just took a quiz on ${quiz.title}. I scored ${state.score} out of ${state.total}. Provide a brief, encouraging feedback (2 sentences) and one actionable advice (1 sentence) to improve. Keep it strictly under 3 sentences total.`;
        const res = await chatWithGemini(prompt);
        setFeedback(res);
      } catch (error) {
        setFeedback("Outstanding effort completing the quiz! Continue reviewing legal requirements and operational constraints regularly.");
      }
    };
    generateFeedback();
  }, [state, quiz, navigate]);

  if (!state || !quiz) return null;

  const percentage = (state.score / state.total) * 100;
  const isHighscore = percentage >= 80;

  const handleShare = () => {
    const text = `🏆 I scored ${state.score}/${state.total} (${Math.round(percentage)}%) on the "${quiz.title}" Privacy Assessment! Can you beat my audit level? Check out PrivacyShield AI!`;
    navigator.clipboard.writeText(text);
    toast.success('Assessment result copied!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4 select-none">
      {/* Light Confetti Rain on Highscores */}
      {isHighscore && <ConfettiRain />}

      <Button variant="ghost" onClick={() => navigate('/quiz')} className="text-xs">
        <FiArrowLeft className="mr-1.5" /> Back to Syllabus
      </Button>

      {/* Main card audit gauge */}
      <GlassCard className="text-center p-8 border border-slate-700/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
        
        {/* Animated Badge Unlock Overlay if highscore */}
        {isHighscore && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
            className="absolute top-4 left-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 p-2 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-glow-warning/10"
          >
            <FiAward /> Badge Earned
          </motion.div>
        )}

        <CircularScoreGauge score={state.score} total={state.total} />
        
        <h2 className="text-2xl font-black text-white tracking-tight">Audit Assessment Complete!</h2>
        <p className="text-slate-400 text-xs font-semibold mt-1 mb-8">{quiz.title}</p>
        
        {/* Actions grid */}
        <div className="flex justify-center gap-4 mb-8">
          <Button onClick={handleShare} variant="outline" className="px-5 text-xs py-2">
            <FiShare2 className="mr-1" /> Copy Share Link
          </Button>
          <Button onClick={() => navigate('/dashboard')} className="px-5 text-xs py-2 shadow-lg shadow-primary/20">
            Go to Dashboard
          </Button>
        </div>

        {/* AI report summary */}
        <div className="p-5 bg-slate-900/60 border border-slate-850 rounded-2xl text-left space-y-2">
          <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
            <FiCpu className="text-primary" /> Personalized AI Guidance
          </h3>
          <p className="text-slate-300 text-xs leading-relaxed bg-slate-950/20 p-3 rounded-xl border border-slate-850">
            {feedback}
          </p>
        </div>
      </GlassCard>

      {/* Review Answers list */}
      <GlassCard className="border border-slate-700/40">
        <h3 className="text-base font-bold text-white mb-6">Review Answers</h3>
        
        <div className="grid gap-4">
          {quiz.questions.map((q, i) => {
            const isCorrect = state.answers[i] === q.answer;
            return (
              <div key={i} className={`p-5 rounded-2xl border ${
                isCorrect 
                  ? 'bg-emerald-500/5 border-emerald-500/10' 
                  : 'bg-red-500/5 border-red-500/10'
              }`}>
                <p className="font-bold text-sm text-gray-200 mb-4">{i + 1}. {q.q}</p>
                <div className="grid gap-2">
                  {q.options.map((opt, optIdx) => {
                    let optClass = "text-slate-400 bg-slate-950/10 border border-slate-850";
                    let Indicator = null;
                    
                    if (optIdx === q.answer) {
                      optClass = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 font-bold";
                      Indicator = <FiCheck className="text-emerald-400" size={14} />;
                    } else if (optIdx === state.answers[i] && !isCorrect) {
                      optClass = "text-red-400 bg-red-500/10 border-red-500/20 font-bold";
                      Indicator = <FiX className="text-red-400" size={14} />;
                    }

                    return (
                      <div 
                        key={optIdx} 
                        className={`p-3 rounded-xl text-xs flex justify-between items-center transition-all ${optClass}`}
                      >
                        <span>{opt}</span>
                        {Indicator}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};

export default QuizResult;
