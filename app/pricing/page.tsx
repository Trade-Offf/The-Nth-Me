'use client';

/**
 * 充值页面
 * 展示三档充值方案，跳转爱发电支付
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Zap, Sparkles, Crown, ArrowLeft, Check } from 'lucide-react';

const AFDIAN_URL = 'https://afdian.com/a/tradeofff';

const pricingPlans = [
  {
    id: 'basic',
    name: '基础版',
    nameEn: 'Basic',
    price: 19.9,
    credits: 200,
    tag: '入门首选',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    features: ['200 ⚡️ 能量', '永久有效'],
  },
  {
    id: 'pro',
    name: '进阶版',
    nameEn: 'Pro',
    price: 39.9,
    credits: 550,
    tag: '🔥 最受欢迎',
    popular: true,
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    features: ['550 ⚡️ 能量', '永久有效', '性价比之选'],
  },
  {
    id: 'ultra',
    name: '终极版',
    nameEn: 'Ultra',
    price: 99,
    credits: 1500,
    tag: '💎 单价最低',
    savings: '对比基础版，立省 ¥50+',
    premium: true,  // 黑金特效
    icon: Crown,
    color: 'from-yellow-500 via-amber-400 to-yellow-600',
    features: ['1500 ⚡️ 能量', '永久有效', '极客专享'],
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<number | null>(null);

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
    <main className="min-h-screen bg-[#020204] text-white">
      {/* 背景光效 */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.15)_0%,_transparent_70%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        {/* 标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            为引擎
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              充能 ⚡️
            </span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            选择适合你的能量包，解锁更多平行宇宙的可能
          </p>
          {session && balance !== null && (
            <p className="mt-4 text-lg">
              当前能量：<span className="text-purple-400 font-bold">{balance} ⚡️</span>
            </p>
          )}
        </div>

        {/* 价格卡片 */}
        <div className="grid md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-6 ${
                plan.premium
                  ? 'bg-gradient-to-b from-yellow-900/30 via-black to-yellow-950/20 border-2 border-yellow-500/60 shadow-[0_0_40px_rgba(234,179,8,0.15)]'
                  : plan.popular
                    ? 'bg-gradient-to-b from-purple-500/20 to-transparent border-2 border-purple-500/50'
                    : 'bg-white/5 border border-white/10'
              }`}
            >
              {/* 黑金版装饰角标 */}
              {plan.premium && (
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
                  <div className="absolute top-3 -right-6 w-24 text-center text-[10px] font-bold bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 text-black transform rotate-45">
                    VIP
                  </div>
                </div>
              )}

              {/* 标签 */}
              <div
                className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-medium ${
                  plan.premium
                    ? 'bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 text-black font-bold shadow-[0_0_15px_rgba(234,179,8,0.5)]'
                    : plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-white/80'
                }`}
              >
                {plan.tag}
              </div>

              {/* 图标 */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 mt-4`}
              >
                <plan.icon className="w-6 h-6 text-white" />
              </div>

              {/* 名称 */}
              <h3 className={`text-xl font-bold mb-1 ${plan.premium ? 'bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text text-transparent' : ''}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-4 ${plan.premium ? 'text-yellow-600/80' : 'text-white/40'}`}>{plan.nameEn}</p>

              {/* 价格 */}
              <div className="mb-6">
                <span className={`text-3xl font-bold ${plan.premium ? 'bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 bg-clip-text text-transparent' : ''}`}>
                  ¥{plan.price}
                </span>
                <span className={`ml-2 ${plan.premium ? 'text-yellow-500/70' : 'text-white/40'}`}>/ {plan.credits} ⚡️</span>
              </div>

              {/* 省钱提示 */}
              {plan.savings && (
                <p className={`text-sm mb-4 ${plan.premium ? 'text-yellow-400' : 'text-green-400'}`}>
                  ✨ {plan.savings}
                </p>
              )}

              {/* 特性列表 */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className={`flex items-center gap-2 text-sm ${plan.premium ? 'text-yellow-100/80' : 'text-white/70'}`}>
                    <Check className={`w-4 h-4 flex-shrink-0 ${plan.premium ? 'text-yellow-400' : 'text-green-400'}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* 购买按钮 */}
              <a
                href={AFDIAN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-3 rounded-xl text-center font-medium transition-all ${
                  plan.premium
                    ? 'bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-500 text-black font-bold hover:shadow-[0_0_30px_rgba(234,179,8,0.6)]'
                    : plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]'
                      : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {plan.premium ? '🏆 立即充值' : '立即充值'}
              </a>
            </motion.div>
          ))}
        </div>

        {/* 说明 */}
        <div className="mt-16 text-center text-white/40 text-sm space-y-2">
          <p>⚡️ 每生成一张图片消耗 4 点能量</p>
          <p>🔒 充值后能量永久有效，不会过期</p>
          <p className="pt-4">
            充值前请先在{' '}
            <Link href="/user" className="text-purple-400 hover:underline">
              用户中心
            </Link>{' '}
            绑定您的爱发电账号
          </p>
        </div>
      </div>
    </main>
  );
}

