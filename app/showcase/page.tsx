'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Tag,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import TechCard from '@/components/TechCard';
import Navbar from '@/components/Navbar';
import BinaryRain from '@/components/BinaryRain';
import ImageCompareSlider from '@/components/ImageCompareSlider';
import { useI18n } from '@/lib/i18n';
import {
  prompts,
  buildFullPrompt,
  type PromptConfig,
} from '@/lib/prompts';

const ITEMS_PER_PAGE = 6;

/**
 * 获取所有唯一的主分类 Tags（每个 prompt 的第一个 tag）
 */
function getPrimaryTags(): string[] {
  const tagSet = new Set<string>();
  prompts.forEach((p) => {
    if (p.tags.length > 0) {
      tagSet.add(p.tags[0]);
    }
  });
  return Array.from(tagSet);
}

/**
 * 单个 Prompt 卡片组件
 * - 效果图默认显示
 * - 展开按钮控制 Prompt 内容显示
 * - 复制按钮直接复制完整 Prompt
 */
function PromptCard({ prompt, index, localizedName, tagTranslations, showcaseT }: {
  prompt: PromptConfig;
  index: number;
  localizedName: string;
  tagTranslations: Record<string, string>;
  showcaseT: {
    signalStrength: string;
    expand: string;
    collapse: string;
    copyPrompt: string;
    copySuccess: string;
  };
}) {
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const fullPrompt = buildFullPrompt(prompt);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <h3 className="text-base font-mono font-medium text-white truncate">{localizedName}</h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {prompt.tags.map((tag, tagIndex) => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider ${
                    tagIndex === 0
                      ? 'bg-acid/10 text-acid border border-acid/30'
                      : 'bg-zinc-800/50 text-zinc-500 border border-zinc-700/50'
                  }`}
                >
                  {tagTranslations[tag] ?? tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 图片展示 - 根据 showCompare 决定显示对比滑块还是单张图 */}
        {prompt.showCompare !== false ? (
          <ImageCompareSlider worldlineId={prompt.id} variant="full" />
        ) : (
          <div className="relative w-full aspect-square rounded-sm overflow-hidden border border-tech-border">
            <Image
              src={`/showcase/${prompt.id}/after.webp`}
              alt={localizedName}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* 按钮组 */}
        <div className="mt-4 flex gap-3">
          {/* 展开/收起按钮 */}
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm
                       bg-transparent border border-tech-border
                       text-zinc-500 hover:text-acid hover:border-acid/50 transition-all duration-200"
          >
            {showPrompt ? (
              <ChevronUp className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
            )}
            <span className="text-xs font-mono uppercase">{showPrompt ? showcaseT.collapse : showcaseT.expand}</span>
          </button>

          {/* 复制 Prompt 按钮 */}
          <button
            onClick={handleCopy}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm
                       font-mono text-xs uppercase tracking-wider font-medium
                       border-2 transition-all duration-200
                       ${copied
                         ? 'bg-acid/20 text-acid border-acid/50'
                         : 'bg-acid text-black border-acid hover:bg-transparent hover:text-acid'
                       }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" strokeWidth={1.5} />
                <span>{showcaseT.copySuccess}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" strokeWidth={1.5} />
                <span>{showcaseT.copyPrompt}</span>
              </>
            )}
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
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono mb-3">
                  <span>{showcaseT.signalStrength}: {prompt.sampleStrength}</span>
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

  // 只获取主分类 Tags（每个 prompt 的第一个 tag，去重）
  const primaryTags = useMemo(() => getPrimaryTags(), []);

  // 过滤后的 prompts - 只按主分类（第一个 tag）筛选
  const filteredPrompts = useMemo(() => {
    if (!selectedTag) return prompts;
    return prompts.filter((p) => p.tags[0] === selectedTag);
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
      {/* 二进制雨背景 */}
      <BinaryRain />

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
            {`// ${t.showcase.description.replace('{count}', String(prompts.length))}`}
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
            {primaryTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-all ${
                  selectedTag === tag
                    ? 'bg-acid text-black border border-acid'
                    : 'bg-transparent text-zinc-500 border border-tech-border hover:border-acid/50 hover:text-acid'
                }`}
              >
                {t.tags[tag as keyof typeof t.tags] ?? tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence mode="popLayout">
            {paginatedPrompts.map((prompt, index) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                index={index}
                localizedName={t.worldlines[prompt.id as keyof typeof t.worldlines]?.name ?? prompt.name}
                tagTranslations={t.tags}
                showcaseT={t.showcase}
              />
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

