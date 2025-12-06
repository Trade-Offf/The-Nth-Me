'use client';

/**
 * 退款政策页面
 * Refund Policy - Paddle 审核必需
 */

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useI18n } from '@/lib/i18n';

export default function RefundPage() {
  const { t } = useI18n();

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
            {t.refund.title}
          </h1>
          <p className="text-zinc-500 text-sm font-mono">
            {t.refund.lastUpdated}: 2025-12-06
          </p>
        </motion.div>

        {/* 内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {/* 简介 */}
          <p className="text-zinc-400 leading-relaxed">
            {t.refund.intro}
          </p>

          {/* 14天退款保证 */}
          <section className="border-l-2 border-acid/30 pl-6">
            <h2 className="text-lg font-bold text-white mb-3">
              {t.refund.sections.guarantee.title}
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              {t.refund.sections.guarantee.content}
            </p>
          </section>

          {/* 如何申请退款 */}
          <section className="border-l-2 border-acid/30 pl-6">
            <h2 className="text-lg font-bold text-white mb-3">
              {t.refund.sections.howTo.title}
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              {t.refund.sections.howTo.content}
            </p>
          </section>

          {/* 例外情况 */}
          <section className="border-l-2 border-acid/30 pl-6">
            <h2 className="text-lg font-bold text-white mb-3">
              {t.refund.sections.exceptions.title}
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              {t.refund.sections.exceptions.content}
            </p>
          </section>
        </motion.div>

        {/* 联系方式 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 p-6 bg-tech-card border border-tech-border rounded-sm"
        >
          <p className="text-zinc-400 text-sm">
            {t.refund.contactNote}
            <a
              href={`mailto:${t.refund.contactEmail}`}
              className="text-acid hover:underline ml-1"
            >
              {t.refund.contactEmail}
            </a>
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}

