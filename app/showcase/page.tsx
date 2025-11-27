'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Tag,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Wand2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import TechCard from '@/components/TechCard';
import Navbar from '@/components/Navbar';
import { useI18n } from '@/lib/i18n';
import {
  prompts,
  getAllTags,
  buildFullPrompt,
  type PromptConfig,
} from '@/lib/prompts';

const ITEMS_PER_PAGE = 6;

/**
 * 滑动对比器组件
 * 支持鼠标离开容器后继续拖动（只要不松开鼠标）
 */
function ImageCompareSlider({ promptId }: { promptId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const beforeSrc = `/showcase/${promptId}/before.png`;
  const afterSrc = `/showcase/${promptId}/after.png`;

  // 计算滑块位置
  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  // 鼠标按下开始拖动
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  // 触摸开始
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updatePosition(e.touches[0].clientX);
  };

  // 全局鼠标事件监听（解决鼠标离开容器后拖动丢失的问题）
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // 在 document 级别监听，这样鼠标移出容器也能继续拖动
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, updatePosition]);

  // 触摸移动
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      updatePosition(e.touches[0].clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square rounded-sm overflow-hidden cursor-ew-resize select-none border border-tech-border"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsDragging(false)}
    >
      {/* After 图片（底层） */}
      <div className="absolute inset-0">
        <Image
          src={afterSrc}
          alt="After"
          fill
          className="object-cover"
          draggable={false}
        />
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-sm bg-black/70 text-[10px] text-acid font-mono uppercase">
          After
        </div>
      </div>

      {/* Before 图片（裁剪层） */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt="Before"
          fill
          className="object-cover"
          draggable={false}
        />
        <div className="absolute bottom-2 left-2 px-2 py-1 rounded-sm bg-black/70 text-[10px] text-zinc-400 font-mono uppercase">
          Before
        </div>
      </div>

      {/* 滑动条 */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-acid z-10 pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* 滑块手柄 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-8 h-8 rounded-sm bg-tech-card border border-acid
                     flex items-center justify-center"
        >
          <div className="flex gap-0">
            <ChevronLeft className="w-3 h-3 text-acid" strokeWidth={1.5} />
            <ChevronRight className="w-3 h-3 text-acid" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 单个 Prompt 卡片组件
 * - 效果图默认显示
 * - 展开按钮只控制 Prompt 内容
 * - 去生成按钮跳转到上传页
 */
function PromptCard({ prompt, index }: { prompt: PromptConfig; index: number }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const fullPrompt = buildFullPrompt(prompt);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = () => {
    // 存储选中的风格ID到sessionStorage
    sessionStorage.setItem('selectedWorldline', prompt.id);
    // 跳转到上传页
    router.push('/portal');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        layout: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        y: { duration: 0.3, delay: index * 0.05 },
      }}
    >
      <TechCard className="p-5 flex flex-col overflow-hidden" hover>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-mono font-medium text-white truncate">{prompt.name}</h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {prompt.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider bg-acid/10 text-acid border border-acid/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 图片对比器 - 始终显示 */}
        <ImageCompareSlider promptId={prompt.id} />

        {/* 按钮组 */}
        <div className="mt-4 flex gap-3">
          {/* Prompt 展开/收起按钮 */}
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm
                       bg-transparent border border-tech-border
                       text-zinc-500 hover:text-acid hover:border-acid/50 transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-xs font-mono uppercase">{showPrompt ? '收起' : '时空剧本'}</span>
            {showPrompt ? (
              <ChevronUp className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
            )}
          </button>

          {/* 去生成按钮 */}
          <button
            onClick={handleGenerate}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm
                       bg-acid text-black font-mono text-xs uppercase tracking-wider font-medium
                       border-2 border-acid
                       hover:bg-transparent hover:text-acid
                       transition-all duration-200"
          >
            <Wand2 className="w-4 h-4" strokeWidth={1.5} />
            <span>建立纠缠</span>
          </button>
        </div>

        {/* Prompt 内容 - 可展开 */}
        <AnimatePresence initial={false}>
          {showPrompt && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { type: 'spring', stiffness: 500, damping: 40 },
                opacity: { duration: 0.2 },
              }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="mt-3 p-4 rounded-sm bg-tech-bg border border-tech-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                    <span>信号强度: {prompt.sampleStrength}</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm
                             border border-tech-border hover:border-acid/50 transition-colors text-xs font-mono"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-acid" strokeWidth={1.5} />
                        <span className="text-acid">已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
                        <span className="text-zinc-500">复制</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-zinc-400 font-mono leading-relaxed break-all">
                  {fullPrompt}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </TechCard>
    </motion.div>
  );
}

export default function ShowcasePage() {
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => getAllTags(), []);

  // 过滤后的 prompts
  const filteredPrompts = useMemo(() => {
    if (!selectedTag) return prompts;
    return prompts.filter((p) => p.tags.includes(selectedTag));
  }, [selectedTag]);

  // 分页
  const totalPages = Math.ceil(filteredPrompts.length / ITEMS_PER_PAGE);
  const paginatedPrompts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPrompts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPrompts, currentPage]);

  // 切换标签时重置页码
  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-tech-bg relative">
      {/* 网格背景 */}
      <div className="fixed inset-0 tech-grid-bg opacity-30" />

      {/* 导航栏 */}
      <Navbar />

      <div className="max-w-7xl mx-auto relative z-10 px-4 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* 标题区域 */}
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white uppercase tracking-wide">
            {t.showcase.title} <span className="text-acid">{t.showcase.titleHighlight}</span>
          </h1>
          <p className="text-zinc-500 font-mono text-sm tracking-wider mb-4">
            // {t.showcase.description.replace('{count}', String(prompts.length))}
          </p>

          {/* 状态标签 */}
          <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-acid/30 rounded-sm bg-acid/5">
            <span className="w-2 h-2 rounded-full bg-acid animate-pulse" />
            <span className="font-mono text-xs text-acid uppercase tracking-[0.15em]">
              {t.showcase.badge}
            </span>
          </div>
        </motion.div>

        {/* Tags Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-zinc-600" strokeWidth={1.5} />
            <span className="text-zinc-600 text-xs font-mono uppercase tracking-wider">{t.showcase.filterByTag}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTagSelect(null)}
              className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-all ${
                !selectedTag
                  ? 'bg-acid text-black border border-acid'
                  : 'bg-transparent text-zinc-500 border border-tech-border hover:border-acid/50 hover:text-acid'
              }`}
            >
              {t.showcase.allTags}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-all ${
                  selectedTag === tag
                    ? 'bg-acid text-black border border-acid'
                    : 'bg-transparent text-zinc-500 border border-tech-border hover:border-acid/50 hover:text-acid'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence mode="popLayout">
            {paginatedPrompts.map((prompt, index) => (
              <PromptCard key={prompt.id} prompt={prompt} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-4"
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-sm border border-tech-border hover:border-acid/50 hover:text-acid disabled:opacity-30
                       disabled:cursor-not-allowed transition-all text-zinc-500"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-sm text-xs font-mono font-medium transition-all ${
                    currentPage === page
                      ? 'bg-acid text-black border border-acid'
                      : 'bg-transparent text-zinc-500 border border-tech-border hover:border-acid/50 hover:text-acid'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-sm border border-tech-border hover:border-acid/50 hover:text-acid disabled:opacity-30
                       disabled:cursor-not-allowed transition-all text-zinc-500"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}

