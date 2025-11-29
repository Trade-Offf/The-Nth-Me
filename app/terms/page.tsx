'use client';

/**
 * 服务条款页面
 */

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useI18n } from '@/lib/i18n';

export default function TermsPage() {
  const { t } = useI18n();

  const sections = [
    'intro',
    'usage',
    'payment',
    'privacy',
    'intellectual',
    'disclaimer',
    'changes',
  ] as const;

  return (
    <main className="min-h-screen bg-tech-bg text-white flex flex-col">
      {/* 网格背景 */}
      <div className="fixed inset-0 tech-grid-bg opacity-20" />

      {/* 导航栏 */}
      <Navbar />

      {/* 内容区 */}
      <div className="flex-1 relative z-10 max-w-3xl mx-auto px-6 pt-24 pb-20">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.terms.title}
          </h1>
          <p className="text-zinc-500 text-sm font-mono">
            {t.terms.lastUpdated}: 2025-11-30
          </p>
        </motion.div>

        {/* 条款内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {sections.map((key) => {
            const section = t.terms.sections[key];
            return (
              <section key={key} className="border-l-2 border-acid/30 pl-6">
                <h2 className="text-lg font-bold text-white mb-3">
                  {section.title}
                </h2>
                <p className="text-zinc-400 leading-relaxed">
                  {section.content}
                </p>
              </section>
            );
          })}
        </motion.div>

        {/* 联系方式 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 p-6 bg-tech-card border border-tech-border rounded-sm"
        >
          <p className="text-zinc-400 text-sm">
            如有疑问，请联系：
            <a
              href="mailto:surgethisworld@gmail.com"
              className="text-acid hover:underline ml-1"
            >
              surgethisworld@gmail.com
            </a>
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}

