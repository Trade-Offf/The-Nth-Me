'use client';

/**
 * TechCard - Electric Green 风格卡片组件
 * 替代原来的 GlassCard，提供锐利边框和角标装饰
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface TechCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  corners?: boolean; // 是否显示角标装饰
}

export default function TechCard({
  children,
  className,
  hover = false,
  corners = true,
}: TechCardProps) {
  return (
    <div
      className={cn(
        'relative bg-tech-card border border-tech-border rounded-sm',
        hover && 'transition-all duration-200 hover:border-acid/50 hover:bg-acid-glow',
        className
      )}
    >
      {/* 角标装饰 */}
      {corners && (
        <>
          <span className="absolute -top-px -left-px text-zinc-700 text-[10px] font-mono select-none">
            [
          </span>
          <span className="absolute -top-px -right-px text-zinc-700 text-[10px] font-mono select-none">
            ]
          </span>
          <span className="absolute -bottom-px -left-px text-zinc-700 text-[10px] font-mono select-none">
            [
          </span>
          <span className="absolute -bottom-px -right-px text-zinc-700 text-[10px] font-mono select-none">
            ]
          </span>
        </>
      )}
      {children}
    </div>
  );
}

