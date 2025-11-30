'use client';

/**
 * 充值页面 - Steins;Gate x Cyberpunk 风格
 * 量子观测终端 - 能源补给站
 *
 * 支持双币种 (USD/CNY) 和双支付渠道 (Paddle/爱发电)
 * 根据用户地区自动切换货币，支持手动切换
 */

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Flame } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BinaryRain from '@/components/BinaryRain';
import { useI18n } from '@/lib/i18n';
import {
  PRICING_TIERS,
  AFDIAN_URL,
  getVisibleTiers,
  getTierPrice,
  type Currency,
  type PricingTier,
  type TierId,
} from '@/lib/config/pricingTiers';
import {
  getCurrencySync,
  detectCurrency,
  setStoredCurrency,
  formatCurrencyAmount,
} from '@/lib/utils/currency';
import { initializePaddle, openPaddleCheckout, isPaddleAvailable } from '@/lib/paddle';

export default function PricingPage() {
  const { data: session } = useSession();
  const { t } = useI18n();
  const [balance, setBalance] = useState<number | null>(null);
  // 使用固定默认值避免 hydration 不匹配，然后在客户端检测
  const [currency, setCurrency] = useState<Currency>('CNY');
  const [isDetecting, setIsDetecting] = useState(true);
  const [paddleReady, setPaddleReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 客户端挂载后检测货币
  useEffect(() => {
    setMounted(true);
    // 先尝试读取存储的偏好
    const stored = getCurrencySync();
    setCurrency(stored);
    // 然后异步检测（如果没有存储偏好的话）
    detectCurrency().then((detected) => {
      setCurrency(detected);
      setIsDetecting(false);
    });
  }, []);

  // 获取用户余额
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

  // 初始化 Paddle SDK
  useEffect(() => {
    initializePaddle().then(setPaddleReady);
  }, []);

  // 切换货币
  const handleCurrencySwitch = useCallback((newCurrency: Currency) => {
    setCurrency(newCurrency);
    setStoredCurrency(newCurrency);
  }, []);

  // 获取当前货币可见的档位
  const visibleTiers = getVisibleTiers(currency);

  // 处理购买按钮点击
  const handleBuyClick = useCallback(
    (tier: PricingTier) => {
      if (currency === 'CNY') {
        // 跳转爱发电
        window.open(AFDIAN_URL, '_blank');
      } else {
        // 使用 Paddle Checkout
        if (!tier.paddlePriceId) {
          // Paddle Price ID 未配置，提示用户
          alert(
            'USD payment is being set up. Please use CNY payment for now, or check back later.'
          );
          return;
        }

        if (!paddleReady || !isPaddleAvailable()) {
          alert('Payment system is loading. Please try again in a moment.');
          return;
        }

        // 打开 Paddle Checkout
        openPaddleCheckout({
          items: [{ priceId: tier.paddlePriceId, quantity: 1 }],
          customer: session?.user?.email ? { email: session.user.email } : undefined,
          customData: {
            userId: (session?.user as { id?: string })?.id,
            tierId: tier.id,
          },
          settings: {
            successUrl: `${window.location.origin}/user?payment=success`,
          },
        });
      }
    },
    [currency, paddleReady, session?.user]
  );

  // 获取档位翻译（新的 tier ID 格式）
  const getTierI18n = (tierId: TierId) => {
    return t.pricing.tiers[tierId];
  };

  // 替换 features 中的 {credits} 占位符
  const formatFeature = (feature: string, credits: number) => {
    return feature.replace('{credits}', credits.toLocaleString());
  };

  return (
    <main className="min-h-screen bg-tech-bg text-white relative">
      {/* 二进制雨背景 */}
      <BinaryRain />

      {/* 网格背景 */}
      <div className="fixed inset-0 tech-grid-bg opacity-30" />

      {/* 导航栏 */}
      <Navbar />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20">
        {/* 标题 */}
        <div className="text-center mb-12">
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

        {/* 货币切换器 - 仅在客户端挂载后渲染交互状态 */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center bg-[#0A0A0A] border border-tech-border rounded-sm p-1">
            <button
              onClick={() => handleCurrencySwitch('USD')}
              className={`px-4 py-2 font-mono text-sm transition-all duration-200 rounded-sm ${
                mounted && currency === 'USD'
                  ? 'bg-acid/20 text-acid border border-acid/50'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t.pricing.currencyUsd}
            </button>
            <button
              onClick={() => handleCurrencySwitch('CNY')}
              className={`px-4 py-2 font-mono text-sm transition-all duration-200 rounded-sm ${
                mounted && currency === 'CNY'
                  ? 'bg-acid/20 text-acid border border-acid/50'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t.pricing.currencyCny}
            </button>
          </div>
        </div>

        {/* 价格卡片 - Cyberpunk Style */}
        {/* CNY 4档用 2x2 布局更宽松，USD 3档用 1x3 */}
        <div
          className={`grid gap-6 ${
            visibleTiers.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'
          }`}
        >
          {visibleTiers.map((tier, index) => {
            const isUltimate = tier.id === 'tier_ultra';
            const isPro = tier.id === 'tier_pro';
            const TierIcon = tier.icon;
            const tierI18n = getTierI18n(tier.id);
            const price = getTierPrice(tier, currency);

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className={`
                  relative rounded-sm p-6 bg-[#0A0A0A] backdrop-blur-sm
                  border ${tier.glowColor}
                  ${isUltimate ? 'ring-1 ring-yellow-500/20' : ''}
                  transition-all duration-300 hover:scale-[1.02]
                `}
              >
                {/* 角标装饰 - Cyberpunk brackets */}
                <span className="absolute -top-px -left-px text-zinc-700 text-[10px] font-mono select-none">
                  [
                </span>
                <span className="absolute -top-px -right-px text-zinc-700 text-[10px] font-mono select-none">
                  ]
                </span>
                <span className="absolute -bottom-px -left-px text-zinc-700 text-[10px] font-mono select-none">
                  [
                </span>
                <span className="absolute -bottom-px -right-px text-zinc-700 text-[10px] font-mono select-none">
                  ]
                </span>

                {/* 推荐/终极标签 */}
                {(tier.isRecommended || isUltimate) && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-sm text-[10px] font-mono uppercase tracking-wider
                      ${
                        isUltimate
                          ? 'bg-yellow-500 text-black font-bold shadow-[0_0_10px_rgba(234,179,8,0.5)]'
                          : 'bg-green-500/20 text-green-400 border border-green-500/50'
                      }
                    `}
                  >
                    {isUltimate ? t.pricing.laplaceCore : t.pricing.recommended}
                  </div>
                )}

                {/* 图标 */}
                <div
                  className={`w-12 h-12 rounded-sm flex items-center justify-center mb-4 mt-4
                    ${
                      isUltimate
                        ? 'bg-yellow-500/20 border border-yellow-500/50'
                        : isPro
                        ? 'bg-green-500/10 border border-green-500/30'
                        : 'bg-tech-bg border border-tech-border'
                    }
                  `}
                >
                  <TierIcon
                    className={`w-6 h-6 ${
                      isUltimate ? 'text-yellow-400' : isPro ? 'text-green-400' : 'text-zinc-500'
                    }`}
                    strokeWidth={1.5}
                  />
                </div>

                {/* 名称 */}
                <h3
                  className={`text-xl font-bold mb-1 ${
                    isUltimate ? 'text-yellow-400' : isPro ? 'text-green-400' : 'text-white'
                  }`}
                >
                  {tierI18n.name}
                </h3>
                <p className="text-xs font-mono text-zinc-600 mb-1">{tierI18n.subName}</p>

                {/* Pro 权限标识 */}
                <div
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono mb-4
                  ${
                    tier.isPro
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : 'bg-zinc-800/50 text-zinc-600 border border-zinc-700/50'
                  }
                `}
                >
                  {tier.isPro ? (
                    <>
                      <Unlock className="w-3 h-3" strokeWidth={2} />
                      <span>PRO ACCESS</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" strokeWidth={2} />
                      <span>STANDARD</span>
                    </>
                  )}
                </div>

                {/* 价格 - 动态显示 */}
                <div className="mb-6">
                  <div
                    className={`text-3xl font-mono font-bold ${
                      isUltimate ? 'text-yellow-400' : 'text-white'
                    }`}
                  >
                    {formatCurrencyAmount(price, currency)}
                  </div>
                  <div className="text-zinc-500 font-mono text-sm mt-1">
                    ⚡️ {tier.credits.toLocaleString()} {t.pricing.creditsUnit}
                  </div>
                </div>

                {/* 特性列表 - 动态替换 credits */}
                <ul className="space-y-2.5 mb-6">
                  {tierI18n.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-400 font-mono">
                      <span className="text-zinc-600 mt-0.5">›</span>
                      <span
                        className={
                          feature.includes('Pro') || feature.includes('🔥') ? 'text-green-400' : ''
                        }
                      >
                        {formatFeature(feature, tier.credits)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* 购买按钮 */}
                <button
                  onClick={() => handleBuyClick(tier)}
                  className={`
                    group flex items-center justify-center gap-2
                    w-full py-3 rounded-sm text-center font-mono text-sm uppercase tracking-wider font-medium
                    transition-all duration-300 cursor-pointer
                    ${
                      isUltimate
                        ? 'bg-yellow-500 text-black border-2 border-yellow-500 hover:bg-transparent hover:text-yellow-400'
                        : isPro
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500 hover:text-black'
                        : 'bg-transparent text-zinc-400 border border-tech-border hover:border-green-500/50 hover:text-green-400'
                    }
                  `}
                >
                  {isUltimate && <Flame className="w-4 h-4" strokeWidth={2} />}
                  <span>{isUltimate ? t.pricing.activateNow : t.pricing.rechargeBtn}</span>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* 重要提示 - 根据货币显示不同内容 */}
        <div className="mt-16 text-center space-y-4">
          <div className="max-w-md mx-auto bg-acid/5 border border-acid/30 rounded-sm p-4">
            <p className="text-acid text-xs font-mono font-medium mb-2">
              {t.pricing.importantNotice}
            </p>
            {currency === 'CNY' ? (
              <p className="text-zinc-400 text-sm">
                {t.pricing.paymentHintCny}
                <span className="text-acid">{t.pricing.paymentRemark}</span>
                {t.pricing.paymentHintSuffixCny}
                {session?.user?.email && (
                  <>
                    ：<br />
                    <code className="text-acid font-mono">{session.user.email}</code>
                  </>
                )}
              </p>
            ) : (
              <p className="text-zinc-400 text-sm">
                {t.pricing.paymentHintUsd}
                <br />
                <span className="text-zinc-500 text-xs">{t.pricing.paymentHintSuffixUsd}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
