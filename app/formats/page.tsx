'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BinaryRain from '@/components/BinaryRain';
import { useI18n } from '@/lib/i18n';
import ToolCard from '@/components/formats/ToolCard';
import ToolModal from '@/components/formats/ToolModal';

export type ToolType = 'webp' | 'compress' | 'heic' | 'pdf2img' | 'img2pdf' | 'video2gif' | 'ico';

const toolOrder: ToolType[] = ['webp', 'compress', 'heic', 'pdf2img', 'img2pdf', 'video2gif', 'ico'];

export default function FormatsPage() {
  const { t, lang } = useI18n();
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);

  const handleToolClick = (toolId: ToolType) => {
    setSelectedTool(toolId);
  };

  const handleCloseModal = () => {
    setSelectedTool(null);
  };

  return (
    <main className="min-h-screen bg-tech-bg text-white relative flex flex-col">
      {/* 二进制雨背景 */}
      <BinaryRain />

      {/* 网格背景 */}
      <div className="fixed inset-0 tech-grid-bg opacity-50" />

      {/* 导航栏 */}
      <Navbar />

      {/* 主内容区 */}
      <section className="relative flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* 页面标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-acid/30 rounded-sm bg-acid/5">
                <span className="w-2 h-2 rounded-full bg-acid animate-pulse" />
                <span className="font-mono text-xs text-acid uppercase tracking-[0.15em]">
                  {t.formats.badge}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-purple-500/30 rounded-sm bg-purple-500/5">
                <svg className="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="font-mono text-xs text-purple-400 uppercase tracking-[0.15em]">
                  {lang === 'zh-CN' ? '无需登录 · 免费使用' : 'NO LOGIN · FREE'}
                </span>
              </div>
            </div>

            {/* 标题 */}
            <div className="space-y-3">
              <h1
                className={`font-bold uppercase tracking-wide ${
                  lang === 'en-US'
                    ? 'text-3xl sm:text-4xl lg:text-5xl'
                    : 'text-4xl sm:text-5xl lg:text-6xl'
                }`}
              >
                <span className="text-white">{t.formats.title} </span>
                <span className="text-acid">{t.formats.titleHighlight}</span>
              </h1>

              {/* 分隔线 */}
              <div className="w-full h-px bg-gradient-to-r from-acid via-acid/50 to-transparent" />

              {/* 描述 */}
              <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed font-light">
                {t.formats.description.replace('{count}', toolOrder.length.toString())}
              </p>
            </div>
          </motion.div>

          {/* 工具卡片网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {toolOrder.map((toolId, index) => (
              <ToolCard
                key={toolId}
                toolId={toolId}
                index={index}
                onClick={() => handleToolClick(toolId)}
              />
            ))}
          </div>

          {/* 底部提示 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="font-mono text-xs text-zinc-600 uppercase tracking-wider">
              {lang === 'zh-CN'
                ? '// 所有转换均在浏览器本地完成，文件不会上传到服务器'
                : '// ALL CONVERSIONS ARE PROCESSED LOCALLY IN YOUR BROWSER'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* 工具弹窗 */}
      {selectedTool && (
        <ToolModal toolId={selectedTool} onClose={handleCloseModal} />
      )}
    </main>
  );
}

