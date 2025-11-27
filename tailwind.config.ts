import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy colors (保留兼容)
        cosmic: {
          black: '#0a0a0f',
          midnight: '#0f0f1e',
          purple: '#8b5cf6',
          teal: '#14b8a6',
          gold: '#fbbf24',
          pink: '#ec4899',
        },
        // New Electric Green theme
        acid: {
          DEFAULT: '#CCFF00',
          dim: '#9ECC00',
          glow: 'rgba(204, 255, 0, 0.15)',
        },
        tech: {
          bg: '#050505',
          card: '#0A0A0A',
          border: '#27272a',
          'border-light': '#3f3f46',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        headingCn: ['"LXGW WenKai GB"', 'system-ui', 'sans-serif'],
        headingEn: ['"Great Vibes"', 'cursive'],
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(ellipse at top, #1e1b4b 0%, #0a0a0f 50%)',
        'glow-purple': 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        'glow-teal': 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'glitch': 'glitch 0.3s ease-in-out',
        'blink': 'blink 1s step-end infinite',
        'scanline': 'scanline 8s linear infinite',
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '33%': { transform: 'translate(-2px, 2px)' },
          '66%': { transform: 'translate(2px, -2px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

