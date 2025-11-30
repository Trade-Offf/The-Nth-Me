'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, ChevronDown, Check } from 'lucide-react';
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
  const { lang, setLang, t, supportedLangs } = useI18n();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = supportedLangs.find((l) => l.code === lang);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-tech-bg/95 border-b border-tech-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* 品牌 Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo.svg"
            alt="The Nth Me"
            width={120}
            height={32}
            className="h-6 w-auto group-hover:drop-shadow-[0_0_8px_rgba(204,255,0,0.6)] transition-all duration-300"
            priority
          />
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
            {/* 语言切换下拉菜单 */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-2 py-1.5 text-zinc-500 hover:text-acid hover:bg-acid/10 rounded-sm transition-colors"
                aria-label="Language"
              >
                <Globe className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-xs font-mono uppercase tracking-wider hidden sm:inline">{currentLang?.code.split('-')[0]}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
              </button>

              {/* 下拉菜单 */}
              {isLangOpen && (
                <div className="absolute right-0 top-full mt-1 py-1 min-w-[120px] bg-tech-card border border-tech-border rounded-sm shadow-xl z-50">
                  {supportedLangs.map((langOption) => (
                    <button
                      key={langOption.code}
                      onClick={() => {
                        setLang(langOption.code);
                        setIsLangOpen(false);
                      }}
                      className={`
                        w-full flex items-center justify-between gap-2 px-3 py-2
                        font-mono text-xs transition-colors
                        ${lang === langOption.code
                          ? 'text-acid bg-acid/10'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      <span>{langOption.name}</span>
                      {lang === langOption.code && (
                        <Check className="w-3 h-3 text-acid" strokeWidth={2} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
