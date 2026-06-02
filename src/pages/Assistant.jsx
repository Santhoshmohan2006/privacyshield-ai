import React, { useState, useEffect, useRef } from 'react';
import { chatWithGemini, isGeminiOffline } from '../utils/gemini';
import { getChatHistory, saveChatHistory } from '../utils/storage';
import { Link } from 'react-router-dom';
import { FiSend, FiCpu, FiUser, FiTrash2, FiCopy, FiCheck, FiInfo } from 'react-icons/fi';
import GlassCard from '../components/UI/GlassCard';
import Button from '../components/UI/Button';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Robust localized Markdown formatter helper
const formatMarkdown = (text) => {
  if (!text) return '';
  
  // Escape HTML tags to prevent XSS
  let formatted = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Multi-line code blocks
  formatted = formatted.replace(
    /```(\w*)\n([\s\S]*?)\n```/g,
    '<pre class="my-2 p-3 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto font-mono text-xs text-primary">$2</pre>'
  );

  // Single-line inline code
  formatted = formatted.replace(
    /`([^`]+)`/g,
    '<code class="px-1.5 py-0.5 bg-slate-900/60 border border-slate-800 rounded text-xs font-mono text-primary">$1</code>'
  );

  // Bold text
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-extrabold text-white text-gradient">$1</strong>');

  // Italic text
  formatted = formatted.replace(/\*([^*]+)\*/g, '<em class="italic text-slate-300">$1</em>');

  // Bulleted lists (convert lines starting with - or * into bullet points)
  formatted = formatted.replace(/^\s*[-*]\s+(.+)$/gm, '<li class="ml-4 list-disc text-slate-300">$1</li>');

  // Blockquotes
  formatted = formatted.replace(
    /^\s*&gt;\s+(.+)$/gm,
    '<blockquote class="border-l-4 border-primary/50 pl-4 py-1 italic text-slate-400">$1</blockquote>'
  );

  // Line breaks
  formatted = formatted.split('\n').join('<br />');

  return formatted;
};

const Assistant = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const messagesEndRef = useRef(null);

  const SUGGESTED_PROMPTS = [
    { title: 'Explain GDPR principles', desc: 'Brief summary of key compliance guidelines.' },
    { title: 'Define Federated Learning', desc: 'How decentralized edge AI works.' },
    { title: 'What is PII?', desc: 'A checklist of sensitive individual markers.' },
    { title: 'Explain Differential Privacy', desc: 'Adding mathematical noise to preserve identity.' }
  ];

  useEffect(() => {
    setIsOffline(isGeminiOffline());
    const saved = getChatHistory();
    if (saved.length > 0) {
      setHistory(saved);
    } else {
      setHistory([
        {
          id: 'init',
          role: 'model',
          text: 'Hello! I am your interactive AI Privacy Assistant. Ask me anything about GDPR compliance, data anonymization, differential privacy, homomorphic encryption, or cybersecurity threats.',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (history.length > 1) {
      saveChatHistory(history);
    }
  }, [history]);

  const handleSend = async (messageText) => {
    if (!messageText.trim() || loading) return;

    const userMsg = messageText.trim();
    setInput('');
    
    const userMessageObj = {
      id: Date.now().toString() + '-user',
      role: 'user',
      text: userMsg,
      timestamp: new Date().toISOString()
    };
    
    const newHistory = [...history, userMessageObj];
    setHistory(newHistory);
    setLoading(true);

    try {
      // Pass clean contextual message format
      const response = await chatWithGemini(userMsg, newHistory.slice(0, -1).map(h => ({ role: h.role, text: h.text })));
      
      setHistory([
        ...newHistory,
        {
          id: Date.now().toString() + '-model',
          role: 'model',
          text: response,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (error) {
      toast.error('AI Response failed. Verify API Key settings.');
      setHistory([
        ...newHistory,
        {
          id: Date.now().toString() + '-model',
          role: 'model',
          text: 'Security Alert: Failed to process your prompt. Please ensure your Gemini API Key is saved in your Profile settings.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, msgId) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    toast.success('Message copied!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const clearHistory = () => {
    const initial = [
      {
        id: 'init',
        role: 'model',
        text: 'Platform secure: Chat logs have been permanently expunged. What privacy topic shall we analyze next?',
        timestamp: new Date().toISOString()
      }
    ];
    setHistory(initial);
    saveChatHistory(initial);
    toast.success('Secure logs cleared');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] py-2 select-none">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">AI Compliance Assistant</h1>
            {isOffline && (
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-[9px] font-black uppercase tracking-wider animate-pulse">
                Simulated
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs font-semibold mt-1">Responsible AI Guidelines Advisor</p>
        </div>
        <Button variant="ghost" onClick={clearHistory} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 py-1.5 px-3 rounded-xl border border-transparent hover:border-red-500/20 text-xs">
          <FiTrash2 size={14} className="mr-1" /> Purge Chats
        </Button>
      </div>

      {/* Main chat interface */}
      <GlassCard className="flex-1 flex flex-col overflow-hidden p-0 border border-slate-700/40 relative">
        <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-darkBg/60 to-transparent pointer-events-none z-10" />
        
        {isOffline && (
          <div className="px-6 py-2 bg-amber-500/5 border-b border-slate-800/80 flex items-center justify-between text-amber-400 text-[10px] font-semibold z-10">
            <div className="flex items-center gap-2">
              <FiInfo size={12} className="shrink-0 animate-pulse text-amber-400" />
              <span>Running in offline simulation mode. Save a Gemini API key in Settings to connect to live AI.</span>
            </div>
            <Link to="/profile" className="underline hover:text-white transition-colors">
              Configure Key
            </Link>
          </div>
        )}
        
        {/* Chat message logs */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
          {history.length <= 1 && (
            // EMPTY CHAT WELCOME STATE
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto py-8 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-2xl flex items-center justify-center text-primary mx-auto border border-primary/20 shadow-glow-primary/10">
                <FiCpu size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Interactive Knowledge Engine</h3>
                <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto mt-2">
                  Select a starter directive below or type an advanced query about federated security standards.
                </p>
              </div>

              {/* Quick Prompt Cards */}
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt.title)}
                    className="text-left p-4 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-primary/40 hover:bg-slate-900/40 transition-all duration-300 group flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-gray-200 group-hover:text-primary transition-colors">{prompt.title}</span>
                    <span className="text-[10px] text-slate-500 font-semibold mt-1.5">{prompt.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {history.length > 1 && history.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Profile Avatar */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-primary to-accent border-primary/20 shadow-primary/10' 
                  : 'bg-gradient-to-br from-secondary to-primary border-secondary/20 shadow-secondary/10'
              }`}>
                {msg.role === 'user' ? <FiUser className="text-slate-950" size={18} /> : <FiCpu className="text-white" size={18} />}
              </div>
              
              {/* Message bubble card */}
              <div className="max-w-[80%] flex flex-col gap-1.5">
                <div className={`p-4 rounded-2xl border relative group ${
                  msg.role === 'user'
                    ? 'bg-primary/5 border-primary/20 text-slate-200 rounded-tr-none'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 rounded-tl-none font-medium'
                }`}>
                  
                  {/* Markdown inner body */}
                  <div 
                    className="ai-prose text-xs leading-relaxed" 
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }} 
                  />

                  {/* Bubble copy action */}
                  {msg.role === 'model' && (
                    <button
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="absolute right-2 top-2 p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <FiCheck size={12} className="text-emerald-400" /> : <FiCopy size={12} />}
                    </button>
                  )}
                </div>

                {/* Message Timestamp */}
                <span className={`text-[9px] text-slate-500 font-semibold px-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Typing Loading Indicator */}
          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center flex-shrink-0 shadow-lg border border-secondary/20 animate-pulse">
                <FiCpu className="text-white" size={18} />
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 rounded-tl-none flex items-center gap-1.5">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-glow-primary"></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-glow-primary" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-glow-primary" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 backdrop-blur-md">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }} 
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about differential noise, GDPR erasure timelines..."
              className="flex-1 bg-slate-900/50 border border-slate-800 focus:border-primary/50 rounded-xl px-4 py-3 text-xs focus:outline-none input-glow text-gray-100 placeholder-slate-500 transition-all duration-300"
            />
            <Button type="submit" disabled={!input.trim() || loading} className="px-6 rounded-xl shadow-lg shadow-primary/20">
              <FiSend size={14} />
            </Button>
          </form>
        </div>
      </GlassCard>
    </div>
  );
};

export default Assistant;
