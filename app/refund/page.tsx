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
            {t.refund.lastUpdated}: 2025-11-30
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

          {/* 退款资格 */}
          <section className="border-l-2 border-acid/30 pl-6">
            <h2 className="text-lg font-bold text-white mb-3">
              {t.refund.sections.eligibility.title}
            </h2>
            <ul className="text-zinc-400 leading-relaxed space-y-2 list-disc list-inside">
              <li>{t.refund.sections.eligibility.timeLimit}</li>
              <li>{t.refund.sections.eligibility.creditUsage}</li>
            </ul>
          </section>

          {/* 如何申请退款 */}
          <section className="border-l-2 border-acid/30 pl-6">
            <h2 className="text-lg font-bold text-white mb-3">
              {t.refund.sections.howTo.title}
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-3">
              {t.refund.sections.howTo.intro}
            </p>
            <ol className="text-zinc-400 leading-relaxed space-y-2 list-decimal list-inside">
              <li>
                {t.refund.sections.howTo.contact}{' '}
                <a href="mailto:surgethisworld@gmail.com" className="text-acid hover:underline">
                  surgethisworld@gmail.com
                </a>
              </li>
              <li>{t.refund.sections.howTo.details}</li>
              <li>{t.refund.sections.howTo.submit}</li>
            </ol>
          </section>

          {/* 退款处理 */}
          <section className="border-l-2 border-acid/30 pl-6">
            <h2 className="text-lg font-bold text-white mb-3">
              {t.refund.sections.processing.title}
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              {t.refund.sections.processing.content}
            </p>
          </section>

          {/* 政策变更 */}
          <section className="border-l-2 border-acid/30 pl-6">
            <h2 className="text-lg font-bold text-white mb-3">
              {t.refund.sections.changes.title}
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              {t.refund.sections.changes.content}
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

