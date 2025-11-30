'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ImageCompareSliderProps {
  /** 世界线/prompt ID，用于构建图片路径 */
  worldlineId: string;
  /** 尺寸变体：mini 用于小卡片预览，full 用于完整展示 */
  variant?: 'mini' | 'full';
  /** 自定义 className */
  className?: string;
}

/**
 * 图片对比滑动器组件
 * 统一用于 Portal 和 Showcase 页面的 Before/After 对比展示
 */
export default function ImageCompareSlider({
  worldlineId,
  variant = 'full',
  className = '',
}: ImageCompareSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const beforeSrc = `/showcase/${worldlineId}/before.webp`;
  const afterSrc = `/showcase/${worldlineId}/after.webp`;

  const isMini = variant === 'mini';

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updatePosition(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      updatePosition(e.touches[0].clientX);
    }
  };

  // 全局事件监听（支持拖动时鼠标移出容器）
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => updatePosition(e.clientX);
    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, updatePosition]);

  return (
    <div
      ref={containerRef}
      className={`
        relative w-full rounded-sm overflow-hidden cursor-ew-resize select-none
        border border-tech-border
        ${isMini ? 'aspect-square' : 'aspect-square'}
        ${className}
      `}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsDragging(false)}
    >
      {/* After 图片（底层） */}
      <div className="absolute inset-0">
        <Image src={afterSrc} alt="After" fill className="object-cover" draggable={false} />
        <div className={`
          absolute right-1 px-1.5 py-0.5 rounded-sm bg-black/70 text-acid font-mono uppercase
          ${isMini ? 'bottom-1 text-[10px]' : 'bottom-2 text-xs'}
        `}>
          After
        </div>
      </div>

      {/* Before 图片（裁剪层） */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image src={beforeSrc} alt="Before" fill className="object-cover" draggable={false} />
        <div className={`
          absolute left-1 px-1.5 py-0.5 rounded-sm bg-black/70 text-zinc-400 font-mono uppercase
          ${isMini ? 'bottom-1 text-[10px]' : 'bottom-2 text-xs'}
        `}>
          Before
        </div>
      </div>

      {/* 滑动条 */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-acid z-10 pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* 滑块手柄 */}
        <div className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          rounded-sm bg-tech-card border border-acid flex items-center justify-center
          ${isMini ? 'w-6 h-6' : 'w-8 h-8'}
        `}>
          <div className="flex gap-0">
            <ChevronLeft className={`text-acid ${isMini ? 'w-3 h-3' : 'w-4 h-4'}`} strokeWidth={1.5} />
            <ChevronRight className={`text-acid ${isMini ? 'w-3 h-3' : 'w-4 h-4'}`} strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}

