/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#1b1d0e',
        darkCard: 'rgba(65, 67, 27, 0.75)',
        darkSurface: 'rgba(41, 43, 27, 0.9)',
        primary: '#aeb784',
        primaryDark: '#8d9665',
        secondary: '#e3dbbb',
        secondaryDark: '#c2ba99',
        accent: '#f8f3e1',
        success: '#aeb784',
        warning: '#e3dbbb',
        danger: '#ef4444',
        info: '#aeb784',
        neonCyan: '#aeb784',
        neonPurple: '#e3dbbb',
        slate: {
          50: '#f8f3e1',
          100: '#f1ebd5',
          200: '#e3dbbb',
          300: '#d5cdad',
          400: '#c3bb99',
          500: '#aeb784',
          600: '#8e9766',
          700: '#41431b',
          850: '#2d2f13',
          800: '#22230e',
          900: '#1c1e0f',
          950: '#0f1007',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
      animation: {
        'gradient-x': 'gradient-x 4s ease infinite',
        'gradient-y': 'gradient-y 4s ease infinite',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 7s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.4s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'spin-slow': 'spin 6s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ripple': 'ripple 0.6s ease-out',
        'typewriter': 'typewriter 3s steps(30) forwards',
        'blink': 'blink 1s step-end infinite',
        'orbit': 'orbit 8s linear infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'draw': 'draw 2s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out',
        'count-up': 'count-up 1.5s ease-out',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'confetti': 'confetti 0.8s ease-out forwards',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        'gradient-y': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'center top' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'center bottom' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'bounce-in': {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
          '70%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'ripple': {
          '0%': { transform: 'scale(0)', opacity: '0.6' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg) translateX(80px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(80px) rotate(-360deg)' },
        },
        'neon-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 20px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 60px currentColor, 0 0 100px currentColor' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'confetti': {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(720deg)', opacity: '0' },
        },
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(174, 183, 132, 0.4)',
        'glow-secondary': '0 0 20px rgba(227, 219, 187, 0.4)',
        'glow-success': '0 0 20px rgba(174, 183, 132, 0.4)',
        'glow-danger': '0 0 20px rgba(239, 68, 68, 0.4)',
        'glow-warning': '0 0 20px rgba(227, 219, 187, 0.4)',
        'neon-primary': '0 0 5px #aeb784, 0 0 20px #aeb784, 0 0 40px #aeb784',
        'neon-purple': '0 0 5px #e3dbbb, 0 0 20px #e3dbbb, 0 0 40px #e3dbbb',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.5)',
        'inner-glow': 'inset 0 0 30px rgba(174, 183, 132, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
        '3xl': '64px',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
