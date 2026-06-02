import React, { useEffect, useState } from 'react';
import { getScores, getBadges, getXP, getLevelInfo } from '../utils/storage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { FiTrendingUp, FiCpu, FiAward, FiDownload, FiCheck, FiX, FiLayers } from 'react-icons/fi';
import GlassCard from '../components/UI/GlassCard';
import Button from '../components/UI/Button';
import quizzesData from '../data/quizzes.json';
import { toast } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Analytics = () => {
  const [scores, setScores] = useState([]);
  
  useEffect(() => {
    setScores(getScores());
  }, []);

  const getQuizName = (id) => {
    const q = quizzesData.find(quiz => quiz.id === id);
    return q ? q.title : `Quiz ${id}`;
  };

  // Recent scores bar chart data
  const barData = scores.length > 0 ? scores.slice(-6).map((s, idx) => ({
    name: getQuizName(s.quizId).substring(0, 12),
    score: Math.round((s.score / s.maxScore) * 100)
  })) : [
    { name: 'Basics', score: 80 },
    { name: 'GDPR', score: 60 },
    { name: 'Federated ML', score: 90 },
    { name: 'Cybersecurity', score: 50 },
  ];

  // Radar chart dynamic skills matrix data
  const categories = [
    { subject: 'Privacy Basics', id: '1' },
    { subject: 'GDPR Law', id: '2' },
    { subject: 'Federated ML', id: '3' },
    { subject: 'Cyber Threats', id: '4' },
    { subject: 'Ethical AI', id: '5' },
    { subject: 'Breach Response', id: '6' }
  ];

  const radarData = categories.map(cat => {
    const attempts = scores.filter(s => s.quizId === cat.id);
    let bestScorePercent = 0;
    if (attempts.length > 0) {
      bestScorePercent = Math.max(...attempts.map(a => (a.score / a.maxScore) * 100));
    }
    return {
      subject: cat.subject,
      score: bestScorePercent === 0 ? 15 : Math.round(bestScorePercent), // Baseline 15% for styling visual
      fullMark: 100
    };
  });

  // Course Completion Pie chart
  const completedTopicsCount = new Set(scores.map(s => s.quizId)).size;
  const pieData = [
    { name: 'Completed', value: completedTopicsCount },
    { name: 'Locked Topics', value: Math.max(6 - completedTopicsCount, 0) },
  ];
  const COLORS = ['#aeb784', '#1c1e0f'];

  // Strength and Weakness categorization
  const strengths = [];
  const weaknesses = [];

  categories.forEach(cat => {
    const attempts = scores.filter(s => s.quizId === cat.id);
    if (attempts.length > 0) {
      const best = Math.max(...attempts.map(a => (a.score / a.maxScore) * 100));
      if (best >= 80) {
        strengths.push({ name: cat.subject, score: Math.round(best) });
      } else if (best < 65) {
        weaknesses.push({ name: cat.subject, score: Math.round(best) });
      }
    } else {
      weaknesses.push({ name: cat.subject, score: 0 });
    }
  });

  const exportReport = async () => {
    const analyticsElement = document.getElementById('analytics-dashboard');
    if (!analyticsElement) return;

    try {
      toast.loading('Exporting Audit PDF...', { id: 'pdf' });
      const canvas = await html2canvas(analyticsElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('privacyshield-analytics-report.pdf');
      toast.success('Analytics PDF Downloaded!', { id: 'pdf' });
    } catch (error) {
      toast.error('Failed to export analytics.');
    }
  };

  return (
    <div className="space-y-6 py-4 select-none" id="analytics-dashboard">
      {/* Title */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Performance Analytics</h1>
          <p className="text-slate-400 text-xs font-semibold mt-1">Detailed breakdown of privacy compliance engineering metrics</p>
        </div>
        <Button variant="outline" onClick={exportReport} className="text-xs">
          <FiDownload className="mr-1.5" /> Export PDF Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Skills Balance Chart */}
        <GlassCard className="lg:col-span-2 h-96 flex flex-col justify-between" delay={0.1}>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Privacy Skills Radar</h2>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Vector Skills Balance Graph</p>
          </div>
          
          <div className="flex-1 w-full h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" opacity={0.5} />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
                <Radar name="Skills Profile" dataKey="score" stroke="#aeb784" fill="#aeb784" fillOpacity={0.25} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(5,5,5,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Completion Progress Pie Chart */}
        <GlassCard className="h-96 flex flex-col justify-between items-center py-6" delay={0.2}>
          <div className="text-center w-full">
            <h2 className="text-base font-bold text-white tracking-tight">Topics Completion</h2>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Topic syllabus completed</p>
          </div>
          
          <div className="flex-grow w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="transition-all duration-500" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(8,12,20,0.95)', border: 'none', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-3xl font-black text-white">{completedTopicsCount}</span>
              <span className="text-[8px] uppercase tracking-widest font-black text-slate-500 block">Of 6 Topics</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 text-[10px] uppercase font-bold tracking-widest">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-primary rounded-full" /><span>Completed</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-slate-800 rounded-full" /><span>Pending</span></div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historial Bar Chart of Quizzes */}
        <GlassCard className="lg:col-span-2 h-96 flex flex-col justify-between" delay={0.3}>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Quiz Score Trends</h2>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Progress rating bar percentages</p>
          </div>

          <div className="flex-1 w-full h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: 'rgba(174,183,132,0.05)' }} 
                  contentStyle={{ backgroundColor: 'rgba(5,5,5,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="score" fill="#aeb784" radius={[6, 6, 0, 0]} barSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Strengths & Weaknesses Cards list */}
        <GlassCard className="h-96 flex flex-col justify-between" delay={0.4}>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Skill Breakdown</h2>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Regulatory Strengths & Weaknesses</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mt-6 custom-scroll">
            {/* Strengths list */}
            <div>
              <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest block mb-2">{"Strengths (>=80%)"}</span>
              {strengths.length === 0 ? (
                <span className="text-[10px] text-slate-500 font-semibold italic">No high-compliance score profiles saved yet.</span>
              ) : (
                <div className="grid gap-1.5">
                  {strengths.map((str, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5"><FiCheck size={12} className="text-emerald-400" />{str.name}</span>
                      <span className="font-black text-emerald-400">{str.score}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Weaknesses list */}
            <div className="pt-2 border-t border-slate-850">
              <span className="text-[9px] text-red-400 font-black uppercase tracking-widest block mb-2">{"Needs Review (<65% or Unattempted)"}</span>
              {weaknesses.length === 0 ? (
                <span className="text-[10px] text-slate-500 font-semibold italic">Compliance targets fully secure! No weaknesses.</span>
              ) : (
                <div className="grid gap-1.5">
                  {weaknesses.map((weak, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-red-500/5 border border-red-500/10 text-xs">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5"><FiX size={12} className="text-red-400" />{weak.name}</span>
                      <span className="font-black text-red-400">{weak.score}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Analytics;
