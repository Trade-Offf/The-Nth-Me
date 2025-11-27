'use client';

/**
 * 用户中心页面
 * 显示能量余额、绑定爱发电、充值记录
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Zap,
  Link as LinkIcon,
  History,
  User,
  Loader2,
} from 'lucide-react';
import TechCard from '@/components/TechCard';
import Navbar from '@/components/Navbar';
import { useI18n } from '@/lib/i18n';

interface CreditData {
  balance: number;
  totalEarned: number;
  totalUsed: number;
  costPerGeneration: number;
}

interface Transaction {
  id: string;
  creditsAdded: number;
  planName: string | null;
  amountCny: number | null;
  status: string;
  createdAt: string;
}

export default function UserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useI18n();

  const [credits, setCredits] = useState<CreditData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 未登录跳转
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // 加载数据
  useEffect(() => {
    if (session?.user) {
      Promise.all([
        fetch('/api/user/credits').then((r) => r.json()),
        fetch('/api/user/transactions').then((r) => r.json()),
      ])
        .then(([creditsRes, txRes]) => {
          if (creditsRes.success) setCredits(creditsRes.data);
          if (txRes.success) setTransactions(txRes.data);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [session]);

  if (status === 'loading' || isLoading) {
    return (
      <main className="min-h-screen bg-tech-bg flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-acid animate-spin" />
      </main>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-tech-bg text-white relative">
      {/* 网格背景 */}
      <div className="fixed inset-0 tech-grid-bg opacity-30" />

      {/* 导航栏 */}
      <Navbar />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-20">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide mb-4">
            {t.user.title} <span className="text-acid">{t.user.titleHighlight}</span>
          </h1>
          <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-acid/30 rounded-sm bg-acid/5">
            <span className="w-2 h-2 rounded-full bg-acid animate-pulse" />
            <span className="font-mono text-xs text-acid uppercase tracking-[0.15em]">
              {t.user.badge}
            </span>
          </div>
        </div>

        {/* 用户信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TechCard className="p-6 mb-8">
            <div className="flex flex-col items-center text-center mb-6">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={t.user.avatar}
                  width={80}
                  height={80}
                  className="rounded-sm border border-tech-border mb-4"
                />
              ) : (
                <div className="w-20 h-20 rounded-sm bg-tech-bg border border-tech-border flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-acid" strokeWidth={1.5} />
                </div>
              )}
              <h1 className="text-lg font-mono font-medium text-white">{session.user?.name || t.user.defaultName}</h1>
              <p className="text-zinc-500 text-xs font-mono mt-1">{session.user?.email}</p>
            </div>

            {/* 能量余额 */}
            {credits && (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-acid/10 border border-acid/30 rounded-sm p-4 text-center">
                  <Zap className="w-5 h-5 mx-auto mb-2 text-acid" strokeWidth={1.5} />
                  <p className="text-2xl font-mono font-bold text-acid">{credits.balance}</p>
                  <p className="text-zinc-600 text-[10px] font-mono uppercase">{t.user.currentEnergy}</p>
                </div>
                <div className="bg-tech-bg border border-tech-border rounded-sm p-4 text-center">
                  <p className="text-2xl font-mono font-bold text-green-500">{credits.totalEarned}</p>
                  <p className="text-zinc-600 text-[10px] font-mono uppercase">{t.user.totalEarned}</p>
                </div>
                <div className="bg-tech-bg border border-tech-border rounded-sm p-4 text-center">
                  <p className="text-2xl font-mono font-bold text-orange-500">{credits.totalUsed}</p>
                  <p className="text-zinc-600 text-[10px] font-mono uppercase">{t.user.totalUsed}</p>
                </div>
              </div>
            )}

            {/* 充值按钮 */}
            <Link
              href="/pricing"
              className="mt-6 block w-full py-3 rounded-sm bg-acid text-black text-center font-mono text-sm uppercase hover:bg-acid-dim transition-colors"
            >
              ⚡ {t.user.rechargeButton}
            </Link>
          </TechCard>
        </motion.div>

        {/* 充值说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TechCard className="p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <LinkIcon className="w-4 h-4 text-acid" strokeWidth={1.5} />
              <h2 className="text-sm font-mono font-medium text-white uppercase">{t.user.rechargeGuideTitle}</h2>
            </div>

            <div className="space-y-3 text-zinc-400 text-xs font-mono">
              <p>{`// ${t.user.rechargeGuideStep1}`}<span className="text-acid">{t.user.rechargeGuideHighlight}</span>{t.user.rechargeGuideStep2}</p>
              <div className="bg-acid/10 border border-acid/30 rounded-sm p-3">
                <code className="text-acid">{session.user?.email}</code>
              </div>
              <p className="text-zinc-600">{`// ${t.user.rechargeGuideNote}`}</p>
            </div>
          </TechCard>
        </motion.div>

        {/* 交易记录 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TechCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-acid" strokeWidth={1.5} />
              <h2 className="text-sm font-mono font-medium text-white uppercase">{t.user.transactionHistory}</h2>
            </div>

            {transactions.length === 0 ? (
              <p className="text-zinc-600 text-center py-8 font-mono text-xs">{t.user.noRecords}</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-3 border-b border-tech-border last:border-0"
                  >
                    <div>
                      <p className="font-mono text-sm text-white">{tx.planName || t.user.energyChange}</p>
                      <p className="text-zinc-600 text-[10px] font-mono">
                        {new Date(tx.createdAt).toLocaleString('zh-CN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-acid font-mono font-bold">+{tx.creditsAdded} ⚡</p>
                      {tx.amountCny && (
                        <p className="text-zinc-600 text-[10px] font-mono">¥{tx.amountCny}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TechCard>
        </motion.div>
      </div>
    </main>
  );
}

