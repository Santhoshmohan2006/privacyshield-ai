import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCompass, FiShield, FiAlertTriangle, FiCheckCircle, FiChevronRight, FiRefreshCw, FiZap } from 'react-icons/fi';
import GlassCard from '../components/UI/GlassCard';
import Button from '../components/UI/Button';
import { saveScenarioCompletion } from '../utils/storage';

const SCENARIOS = [
  {
    id: 'phishing',
    title: 'Phishing Attack Crisis',
    difficulty: 'Intermediate',
    icon: <FiAlertTriangle size={24} className="text-amber-400" />,
    description: 'You receive an urgent email from your "CEO" at 8:00 PM requesting an immediate wire transfer and download of a critical spreadsheet attachment.',
    steps: [
      {
        question: 'What is your immediate response to this urgent request?',
        choices: [
          {
            text: 'Download the attachment instantly to review the spreadsheet, then draft the transfer.',
            feedback: 'Critical Security Breach! The attachment contained ransomware that has encrypted all local files. Always verify suspicious attachments.',
            xpReward: -50,
            success: false,
            badge: null
          },
          {
            text: 'Reply directly to the email asking if this is legitimate and requesting clarification.',
            feedback: 'High Risk! In a phishing attack, replying just communicates with the attacker who will gladly confirm the fake request. Never reply to spoofed emails.',
            xpReward: -20,
            success: false,
            badge: null
          },
          {
            text: 'Forward the email to the IT Security Team and call the CEO directly via their verified office phone number.',
            feedback: 'Exceptional Defense! You contained the threat and verified authenticity out-of-band. The email was a spoofed spear-phishing attempt.',
            xpReward: 80,
            success: true,
            badge: 'Phishing Defender'
          }
        ]
      }
    ]
  },
  {
    id: 'data_breach',
    title: 'Data Breach Response',
    difficulty: 'Intermediate',
    icon: <FiShield size={24} className="text-red-400" />,
    description: 'A cybersecurity researcher emails you stating that your user database (containing passwords, emails, and full names) is publicly accessible on an open S3 bucket.',
    steps: [
      {
        question: 'How do you coordinate your response to this incident?',
        choices: [
          {
            text: 'Delete all database logs immediately so that there is no record of the leak, avoiding publicity.',
            feedback: 'GDPR Violation & Cover-up! Hiding breaches is illegal and results in catastrophic fines. Correct compliance requires full logging and reporting.',
            xpReward: -40,
            success: false,
            badge: null
          },
          {
            text: 'Isolate the S3 bucket to stop the exposure, triage the leak scale, notify legal counsels, and alert authorities within 72 hours.',
            feedback: 'Outstanding Compliance! You successfully contained the leak, followed GDPR Article 33 guidelines, and minimized corporate legal exposure.',
            xpReward: 80,
            success: true,
            badge: 'Breach Officer'
          },
          {
            text: 'Wait for 30 days to see if the vulnerability is reported by other researchers before taking action.',
            feedback: 'Extreme Exposure! Delaying response allows attackers to download your entire database. Response must be immediate.',
            xpReward: -50,
            success: false,
            badge: null
          }
        ]
      }
    ]
  },
  {
    id: 'gdpr_erasure',
    title: 'GDPR Right to Be Forgotten',
    difficulty: 'Beginner',
    icon: <FiCompass size={24} className="text-secondary" />,
    description: 'A European customer sends a formal email demanding that your organization deletes all traces of their personal data from all active systems, files, and server backups.',
    steps: [
      {
        question: 'What action does your product team take to address this erasure demand?',
        choices: [
          {
            text: 'Ignore the request since the user is no longer paying for your services.',
            feedback: 'Severe Non-Compliance! GDPR applies to all EU citizens regardless of account billing status. Ignoring leads to supervisory fines.',
            xpReward: -30,
            success: false,
            badge: null
          },
          {
            text: 'Deactivate their login credentials but keep their SQL profile records intact for sales forecasting and advertising metrics.',
            feedback: 'Privacy Violation! Restricting access is not erasure. You must fully purge identifiable records from production systems and backups.',
            xpReward: -20,
            success: false,
            badge: null
          },
          {
            text: 'Verify the identity of the requester, purge their data from active databases within 30 days, and place a tombstone marker for backups.',
            feedback: 'Perfect Privacy Engineering! You successfully honored the Right to Erasure (Article 17) while ensuring auditability and security.',
            xpReward: 80,
            success: true,
            badge: 'Erasure Expert'
          }
        ]
      }
    ]
  }
];

const Scenarios = () => {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showOutcome, setShowOutcome] = useState(false);

  const startScenario = (scenario) => {
    setSelectedScenario(scenario);
    setCurrentStepIndex(0);
    setSelectedChoice(null);
    setShowOutcome(false);
  };

  const selectOption = (choice) => {
    setSelectedChoice(choice);
  };

  const submitChoice = () => {
    if (!selectedChoice) return;
    setShowOutcome(true);
    
    // Save completion score/XP in storage
    saveScenarioCompletion(
      selectedScenario.id, 
      selectedChoice.text.substring(0, 30), 
      selectedChoice.success ? 100 : 0
    );
  };

  const resetAll = () => {
    setSelectedScenario(null);
    setCurrentStepIndex(0);
    setSelectedChoice(null);
    setShowOutcome(false);
  };

  return (
    <div className="relative py-6 max-w-5xl mx-auto min-h-[calc(100vh-10rem)] flex flex-col justify-center">
      {/* Background ambient orbs */}
      <div className="absolute top-0 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {!selectedScenario ? (
          // SCENARIOS SELECTOR LIST
          <motion.div
            key="selector"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h1 className="text-3xl lg:text-4xl font-black text-gradient tracking-tight">
                Interactive Privacy Simulations
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Step into critical operational situations. Make tough choices, evaluate architectural and ethical consequences, and earn XP rewards.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {SCENARIOS.map((sc) => (
                <GlassCard 
                  key={sc.id} 
                  className="flex flex-col h-full cursor-pointer hover:scale-102 transition-transform duration-300 relative overflow-hidden group"
                  onClick={() => startScenario(sc)}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 group-hover:border-primary/40 transition-colors">
                      {sc.icon}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-primary">
                        {sc.difficulty}
                      </span>
                      <h3 className="font-bold text-base text-gray-200 mt-0.5">{sc.title}</h3>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mt-4 flex-1 leading-relaxed">
                    {sc.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between text-xs font-semibold text-primary">
                    <span>Solve Simulation</span>
                    <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        ) : (
          // ACTIVE SIMULATION WIZARD
          <motion.div
            key="wizard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full max-w-3xl mx-auto"
          >
            <GlassCard className="p-8 border border-slate-700/40 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                    {selectedScenario.icon}
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black tracking-widest text-primary">
                      Simulation Active
                    </span>
                    <h2 className="text-lg font-bold text-white">{selectedScenario.title}</h2>
                  </div>
                </div>
                <button 
                  onClick={resetAll}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <FiRefreshCw /> Reset
                </button>
              </div>

              {!showOutcome ? (
                // SCENARIO QUESTION & CHOICES
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    {selectedScenario.description}
                  </p>
                  
                  <h3 className="font-bold text-sm text-gray-200 tracking-wide mt-6">
                    {selectedScenario.steps[currentStepIndex].question}
                  </h3>

                  <div className="space-y-3 mt-4">
                    {selectedScenario.steps[currentStepIndex].choices.map((ch, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectOption(ch)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex gap-4 ${
                          selectedChoice === ch
                            ? 'bg-primary/10 border-primary text-primary shadow-glow-primary/20'
                            : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/40'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                          selectedChoice === ch ? 'border-primary bg-primary text-slate-950' : 'border-slate-700'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs font-medium leading-relaxed">{ch.text}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button 
                      onClick={submitChoice}
                      disabled={!selectedChoice}
                      className="px-8 shadow-lg shadow-primary/20"
                    >
                      Analyze Choice <FiZap size={14} className="ml-1" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                // FEEDBACK & OUTCOME ANALYSIS
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 text-center"
                >
                  <div className="flex justify-center mb-4">
                    {selectedChoice.success ? (
                      <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 shadow-glow-success/20">
                        <FiCheckCircle size={48} />
                      </div>
                    ) : (
                      <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20 text-red-400 shadow-glow-danger/20">
                        <FiAlertTriangle size={48} />
                      </div>
                    )}
                  </div>

                  <h3 className={`text-xl font-bold ${selectedChoice.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedChoice.success ? 'Success Achieved' : 'Compromised Decision'}
                  </h3>

                  <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed mt-3">
                    {selectedChoice.feedback}
                  </p>

                  <div className="flex items-center justify-center gap-6 py-4 px-6 bg-slate-900/80 rounded-2xl border border-slate-800 max-w-xs mx-auto mt-6">
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-black">XP Gained</span>
                      <p className={`text-lg font-black mt-0.5 ${selectedChoice.xpReward > 0 ? 'text-primary' : 'text-red-400'}`}>
                        {selectedChoice.xpReward > 0 ? `+${selectedChoice.xpReward}` : selectedChoice.xpReward} XP
                      </p>
                    </div>
                    {selectedChoice.badge && (
                      <div className="border-l border-slate-800 pl-6 text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-black">Badge Earned</span>
                        <p className="text-xs font-black text-amber-400 mt-1">{selectedChoice.badge}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-8 border-t border-slate-800 flex justify-center gap-4">
                    <Button onClick={resetAll} variant="outline" className="px-6">
                      Explore Other Simulations
                    </Button>
                    {!selectedChoice.success && (
                      <Button onClick={() => {
                        setSelectedChoice(null);
                        setShowOutcome(false);
                      }} className="px-6">
                        Try Again
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scenarios;
