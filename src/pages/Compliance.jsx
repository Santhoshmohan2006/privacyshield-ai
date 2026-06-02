import React, { useState, useEffect } from 'react';
import GlassCard from '../components/UI/GlassCard';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { analyzeCompliance, isGeminiOffline } from '../utils/gemini';
import { Link } from 'react-router-dom';
import { FiFileText, FiDownload, FiCheckCircle, FiXCircle, FiInfo, FiLayers } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const SAMPLE_POLICY = `Privacy Policy for CloudCorp Inc.

1. Data Collection: We gather personal information, including names, billing email addresses, physical location data, and cookies to customize browser experiences.
2. Third-Party Sharing: We do not sell individual records, but we share user tracking statistics and GPS coordinates with advertisement networks to offer personalized marketing promotions.
3. Retention: Accounts are retained indefinitely in order to prevent user friction during re-registration.
4. Compliance: We currently do not have a dedicated Data Protection Officer (DPO) nor do we provide a direct automated workflow for users to exercise their GDPR Right to Erasure (Right to be Forgotten). For help, email our general feedback support line.`;

const Compliance = () => {
  const [policy, setPolicy] = useState('');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [scorecard, setScorecard] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(isGeminiOffline());
  }, []);

  const calculateScorecard = (text) => {
    const lower = text.toLowerCase();
    
    // Quick automated keyword compliance scan
    const checks = [
      {
        id: 'rights',
        name: 'Data Subject Rights (Erasure, Purge)',
        passed: lower.includes('erasure') || lower.includes('forget') || lower.includes('delete') || lower.includes('purge'),
        desc: 'Mentions user rights to erase or access records.'
      },
      {
        id: 'retention',
        name: 'Storage & Retention Limitation',
        passed: lower.includes('retain') || lower.includes('retention') || lower.includes('limit'),
        desc: 'Defines transparent holding limits for datasets.'
      },
      {
        id: 'sharing',
        name: 'Third-Party Sharing Disclosure',
        passed: lower.includes('share') || lower.includes('third party') || lower.includes('disclosure'),
        desc: 'Discloses network sharing behavior clearly.'
      },
      {
        id: 'contact',
        name: 'Official Contact Detail',
        passed: lower.includes('contact') || lower.includes('email') || lower.includes('@'),
        desc: 'Mentions communication channels for inquiries.'
      },
      {
        id: 'dpo',
        name: 'Data Protection Officer (DPO)',
        passed: lower.includes('dpo') || lower.includes('protection officer'),
        desc: 'Specifies designated personnel to manage regulations.'
      }
    ];

    const passedCount = checks.filter(c => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);

    return {
      score,
      checks
    };
  };

  const handleCheck = async () => {
    if (!policy.trim()) {
      toast.error('Please input policy text first.');
      return;
    }

    setLoading(true);
    setReport('');
    setScorecard(null);
    
    try {
      // 1. Run local automated heuristic audit
      const computedScorecard = calculateScorecard(policy);
      setScorecard(computedScorecard);

      // 2. Query Gemini API for structured feedback
      const res = await analyzeCompliance(policy);
      setReport(res);
      toast.success('Auditing complete!');
    } catch (error) {
      toast.error('AI Compliance Check failed.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setPolicy(SAMPLE_POLICY);
    toast.success('Sample Policy Loaded');
  };

  const downloadPDF = async () => {
    const reportElement = document.getElementById('report-container');
    if (!reportElement) return;

    try {
      toast.loading('Generating Compliance PDF Report...', { id: 'pdf' });
      const canvas = await html2canvas(reportElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('privacyshield-compliance-report.pdf');
      toast.success('Compliance Report Exported!', { id: 'pdf' });
    } catch (error) {
      toast.error('Failed to export PDF.', { id: 'pdf' });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 select-none">
      {/* Title */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Compliance Heuristics Checker</h1>
            {isOffline && (
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-[9px] font-black uppercase tracking-wider animate-pulse">
                Simulated
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs font-semibold mt-1">Audit draft policies against GDPR & CCPA regulation criteria</p>
        </div>
        <Button variant="outline" onClick={loadSample} className="text-xs">
          Load Preset Template
        </Button>
      </div>

      {isOffline && (
        <div className="px-5 py-2.5 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-center justify-between text-amber-400 text-[10px] font-semibold animate-fade-in">
          <div className="flex items-center gap-2">
            <FiInfo size={12} className="shrink-0 animate-pulse text-amber-400" />
            <span>AI Compliance Auditing is operating in localized offline fallback mode. Save a Gemini API key in settings to enable live AI feedback.</span>
          </div>
          <Link to="/profile" className="underline hover:text-white transition-colors">
            Configure Key
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input box */}
        <GlassCard className="flex flex-col justify-between border border-slate-700/40">
          <div className="space-y-4 flex-grow flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight">Policy Content</h2>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Raw Text</span>
            </div>
            <Input
              as="textarea"
              rows={15}
              placeholder="Paste draft privacy guidelines, compliance agreements, or terms of service here..."
              value={policy}
              onChange={(e) => setPolicy(e.target.value)}
              className="flex-1 font-mono text-xs resize-none"
            />
          </div>
          <Button 
            onClick={handleCheck} 
            disabled={loading || !policy.trim()} 
            className="w-full mt-6 py-3 shadow-lg shadow-primary/20"
          >
            {loading ? 'Synthesizing Heuristic Auditing...' : 'Run Privacy Policy Audit'}
          </Button>
        </GlassCard>

        {/* Output box */}
        <GlassCard className="flex flex-col relative overflow-hidden p-0 border border-slate-700/40">
          <div className="p-6 border-b border-slate-850 flex justify-between items-center z-10 relative">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FiFileText className="text-primary" /> Audit Feedback Dashboard
            </h2>
            {report && (
              <Button variant="outline" onClick={downloadPDF} className="py-1 px-3 text-xs">
                <FiDownload className="mr-1" /> Save PDF
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll" id="report-container">
            {loading && (
              <div className="h-full flex items-center justify-center min-h-[300px]">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 border-t-2 border-primary border-r-2 rounded-full animate-spin mx-auto" />
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Compiling AI Compliance Matrix...</p>
                </div>
              </div>
            )}

            {!loading && scorecard && (
              <div className="space-y-6">
                {/* Visual score display */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-900/60 rounded-2xl border border-slate-850">
                  <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                    <svg className="transform -rotate-90" width="80" height="80">
                      <circle className="text-slate-800" strokeWidth="6" stroke="currentColor" fill="transparent" r="34" cx="40" cy="40" />
                      <circle 
                        className={`transition-all duration-1000 ease-out ${scorecard.score >= 80 ? 'text-emerald-400 ring-glow-success' : scorecard.score >= 50 ? 'text-amber-400 ring-glow-warning' : 'text-red-400 ring-glow-danger'}`} 
                        strokeWidth="6" 
                        strokeDasharray={2 * Math.PI * 34} 
                        strokeDashoffset={2 * Math.PI * 34 - (scorecard.score / 100) * 2 * Math.PI * 34}
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="34" 
                        cx="40" 
                        cy="40" 
                      />
                    </svg>
                    <span className="absolute text-lg font-black text-white">{scorecard.score}%</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Automated Regulation Score</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      This score reflects the ratio of critical compliance markers found in your document guidelines.
                    </p>
                  </div>
                </div>

                {/* Scorecard checklist */}
                <div className="space-y-3">
                  <h4 className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Regulation Target Matrix</h4>
                  <div className="grid gap-2">
                    {scorecard.checks.map((check) => (
                      <div 
                        key={check.id} 
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {check.passed ? (
                            <FiCheckCircle className="text-emerald-400 shrink-0" size={16} />
                          ) : (
                            <FiXCircle className="text-red-400 shrink-0" size={16} />
                          )}
                          <div>
                            <span className="text-xs font-bold text-gray-200 block">{check.name}</span>
                            <span className="text-[9px] text-slate-500 font-semibold">{check.desc}</span>
                          </div>
                        </div>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${check.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {check.passed ? 'Passed' : 'Missing'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Report Text */}
                {report && (
                  <div className="space-y-3 border-t border-slate-850 pt-6">
                    <h4 className="text-[10px] text-slate-500 font-black uppercase tracking-wider flex items-center gap-1.5">
                      <FiInfo /> AI Auditor Comprehensive Breakdown
                    </h4>
                    <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-850 whitespace-pre-wrap font-sans select-text">
                      {report}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!loading && !scorecard && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 min-h-[300px] text-center p-6">
                <FiFileText size={42} className="mb-4 text-primary animate-pulse" />
                <h3 className="font-bold text-sm text-gray-300">Auditor Ready</h3>
                <p className="text-xs text-slate-400 max-w-xs mt-2 leading-relaxed">
                  Provide policy guidelines and trigger audit. Results will detail DPO, retention, and third-party scores.
                </p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Compliance;
