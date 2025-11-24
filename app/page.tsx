'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Github, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero3DCanvas = dynamic(() => import('../components/Hero3DCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-[#020204]">
      <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const content = {
  'zh-CN': {
    navbar: {
      brand: '第 N 个我',
      gallery: '时空画廊',
      prompts: '预设剧本',
      pricing: '获取算力',
      about: '关于模型',
    },
    hero: {
      title: '遇见',
      subtitle_gradient: '不同时间线上的第 N 个我',
      description:
        '由 Nano Banana 模型驱动的多时间线影像引擎。无需复杂指令，只需上传一张照片，我们精心预设的 Prompt 剧本会自动在不同时间线展开，为你在无数平行宇宙中生成一个又一个“第 N 个我”——从赛博朋克都市，到魔法中世纪，再到星际舰队旗舰之桥。',
      btn_primary: '生成第 N 个我',
      btn_secondary: '为引擎加注能量',
    },
  },
  'en-US': {
    navbar: {
      brand: 'The Nth Me',
      gallery: 'Gallery',
      prompts: 'Scenarios',
      pricing: 'Compute Power',
      about: 'Model Info',
    },
    hero: {
      title: 'Encounter',
      subtitle_gradient: 'The N-th Me Across Parallel Universes',
      description:
        'A multi-timeline portrait engine powered by the Nano Banana model. Upload a single photo, and our carefully crafted scenario prompts will branch your likeness across countless parallel universes—from neon-soaked megacities, to arcane medieval realms, to the command deck of an interstellar fleet.',
      btn_primary: 'Generate The Nth Me',
      btn_secondary: 'Fuel the Engine',
    },
  },
} as const;

const navbarItems = ['gallery', 'prompts', 'pricing', 'about'] as const;

type Lang = keyof typeof content;
type NavbarKey = (typeof navbarItems)[number];

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('zh-CN');
  const t = content[lang];

  return (
    <main className="h-screen bg-[#020204] text-white overflow-hidden">
      {/* 顶部细渐变线 */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

      {/* 导航栏 */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-b from-[#020204] via-[#020204]/95 to-transparent border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* 品牌 */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-indigo-500 shadow-[0_0_30px_rgba(192,132,252,0.8)]" />
            <div className="leading-tight">
              <div
                className={
                  lang === 'zh-CN'
                    ? 'text-lg tracking-[0.2em] font-headingCn'
                    : 'text-lg tracking-[0.15em] font-headingEn'
                }
              >
                {t.navbar.brand}
              </div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                Nano Banana · Multi-Timeline Engine
              </div>
            </div>
          </Link>

          {/* 菜单 + 语言切换 */}
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-6 text-xs text-white/60">
              {navbarItems.map((key) => (
                <button
                  key={key}
                  type="button"
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>{t.navbar[key as NavbarKey]}</span>
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setLang(lang === 'zh-CN' ? 'en-US' : 'zh-CN')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Language"
              >
                <Globe className="w-5 h-5" />
              </button>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden sm:inline-flex"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero 区域 */}
      <section className="relative h-full w-full pt-20">
        {/* 中央紫色径向光晕 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.18)_0%,_transparent_70%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full">
          <div className="grid lg:grid-cols-2 gap-10 items-center h-full">
            {/* 左侧文案 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1
                  className={
                    lang === 'zh-CN'
                      ? 'text-4xl sm:text-5xl lg:text-6xl font-headingCn tracking-[0.15em]'
                      : 'text-4xl sm:text-5xl lg:text-6xl font-headingEn tracking-[0.12em]'
                  }
                >
                  {t.hero.title}
                </h1>

                <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold bg-gradient-to-r from-purple-400 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent">
                  {t.hero.subtitle_gradient}
                </p>
              </div>

              <p className="text-sm sm:text-base text-white/65 max-w-xl leading-relaxed">
                {t.hero.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/portal"
                  className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 text-sm font-medium shadow-[0_0_25px_rgba(192,132,252,0.75)] hover:shadow-[0_0_40px_rgba(192,132,252,0.95)] transition-shadow"
                >
                  {t.hero.btn_primary}
                </Link>

                <button
                  type="button"
                  className="inline-flex items-center px-5 py-2.5 rounded-full border border-white/15 bg-white/5 text-sm text-white/80 hover:bg-white/10 transition-colors"
                >
                  {t.hero.btn_secondary}
                </button>
              </div>
            </motion.div>

            {/* 右侧 3D 机器人 */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative h-[320px] sm:h-[380px] md:h-[420px] lg:h-[460px]"
            >
              {/* 背景透明，不再单独加高亮阴影卡片 */}
              <div className="relative h-full rounded-[32px] overflow-hidden">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center w-full h-full bg-transparent">
                      <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  }
                >
                  <Hero3DCanvas />
                </Suspense>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
