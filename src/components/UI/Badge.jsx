import React from 'react';
import { motion } from 'framer-motion';

const Badge = ({ text, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary/20 text-primary border-primary/30',
    secondary: 'bg-secondary/20 text-secondary border-secondary/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <motion.span 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-3 py-1 text-xs font-semibold rounded-full border ${colors[color]} backdrop-blur-md`}
    >
      {text}
    </motion.span>
  );
};

export default Badge;
