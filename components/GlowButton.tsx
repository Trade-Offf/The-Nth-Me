'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export default function GlowButton({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  disabled = false,
  type = 'button'
}: GlowButtonProps) {
  const baseClass = 'px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClass = variant === 'primary' 
    ? 'cosmic-gradient text-white shadow-lg shadow-cosmic-purple/50 hover:shadow-xl hover:shadow-cosmic-purple/70 hover:scale-105'
    : 'glass-card text-white hover:bg-white/10 hover:scale-105';

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${baseClass} ${variantClass} ${className}`}
    >
      {children}
    </motion.button>
  );
}

