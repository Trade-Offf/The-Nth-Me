'use client';

/**
 * 登录/注册页面
 * 支持 Google OAuth 和邮箱密码登录
 */

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

type AuthMode = 'login' | 'register';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/portal';
  const error = searchParams.get('error');

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    error === 'CredentialsSignin' ? '邮箱或密码错误' : null
  );

  // Google 登录
  const handleGoogleLogin = () => {
    setIsLoading(true);
    signIn('google', { callbackUrl });
  };

  // 邮箱密码登录
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
      }
    } catch {
      setErrorMessage('登录失败，请稍后重试');
      setIsLoading(false);
    }
  };

  // 注册
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || '注册失败');
        setIsLoading(false);
        return;
      }

      // 注册成功后自动登录
      const loginResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (loginResult?.error) {
        setErrorMessage('注册成功，但自动登录失败，请手动登录');
        setMode('login');
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
      }
    } catch {
      setErrorMessage('注册失败，请稍后重试');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-2xl font-bold text-gradient">第 N 个我</h1>
          </Link>
          <p className="text-white/60">
            {mode === 'login' ? '登录以继续你的平行宇宙之旅' : '创建账号，开启无限可能'}
          </p>
        </div>

        <GlassCard className="p-6 md:p-8">
          {/* 错误提示 */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm"
            >
              {errorMessage}
            </motion.div>
          )}

          {/* Google 登录按钮 */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl border border-white/20 bg-white/5
                     hover:bg-white/10 transition-all flex items-center justify-center gap-3
                     text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            使用 Google 登录
          </button>

          {/* 分割线 */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/40 text-sm">或</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* 邮箱密码表单 */}
          <form onSubmit={mode === 'login' ? handleCredentialsLogin : handleRegister}>
            {/* 昵称（仅注册时显示） */}
            {mode === 'register' && (
              <div className="mb-4">
                <label className="block text-sm text-white/60 mb-2">昵称</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="你的昵称"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10
                             focus:border-cosmic-purple focus:outline-none focus:ring-1 focus:ring-cosmic-purple
                             text-white placeholder:text-white/30"
                  />
                </div>
              </div>
            )}

            {/* 邮箱 */}
            <div className="mb-4">
              <label className="block text-sm text-white/60 mb-2">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10
                           focus:border-cosmic-purple focus:outline-none focus:ring-1 focus:ring-cosmic-purple
                           text-white placeholder:text-white/30"
                />
              </div>
            </div>

            {/* 密码 */}
            <div className="mb-6">
              <label className="block text-sm text-white/60 mb-2">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? '至少6个字符' : '输入密码'}
                  required
                  minLength={mode === 'register' ? 6 : undefined}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10
                           focus:border-cosmic-purple focus:outline-none focus:ring-1 focus:ring-cosmic-purple
                           text-white placeholder:text-white/30"
                />
              </div>
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500
                       text-white font-medium shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02]
                       transition-all flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? '登录' : '注册'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* 切换登录/注册 */}
          <p className="mt-6 text-center text-sm text-white/60">
            {mode === 'login' ? (
              <>
                还没有账号？{' '}
                <button
                  onClick={() => { setMode('register'); setErrorMessage(null); }}
                  className="text-cosmic-purple hover:underline"
                >
                  立即注册
                </button>
              </>
            ) : (
              <>
                已有账号？{' '}
                <button
                  onClick={() => { setMode('login'); setErrorMessage(null); }}
                  className="text-cosmic-purple hover:underline"
                >
                  立即登录
                </button>
              </>
            )}
          </p>
        </GlassCard>

        {/* 返回首页 */}
        <p className="mt-6 text-center">
          <Link href="/" className="text-sm text-white/40 hover:text-white/60 transition-colors">
            ← 返回首页
          </Link>
        </p>
      </motion.div>
    </main>
  );
}

// 使用 Suspense 包裹，解决 useSearchParams 静态渲染问题
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

