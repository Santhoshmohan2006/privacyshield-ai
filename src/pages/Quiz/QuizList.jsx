import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/UI/GlassCard';
import Button from '../../components/UI/Button';
import { FiClock, FiCheckCircle, FiBookOpen, FiAward, FiLock } from 'react-icons/fi';
import quizzesData from '../../data/quizzes.json';
import { getScores } from '../../utils/storage';

const QuizList = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    setScores(getScores());
  }, []);

  const getDifficultyColor = (diff) => {
    if (diff === 'Beginner') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (diff === 'Intermediate') return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    return 'bg-red-500/10 text-red-400 border border-red-500/20';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 select-none">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Privacy & Ethics Quizzes</h1>
        <p className="text-slate-400 text-xs font-semibold mt-1">Test your compliance awareness across 6 specialized AI security modules</p>
      </div>

      {/* Grid of Quizzes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzesData.map((quiz, idx) => {
          const attempts = scores.filter(s => s.quizId === quiz.id);
          const isCompleted = attempts.length > 0;
          const bestScore = isCompleted ? Math.max(...attempts.map(a => a.score)) : 0;
          const maxQuestions = quiz.questions.length;
          
          return (
            <GlassCard key={quiz.id} delay={idx * 0.08} className="flex flex-col h-full justify-between relative group select-none overflow-hidden border border-slate-700/40">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                  <span className="flex items-center text-[10px] text-slate-500 font-bold gap-1">
                    <FiClock /> 5 Mins
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-200 mt-2 tracking-tight group-hover:text-primary transition-colors">{quiz.title}</h3>
                
                <div className="flex items-center gap-2 mt-4 text-[11px] font-bold text-slate-400">
                  <FiBookOpen className="text-slate-500" size={13} />
                  <span>{maxQuestions} Specialized Questions</span>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="mt-8 pt-4 border-t border-slate-850 flex flex-col gap-3">
                {isCompleted ? (
                  <div className="flex items-center justify-between px-3 py-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                    <span className="flex items-center gap-1"><FiCheckCircle /> Completed</span>
                    <span className="flex items-center gap-1"><FiAward /> Best: {bestScore}/{maxQuestions}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-850 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <span className="flex items-center gap-1"><FiLock /> Unattempted</span>
                  </div>
                )}
                
                <Button onClick={() => navigate(`/quiz/${quiz.id}`)} className="w-full text-xs py-2.5 shadow-md shadow-primary/10">
                  {isCompleted ? 'Retry Module' : 'Begin Assessment'}
                </Button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

export default QuizList;
