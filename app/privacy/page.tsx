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
          <section className="border-l-2 border-acid/30 pl-6">
            <h2 className="text-lg font-bold text-white mb-3">1. 信息收集</h2>
            <p className="text-zinc-400 leading-relaxed">
              我们收集的信息包括：您的邮箱地址（用于账户注册和登录）、您上传的照片（仅用于AI生成，处理后立即删除）、支付记录（用于积分充值）。
            </p>
          </section>

          <section className="border-l-2 border-acid/30 pl-6">
            <h2 className="text-lg font-bold text-white mb-3">2. 信息使用</h2>
            <p className="text-zinc-400 leading-relaxed">
              您的信息仅用于提供本服务，包括：账户管理、AI图像生成、积分管理。我们不会将您的信息出售或共享给第三方，除非法律要求。
            </p>
          </section>

          <section className="border-l-2 border-acid/30 pl-6">
            <h2 className="text-lg font-bold text-white mb-3">3. 照片处理</h2>
            <p className="text-zinc-400 leading-relaxed">
              本服务不存储您上传的照片。图片直接传输至 Google Nano Banana API 进行 AI 处理，处理完成后结果即时返回给您。我们的服务器不保留任何图片数据，不会被存储、分析或用于任何其他用途。
            </p>
          </section>

          <section className="border-l-2 border-acid/30 pl-6">
            <h2 className="text-lg font-bold text-white mb-3">4. 数据安全</h2>
            <p className="text-zinc-400 leading-relaxed">
              我们采用行业标准的安全措施保护您的数据，包括HTTPS加密传输、安全的数据库存储。但请注意，没有任何互联网传输是100%安全的。
            </p>
          </section>

          <section className="border-l-2 border-acid/30 pl-6">
            <h2 className="text-lg font-bold text-white mb-3">5. Cookie使用</h2>
            <p className="text-zinc-400 leading-relaxed">
              我们使用Cookie来维持您的登录状态和语言偏好。您可以在浏览器中禁用Cookie，但这可能影响部分功能的正常使用。
            </p>
          </section>

          <section className="border-l-2 border-acid/30 pl-6">
            <h2 className="text-lg font-bold text-white mb-3">6. 联系我们</h2>
            <p className="text-zinc-400 leading-relaxed">
              如果您对隐私政策有任何疑问，请联系：
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

