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
  ArrowLeft,
  Link as LinkIcon,
  History,
  User,
  Loader2,
} from 'lucide-react';

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
      <main className="min-h-screen bg-[#020204] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </main>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-[#020204] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.15)_0%,_transparent_70%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        {/* 返回 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        {/* 用户信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt="头像"
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">{session.user?.name || '用户'}</h1>
              <p className="text-white/50 text-sm">{session.user?.email}</p>
            </div>
          </div>

          {/* 能量余额 */}
          {credits && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 text-center">
                <Zap className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                <p className="text-2xl font-bold text-purple-400">{credits.balance}</p>
                <p className="text-white/50 text-xs">当前能量</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-400">{credits.totalEarned}</p>
                <p className="text-white/50 text-xs">累计获得</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-orange-400">{credits.totalUsed}</p>
                <p className="text-white/50 text-xs">已使用</p>
              </div>
            </div>
          )}

          {/* 充值按钮 */}
          <Link
            href="/pricing"
            className="mt-6 block w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-center font-medium hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-shadow"
          >
            ⚡️ 获取更多能量
          </Link>
        </motion.div>

        {/* 充值说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <LinkIcon className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold">充值说明</h2>
          </div>

          <div className="space-y-3 text-white/70 text-sm">
            <p>📧 充值时请在爱发电<span className="text-purple-400 font-medium">「留言」</span>中填写您的注册邮箱：</p>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
              <code className="text-purple-300">{session.user?.email}</code>
            </div>
            <p className="text-white/50">能量将在支付成功后自动到账，请确保邮箱填写正确。</p>
          </div>
        </motion.div>

        {/* 交易记录 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold">充值记录</h2>
          </div>

          {transactions.length === 0 ? (
            <p className="text-white/50 text-center py-8">暂无记录</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="font-medium">{tx.planName || '能量变更'}</p>
                    <p className="text-white/50 text-xs">
                      {new Date(tx.createdAt).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">+{tx.creditsAdded} ⚡️</p>
                    {tx.amountCny && (
                      <p className="text-white/50 text-xs">¥{tx.amountCny}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

