'use client';

/**
 * 充值页面 - Electric Green Tech Style
 * 展示三档充值方案，跳转爱发电支付
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Zap, Sparkles, Crown, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useI18n } from '@/lib/i18n';

const AFDIAN_URL = 'https://afdian.com/a/tradeofff';

const planConfigs = [
  { id: 'basic' as const, price: 19.9, credits: 200, icon: Zap },
  { id: 'pro' as const, price: 39.9, credits: 550, popular: true, icon: Sparkles },
  { id: 'ultra' as const, price: 99, credits: 1500, premium: true, icon: Crown },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const { t } = useI18n();
  const [balance, setBalance] = useState<number | null>(null);

  // 构建带 i18n 的价格方案
  const pricingPlans = planConfigs.map((config) => {
    const planT = t.pricing.plans[config.id];
    return {
      ...config,
      name: planT.name,
      nameEn: planT.nameEn,
      tag: planT.tag,
      features: planT.features,
      savings: 'savings' in planT ? planT.savings : undefined,
    };
  });

  useEffect(() => {
    if (session?.user) {
      fetch('/api/user/credits')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setBalance(data.data.balance);
          }
        })
        .catch(console.error);
    }
  }, [session]);

  return (
    <main className="min-h-screen bg-tech-bg text-white relative">
      {/* 网格背景 */}
      <div className="fixed inset-0 tech-grid-bg opacity-30" />

      {/* 导航栏 */}
      <Navbar />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 uppercase tracking-wide">
            {t.pricing.title} <span className="text-acid">{t.pricing.titleHighlight}</span> ⚡️
          </h1>
          <p className="text-zinc-500 font-mono text-sm tracking-wider mb-4">
            {t.pricing.description}
          </p>
          {session && balance !== null && (
            <p className="mb-4 font-mono">
              {t.pricing.currentEnergy}: <span className="text-acid font-bold">{balance} ⚡️</span>
            </p>
          )}
          <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-acid/30 rounded-sm bg-acid/5">
            <span className="w-2 h-2 rounded-full bg-acid animate-pulse" />
            <span className="font-mono text-xs text-acid uppercase tracking-[0.15em]">
              {t.pricing.badge}
            </span>
          </div>
        </div>

        {/* 价格卡片 */}
        <div className="grid md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-sm p-6 bg-tech-card ${
                plan.premium
                  ? 'border-2 border-acid'
                  : plan.popular
                    ? 'border border-acid/50'
                    : 'border border-tech-border'
              }`}
            >
              {/* 角标装饰 */}
              <span className="absolute -top-px -left-px text-zinc-700 text-[10px] font-mono select-none">[</span>
              <span className="absolute -top-px -right-px text-zinc-700 text-[10px] font-mono select-none">]</span>
              <span className="absolute -bottom-px -left-px text-zinc-700 text-[10px] font-mono select-none">[</span>
              <span className="absolute -bottom-px -right-px text-zinc-700 text-[10px] font-mono select-none">]</span>

              {/* 标签 */}
              <div
                className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-sm text-[10px] font-mono uppercase tracking-wider ${
                  plan.premium
                    ? 'bg-acid text-black font-bold'
                    : plan.popular
                      ? 'bg-acid/20 text-acid border border-acid/50'
                      : 'bg-tech-bg text-zinc-500 border border-tech-border'
                }`}
              >
                {plan.tag}
              </div>

              {/* 图标 */}
              <div
                className={`w-10 h-10 rounded-sm flex items-center justify-center mb-4 mt-4 ${
                  plan.premium ? 'bg-acid' : 'bg-tech-bg border border-tech-border'
                }`}
              >
                <plan.icon className={`w-5 h-5 ${plan.premium ? 'text-black' : 'text-acid'}`} strokeWidth={1.5} />
              </div>

              {/* 名称 */}
              <h3 className={`text-lg font-bold mb-1 ${plan.premium ? 'text-acid' : 'text-white'}`}>
                {plan.name}
              </h3>
              <p className="text-xs font-mono text-zinc-600 mb-4">{plan.nameEn}</p>

              {/* 价格 */}
              <div className="mb-6">
                <span className={`text-3xl font-mono font-bold ${plan.premium ? 'text-acid' : 'text-white'}`}>
                  ¥{plan.price}
                </span>
                <span className="ml-2 text-zinc-500 font-mono text-sm">/ {plan.credits} ⚡️</span>
              </div>

              {/* 省钱提示 */}
              {plan.savings && (
                <p className="text-xs font-mono text-acid mb-4">
                  ✨ {plan.savings}
                </p>
              )}

              {/* 特性列表 */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                    <Check className="w-4 h-4 flex-shrink-0 text-acid" strokeWidth={1.5} />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* 购买按钮 */}
              <a
                href={AFDIAN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-3 rounded-sm text-center font-mono text-sm uppercase tracking-wider font-medium transition-all ${
                  plan.premium
                    ? 'bg-acid text-black border-2 border-acid hover:bg-transparent hover:text-acid'
                    : plan.popular
                      ? 'bg-acid/20 text-acid border border-acid/50 hover:bg-acid hover:text-black'
                      : 'bg-transparent text-zinc-400 border border-tech-border hover:border-acid hover:text-acid'
                }`}
              >
                {plan.premium ? t.pricing.rechargeNow : t.pricing.rechargeBtn}
              </a>
            </motion.div>
          ))}
        </div>

        {/* 说明 */}
        <div className="mt-16 text-center space-y-4">
          <div className="text-zinc-600 text-xs font-mono space-y-2">
            <p>{t.pricing.costPerObservation}</p>
            <p>{t.pricing.neverExpires}</p>
          </div>

          {/* 重要提示 */}
          <div className="max-w-md mx-auto bg-acid/5 border border-acid/30 rounded-sm p-4">
            <p className="text-acid text-xs font-mono font-medium mb-2">{t.pricing.importantNotice}</p>
            <p className="text-zinc-400 text-sm">
              {t.pricing.paymentHint}<span className="text-acid">{t.pricing.paymentRemark}</span>{t.pricing.paymentHintSuffix}
              {session?.user?.email && (
                <>：<br /><code className="text-acid font-mono">{session.user.email}</code></>
              )}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

