import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, className = '', as = 'input', rows = 3 }) => {
  const Component = as;
  
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-sm font-semibold text-slate-300 transition-colors duration-300 hover:text-primary">{label}</label>}
      <Component
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={as === 'textarea' ? rows : undefined}
        className="px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 focus:outline-none focus:border-primary/50 input-glow transition-all duration-300 text-gray-100 placeholder-slate-500 custom-scroll"
      />
    </div>
  );
};

export default Input;
