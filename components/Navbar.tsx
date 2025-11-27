'use client';

import Link from 'next/link';
import { Globe, Terminal } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import UserMenu from './UserMenu';

const navbarRoutes: Record<string, string> = {
  prompts: '/showcase',
  pricing: '/pricing',
  portal: '/portal',
};

const navbarItems = ['portal', 'prompts', 'pricing'] as const;
type NavbarKey = (typeof navbarItems)[number];

export default function Navbar() {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-tech-bg/95 border-b border-tech-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* 品牌 */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-sm bg-acid flex items-center justify-center">
            <Terminal className="w-5 h-5 text-black" strokeWidth={1.5} />
          </div>
          <div className="leading-tight">
            <div className="font-mono text-sm tracking-wider text-white group-hover:text-acid transition-colors">
              [{t.navbar.brand}]
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-mono hidden sm:block">
              QUANTUM OBSERVATION TERMINAL
            </div>
          </div>
        </Link>

        {/* 菜单 + 语言切换 */}
        <div className="flex items-center space-x-8">
          <nav className="hidden md:flex items-center space-x-1">
            {navbarItems.map((key) => {
              const route = navbarRoutes[key];
              return (
                <Link
                  key={key}
                  href={route}
                  className="px-4 py-2 font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-acid transition-colors"
                >
                  {t.navbar[key as NavbarKey]}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setLang(lang === 'zh-CN' ? 'en-US' : 'zh-CN')}
              className="p-2 text-zinc-500 hover:text-acid hover:bg-acid/10 rounded-sm transition-colors"
              aria-label="Language"
            >
              <Globe className="w-4 h-4" strokeWidth={1.5} />
            </button>

            {/* 分隔线 */}
            <div className="w-px h-6 bg-tech-border mx-2" />

            {/* 用户菜单 */}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
