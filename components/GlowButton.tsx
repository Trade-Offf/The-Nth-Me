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
  const baseClass = 'px-6 py-3 rounded-sm font-mono text-sm uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClass = variant === 'primary'
    ? 'bg-acid text-black hover:bg-acid-dim'
    : 'border border-acid/50 text-acid hover:bg-acid hover:text-black';

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${baseClass} ${variantClass} ${className}`}
    >
      {children}
    </motion.button>
  );
}

