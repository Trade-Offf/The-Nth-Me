import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  variant?: 'glass' | 'tech'; // 新增：支持两种风格
  corners?: boolean; // Tech 风格的角标
}

export default function GlassCard({
  children,
  className = '',
  hover = false,
  glow = false,
  variant = 'tech', // 默认使用新的 Tech 风格
  corners = true,
}: GlassCardProps) {
  // Tech 风格
  if (variant === 'tech') {
    const hoverClass = hover ? 'hover:border-acid/50 hover:bg-acid-glow' : '';
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative bg-tech-card border border-tech-border rounded-sm transition-all duration-200 ${hoverClass} ${className}`}
      >
        {/* 角标装饰 */}
        {corners && (
          <>
            <span className="absolute -top-px -left-px text-zinc-700 text-[10px] font-mono select-none">[</span>
            <span className="absolute -top-px -right-px text-zinc-700 text-[10px] font-mono select-none">]</span>
            <span className="absolute -bottom-px -left-px text-zinc-700 text-[10px] font-mono select-none">[</span>
            <span className="absolute -bottom-px -right-px text-zinc-700 text-[10px] font-mono select-none">]</span>
          </>
        )}
        {children}
      </motion.div>
    );
  }

  // Legacy Glass 风格
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

