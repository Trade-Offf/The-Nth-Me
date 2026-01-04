'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BinaryRain from '@/components/BinaryRain';
import { useI18n } from '@/lib/i18n';

const Hero3DCanvas = dynamic(() => import('../components/Hero3DCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-tech-bg">
      <div className="font-mono text-acid text-sm">
        [<span className="animate-pulse">CALIBRATING</span>]
      </div>
    </div>
  ),
});

const heroContent = {
  'zh-CN': {
    sysStatus: '工具库在线',
    sysVersion: 'v2.0.4',
    title: '聚合 N 种黑科技',
    subtitle_gradient: '搞定图片一切需求',
    description:
      '从 AI 创作到格式转换，一站式影像工具库。集成 AI 算力与传统算法，20+ 专业工具随时待命。',
    btn_generate: '开始使用',
    btn_primary: '浏览工具库',
    btn_secondary: '购买算力 ⚡',
    stats: {
      latency: '响应速度',
      styles: '工具数量',
    },
  },
  'en-US': {
    sysStatus: 'TOOLBOX ONLINE',
    sysVersion: 'v2.0.4',
    title: 'AGGREGATE N BLACK-TECHS',
    subtitle_gradient: 'HANDLE ALL IMAGE NEEDS',
    description:
      'The Ultimate Image Meta-Toolbox. From AI creation to format conversion, 20+ professional tools integrated with AI and traditional algorithms.',
    btn_generate: 'START NOW',
    btn_primary: 'BROWSE TOOLS',
    btn_secondary: 'BUY CREDITS ⚡',
    stats: {
      latency: 'RESPONSE TIME',
      styles: 'TOOLS AVAILABLE',
    },
  },
} as const;

export default function HomePage() {
  const { lang } = useI18n();
  const hero = heroContent[lang];

  return (
    <main className="min-h-screen bg-tech-bg text-white relative flex flex-col">
      {/* 二进制雨背景 */}
      <BinaryRain />

      {/* 网格背景 */}
      <div className="fixed inset-0 tech-grid-bg opacity-50" />

      {/* 导航栏 */}
      <Navbar />

      {/* Hero 区域 */}
      <section
        className="relative w-full flex-1 flex items-center justify-center pt-20 lg:pt-0"
        style={{ minHeight: 'calc(100vh - 8rem)' }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
            {/* 左侧文案 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* 系统状态栏 */}
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-acid/30 rounded-sm bg-acid/5">
                  <span className="w-2 h-2 rounded-full bg-acid animate-pulse" />
                  <span className="font-mono text-xs text-acid uppercase tracking-[0.15em]">
                    {hero.sysStatus}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-zinc-600 tracking-wider">
                  SYS_{hero.sysVersion}
                </span>
              </div>

              <div className="space-y-3">
                <p className="font-mono text-xs text-zinc-600 uppercase tracking-[0.2em]">
                  {`// INITIALIZING META-TOOLBOX`}
                </p>

                {/* 主标题 - 英文时缩小 */}
                <h1
                  className={`font-bold text-white uppercase tracking-wide ${
                    lang === 'en-US'
                      ? 'text-2xl sm:text-3xl lg:text-4xl'
                      : 'text-3xl sm:text-4xl lg:text-5xl'
                  }`}
                >
                  {hero.title}
                </h1>

                {/* 副标题 - 酸性绿下划线效果 - 英文时缩小 */}
                <div className="relative inline-block">
                  <p
                    className={`font-bold text-acid uppercase tracking-wide ${
                      lang === 'en-US'
                        ? 'text-lg sm:text-xl lg:text-2xl'
                        : 'text-xl sm:text-2xl lg:text-3xl'
                    }`}
                  >
                    {hero.subtitle_gradient}
                  </p>
                  <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-acid via-acid/50 to-transparent" />
                </div>
              </div>

              {/* 分隔线 */}
              <div className="w-full h-px bg-gradient-to-r from-tech-border via-acid/20 to-transparent" />

              <p className="text-sm text-zinc-400 max-w-xl leading-relaxed font-light">
                {hero.description}
              </p>

              {/* 按钮组 */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
                {/* Generate 按钮 - 主要 CTA */}
                <Link
                  href="/portal"
                  className="group inline-flex items-center justify-center px-6 py-3 rounded-sm bg-acid text-black font-mono text-xs uppercase tracking-[0.15em] font-medium hover:bg-transparent hover:text-acid border border-acid transition-all duration-200"
                >
                  {hero.btn_generate}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>

                {/* Browse 按钮 - 描边 */}
                <Link
                  href="/showcase"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-sm border border-zinc-700 text-zinc-400 font-mono text-xs uppercase tracking-[0.15em] hover:border-acid hover:text-acid transition-colors duration-200"
                >
                  {hero.btn_primary}
                </Link>

                {/* Pricing 按钮 - 描边 */}
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-sm border border-zinc-700 text-zinc-400 font-mono text-xs uppercase tracking-[0.15em] hover:border-acid hover:text-acid transition-colors duration-200"
                >
                  {hero.btn_secondary}
                </Link>
              </div>

              {/* 技术指标 */}
              <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:gap-6 pt-4 border-t border-tech-border">
                <div>
                  <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.15em]">
                    {hero.stats.latency}
                  </p>
                  <p className="font-mono text-base sm:text-lg text-acid">~2.5s</p>
                </div>
                <div className="hidden sm:block w-px h-8 bg-tech-border" />
                <div>
                  <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.15em]">
                    {hero.stats.styles}
                  </p>
                  <p className="font-mono text-base sm:text-lg text-acid">20+</p>
                </div>
              </div>
            </motion.div>

            {/* 右侧 3D 机器人 - 移动端隐藏或缩小 */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] hidden sm:block"
            >
              {/* 边框容器 */}
              <div className="relative h-full border border-tech-border rounded-sm overflow-hidden bg-tech-card/50">
                {/* 顶部角标 */}
                <span className="absolute top-2 left-3 font-mono text-[10px] text-zinc-600 uppercase tracking-wider z-10">
                  [TOOLBOX_PREVIEW]
                </span>
                <span className="absolute top-2 right-3 font-mono text-[10px] text-acid/50 uppercase tracking-wider z-10">
                  LAT: 40.22
                </span>
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center w-full h-full">
                      <div className="font-mono text-acid text-sm">
                        [<span className="animate-pulse">CALIBRATING</span>]
                      </div>
                    </div>
                  }
                >
                  <Hero3DCanvas />
                </Suspense>
                {/* 底部状态栏 */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-tech-bg/80 border-t border-tech-border flex items-center px-3 justify-between z-10">
                  <span className="font-mono text-[10px] text-zinc-600 tracking-wider">
                    RENDER_ENGINE: ACTIVE
                  </span>
                  <span className="font-mono text-[10px] text-acid animate-pulse">
                    ● SIGNAL_STABLE
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
