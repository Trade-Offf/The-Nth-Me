'use client';

/**
 * 登录/注册页面 - Electric Green Tech Style
 * 支持 Google OAuth 和邮箱密码登录
 */

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import TechCard from '@/components/TechCard';
import Navbar from '@/components/Navbar';
import { useI18n } from '@/lib/i18n';

type AuthMode = 'login' | 'register';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const callbackUrl = searchParams.get('callbackUrl') || '/portal';
  const error = searchParams.get('error');

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    error === 'CredentialsSignin' ? t.login.errorCredentials : null
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
      setErrorMessage(t.login.errorGeneric);
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
        setErrorMessage(data.error || t.login.errorRegister);
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
        setErrorMessage(t.login.errorAutoLogin);
        setMode('login');
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
      }
    } catch {
      setErrorMessage(t.login.errorRegister);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-tech-bg relative">
      {/* 网格背景 */}
      <div className="fixed inset-0 tech-grid-bg opacity-30" />

      {/* 导航栏 */}
      <Navbar />

      <div className="flex items-center justify-center px-4 pt-24 pb-12 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo 和标题 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide mb-4">
              {t.login.title} <span className="text-acid">{t.login.titleHighlight}</span>
            </h1>
            <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-acid/30 rounded-sm bg-acid/5 mb-2">
              <span className="w-2 h-2 rounded-full bg-acid animate-pulse" />
              <span className="font-mono text-xs text-acid uppercase tracking-[0.15em]">
                {t.login.badge}
              </span>
            </div>
            <p className="text-zinc-500 font-mono text-sm tracking-wider">
              {mode === 'login' ? t.login.descriptionLogin : t.login.descriptionRegister}
            </p>
          </div>

          <TechCard className="p-6 md:p-8">
            {/* 错误提示 */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-sm bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono"
              >
                [ERROR] {errorMessage}
              </motion.div>
            )}

            {/* Google 登录按钮 */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-sm border border-tech-border bg-tech-card
                       hover:border-zinc-600 transition-all flex items-center justify-center gap-3
                       text-zinc-300 font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
              {t.login.googleLogin}
            </button>

            {/* 分割线 */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-tech-border" />
              <span className="text-zinc-600 text-xs font-mono">{t.login.or}</span>
              <div className="flex-1 h-px bg-tech-border" />
            </div>

            {/* 邮箱密码表单 */}
            <form onSubmit={mode === 'login' ? handleCredentialsLogin : handleRegister}>
              {/* 昵称（仅注册时显示） */}
              {mode === 'register' && (
                <div className="mb-4">
                  <label className="block text-xs text-zinc-500 mb-2 font-mono uppercase tracking-wider">{t.login.labelName}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" strokeWidth={1.5} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="your_codename"
                      className="w-full pl-10 pr-4 py-3 rounded-sm bg-transparent border border-tech-border
                               focus:border-acid focus:outline-none
                               text-white font-mono placeholder:text-zinc-700"
                    />
                  </div>
                </div>
              )}

              {/* 邮箱 */}
              <div className="mb-4">
                <label className="block text-xs text-zinc-500 mb-2 font-mono uppercase tracking-wider">{t.login.labelEmail}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" strokeWidth={1.5} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-sm bg-transparent border border-tech-border
                             focus:border-acid focus:outline-none
                             text-white font-mono placeholder:text-zinc-700"
                  />
                </div>
              </div>

              {/* 密码 */}
              <div className="mb-6">
                <label className="block text-xs text-zinc-500 mb-2 font-mono uppercase tracking-wider">{t.login.labelPassword}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" strokeWidth={1.5} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'register' ? '••••••' : '••••••'}
                    required
                    minLength={mode === 'register' ? 6 : undefined}
                    className="w-full pl-10 pr-4 py-3 rounded-sm bg-transparent border border-tech-border
                             focus:border-acid focus:outline-none
                             text-white font-mono placeholder:text-zinc-700"
                  />
                </div>
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-sm bg-acid text-black font-mono text-sm uppercase tracking-wider font-medium
                         hover:bg-transparent hover:text-acid border-2 border-acid
                         transition-all flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="animate-pulse">[{t.login.verifying}]</span>
                ) : (
                  <>
                    {mode === 'login' ? `[ ${t.login.submitLogin} ]` : `[ ${t.login.submitRegister} ]`}
                    <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </form>

            {/* 切换登录/注册 */}
            <p className="mt-6 text-center text-sm text-zinc-500 font-mono">
              {mode === 'login' ? (
                <>
                  {t.login.noAccount}{' '}
                  <button
                    onClick={() => { setMode('register'); setErrorMessage(null); }}
                    className="text-acid hover:underline"
                  >
                    {t.login.registerNow}
                  </button>
                </>
              ) : (
                <>
                  {t.login.hasAccount}{' '}
                  <button
                    onClick={() => { setMode('login'); setErrorMessage(null); }}
                    className="text-acid hover:underline"
                  >
                    {t.login.loginNow}
                  </button>
                </>
              )}
            </p>
          </TechCard>
        </motion.div>
      </div>
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

