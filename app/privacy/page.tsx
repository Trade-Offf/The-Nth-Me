'use client';

/**
 * 隐私政策页面
 */

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useI18n } from '@/lib/i18n';

export default function PrivacyPage() {
  const { t } = useI18n();

  const sections = [
    'collection',
    'usage',
    'photos',
    'security',
    'cookies',
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
            {t.privacy.title}
          </h1>
          <p className="text-zinc-500 text-sm font-mono">
            {t.privacy.lastUpdated}: 2025-11-30
          </p>
        </motion.div>

        {/* 隐私政策内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {sections.map((key) => {
            const section = t.privacy.sections[key];
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

          {/* 联系我们 - 特殊处理，需要加邮箱链接 */}
          <section className="border-l-2 border-acid/30 pl-6">
            <h2 className="text-lg font-bold text-white mb-3">
              {t.privacy.sections.contact.title}
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              {t.privacy.sections.contact.content}
              <a href="mailto:surgethisworld@gmail.com" className="text-acid hover:underline ml-1">
                surgethisworld@gmail.com
              </a>
            </p>
          </section>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}

