import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export default function GlassCard({ children, className = '', hover = false, glow = false }: GlassCardProps) {
  const baseClass = hover ? 'glass-card-hover' : 'glass-card';
  const glowClass = glow ? 'glow-border' : '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${baseClass} ${glowClass} ${className}`}
    >
      {children}
    </motion.div>
  );
}

