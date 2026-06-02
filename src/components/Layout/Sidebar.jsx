import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiMessageSquare, FiBookOpen, FiShield, FiFileText, FiPieChart, FiUser, FiCompass, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ open, setOpen }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome size={20} /> },
    { name: 'AI Assistant', path: '/assistant', icon: <FiMessageSquare size={20} /> },
    { name: 'Learning Quiz', path: '/quiz', icon: <FiBookOpen size={20} /> },
    { name: 'Risk Analyzer', path: '/analyzer', icon: <FiShield size={20} /> },
    { name: 'Compliance Check', path: '/compliance', icon: <FiFileText size={20} /> },
    { name: 'Interactive Scenarios', path: '/scenarios', icon: <FiCompass size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <FiPieChart size={20} /> },
    { name: 'Profile', path: '/profile', icon: <FiUser size={20} /> },
  ];

  const sidebarContent = (
    <div className="w-64 h-full glass-dark border-r border-slate-700/50 flex flex-col z-30 relative select-none">
      <div className="p-6 flex items-center justify-between border-b border-slate-800/40">
        <div>
          <h1 className="text-2xl font-black text-gradient tracking-tight">PrivacyShield</h1>
          <p className="text-[10px] uppercase font-bold tracking-widest text-primary/80 mt-1">Responsible AI</p>
        </div>
        <button 
          onClick={() => setOpen(false)} 
          className="md:hidden p-1.5 rounded-lg hover:bg-slate-800 text-gray-400 hover:text-white transition-colors"
        >
          <FiX size={18} />
        </button>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-1.5 overflow-y-auto custom-scroll">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `relative group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-primary/10 to-accent/5 text-primary border border-primary/20 glow-primary' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="activePill" 
                    className="absolute left-0 w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-r-md"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {item.icon}
                </span>
                <span className="font-semibold text-sm tracking-wide">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800/80 flex flex-col gap-2">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/50">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secured Session</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-2">
          <span>v2.0.0-Beta</span>
          <span>Shield Active</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            {/* Sidebar drawer container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 h-full w-64 z-50 md:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
