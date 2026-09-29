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
        saif: {
          bg: '#1D2028',
          'bg-sec': '#242731',
          card: '#292D36',
          elevated: '#30343E',
          accent: '#FF8A1F',
          'accent-hover': '#FF9D3D',
          'accent-dim': 'rgba(255,138,31,0.15)',
          text: '#FFFFFF',
          'text-sec': '#A9ADB7',
          muted: '#6F7480',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2.5xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      boxShadow: {
        'mume-sm': '0 2px 12px rgba(0,0,0,0.3)',
        'mume-md': '0 4px 24px rgba(0,0,0,0.4)',
        'mume-lg': '0 8px 48px rgba(0,0,0,0.5)',
        'mume-accent': '0 4px 20px rgba(255,138,31,0.35)',
        'mume-accent-lg': '0 8px 40px rgba(255,138,31,0.5)',
        'mume-glow': '0 0 30px rgba(255,138,31,0.4)',
      },
      backgroundImage: {
        'mume-gradient': 'linear-gradient(135deg, #FF8A1F, #FF9D3D)',
        'mume-radial': 'radial-gradient(circle at center, rgba(255,138,31,0.12) 0%, transparent 70%)',
        'card-gradient': 'linear-gradient(180deg, rgba(41,45,54,0.8) 0%, rgba(36,39,49,0.9) 100%)',
      },
      animation: {
        // Existing Tailwind animations kept, extend with custom
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'eq-bar-1': 'waveform 0.6s ease-in-out infinite',
        'eq-bar-2': 'waveform 0.7s ease-in-out infinite 0.1s',
        'eq-bar-3': 'waveform 0.5s ease-in-out infinite 0.2s',
        'slide-up': 'slideUpFade 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'glow-pulse': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        waveform: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        slideUpFade: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1', boxShadow: '0 0 20px rgba(255,138,31,0.8)' },
        },
      },
      backdropBlur: {
        'xs': '4px',
        '2xl': '32px',
        '3xl': '48px',
      },
      transitionTimingFunction: {
        'mume': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      transitionDuration: {
        '350': '350ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
    },
  },
  plugins: [],
}
