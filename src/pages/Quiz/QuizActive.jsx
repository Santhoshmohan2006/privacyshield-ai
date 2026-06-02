import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GlassCard from '../../components/UI/GlassCard';
import Button from '../../components/UI/Button';
import quizzesData from '../../data/quizzes.json';
import { saveScore } from '../../utils/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiCheck, FiCpu, FiAlertTriangle, FiBookOpen } from 'react-icons/fi';

const QuizActive = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins

  useEffect(() => {
    const q = quizzesData.find(q => q.id === id);
    if (q) setQuiz(q);
    else navigate('/quiz');
  }, [id, navigate]);

  useEffect(() => {
    if (!quiz) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [answers, quiz]);

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = (finalAnswers) => {
    let score = 0;
    finalAnswers.forEach((ans, i) => {
      if (ans === quiz.questions[i].answer) score++;
    });
    saveScore(quiz.id, score, quiz.questions.length);
    navigate(`/quiz/result/${quiz.id}`, { state: { score, total: quiz.questions.length, answers: finalAnswers } });
  };

  const handleSubmit = () => {
    const finalAnswers = [...answers, selected !== null ? selected : -1];
    finishQuiz(finalAnswers);
  };

  if (!quiz) return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-t-2 border-primary border-r-2 rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Syncing Quiz Syllabus...</p>
      </div>
    </div>
  );

  const question = quiz.questions[currentQ];
  const progressPercent = ((currentQ) / quiz.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4 select-none">
      {/* Top Header info */}
      <div className="flex justify-between items-center bg-slate-900/60 border border-slate-800/80 px-5 py-3.5 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-primary"><FiBookOpen size={14} /></span>
          <h2 className="text-sm font-bold text-gray-200">{quiz.title}</h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="text-slate-500 uppercase tracking-wider">Q: {currentQ + 1}/{quiz.questions.length}</span>
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/40 border border-slate-850 text-slate-300 font-bold ${timeLeft < 60 ? 'text-red-400 border-red-500/20 bg-red-500/5 animate-pulse' : ''}`}>
            <FiClock /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 border border-slate-850 h-2.5 rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-primary to-accent h-full glow-primary"
        />
      </div>

      {/* Sliding Transition Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <GlassCard className="p-8 border border-slate-700/40">
            <h3 className="text-lg lg:text-xl font-black text-white leading-relaxed mb-8">{question.q}</h3>
            
            <div className="grid gap-3">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between text-xs font-semibold ${
                    selected === i 
                      ? 'bg-primary/10 border-primary text-primary shadow-glow-primary/10' 
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <span>{opt}</span>
                  {selected === i && <FiCheck className="text-primary shrink-0 ml-4" size={16} />}
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button onClick={handleNext} disabled={selected === null} className="px-8 shadow-lg shadow-primary/20">
                {currentQ < quiz.questions.length - 1 ? 'Next Question' : 'Finish Assessment'}
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizActive;
