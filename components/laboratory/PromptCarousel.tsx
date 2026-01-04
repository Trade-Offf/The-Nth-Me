'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { prompts } from '@/lib/prompts';
import { useI18n } from '@/lib/i18n';

interface PromptCarouselProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function PromptCarousel({ onSelectPrompt }: PromptCarouselProps) {
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  // 直接使用所有提示词数据
  const allPrompts = prompts.map((promptConfig) => ({
    id: promptConfig.id,
    name: t.worldlines[promptConfig.id as keyof typeof t.worldlines]?.name || promptConfig.name,
    imageUrl: `/showcase/${promptConfig.id}/after.webp`,
    prompt: promptConfig.prompt,
  }));

  const totalPages = Math.ceil(allPrompts.length / itemsPerPage);
  const currentItems = allPrompts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <div className="relative w-full py-4 px-12">
      {/* 左箭头 */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-tech-card border border-tech-border rounded-sm hover:border-acid hover:bg-acid/10 transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5 text-acid" strokeWidth={2} />
      </button>

      {/* 卡片容器 */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-5 gap-3"
          >
            {currentItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectPrompt(item.prompt)}
                className="group relative aspect-square overflow-hidden rounded-lg border-2 border-tech-border hover:border-acid transition-all duration-300 hover:shadow-[0_0_12px_rgba(204,255,0,0.3)]"
              >
                {/* 背景图 */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = '/logo.svg';
                  }}
                />

                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* 标题 */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black via-black/90 to-transparent">
                  <p className="font-mono text-xs text-white line-clamp-2 leading-tight">
                    {item.name}
                  </p>
                </div>

                {/* Hover 指示器 */}
                <div className="absolute top-2 right-2 w-6 h-6 bg-acid rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 右箭头 */}
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-tech-card border border-tech-border rounded-sm hover:border-acid hover:bg-acid/10 transition-colors"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5 text-acid" strokeWidth={2} />
      </button>

      {/* 页码指示器 */}
      <div className="flex justify-center gap-2 mt-3">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentPage
                ? 'bg-acid w-8'
                : 'bg-tech-border hover:bg-zinc-600'
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

