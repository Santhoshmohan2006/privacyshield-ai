import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', animate = true, delay = 0, hoverGlow = true, onClick }) => {
  const hoverStyles = hoverGlow 
    ? 'hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-glow-primary dark:hover:border-primary/30' 
    : 'hover:-translate-y-1';

  const content = (
    <div 
      onClick={onClick}
      className={`glass dark:glass-dark rounded-2xl p-6 transition-all duration-300 border border-white/10 dark:border-slate-700/30 ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default GlassCard;
