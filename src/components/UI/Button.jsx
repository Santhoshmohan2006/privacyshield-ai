import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const baseStyle = "relative overflow-hidden px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-darkBg";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-accent text-slate-950 hover:shadow-lg hover:shadow-primary/30 hover:glow-primary border border-primary/10",
    secondary: "bg-slate-900 hover:bg-slate-850 text-white hover:shadow-lg hover:shadow-slate-800/30 border border-slate-800/80 focus:ring-slate-700",
    outline: "border border-primary text-primary hover:bg-primary/10 hover:shadow-glow-primary/20 focus:ring-primary",
    ghost: "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/80 focus:ring-gray-500",
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {!disabled && (
        <span className="absolute inset-0 w-full h-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};

export default Button;
