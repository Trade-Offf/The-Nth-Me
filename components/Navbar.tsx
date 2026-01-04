'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, ChevronDown, Check, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import UserMenu from './UserMenu';

const navbarRoutes: Record<string, string> = {
  prompts: '/showcase',
  pricing: '/pricing',
};

const toolboxItems = [
  { key: 'ai-image', route: '/portal' },
] as const;

const navbarItems = ['toolbox', 'prompts', 'pricing'] as const;
type NavbarKey = (typeof navbarItems)[number];

export default function Navbar() {
  const { lang, setLang, t, supportedLangs } = useI18n();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const toolboxMenuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (toolboxMenuRef.current && !toolboxMenuRef.current.contains(e.target as Node)) {
        setIsToolboxOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 移动端菜单打开时禁止滚动
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const currentLang = supportedLangs.find((l) => l.code === lang);

  return (
    <>
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
              // 工具箱下拉菜单
              if (key === 'toolbox') {
                return (
                  <div key={key} className="relative" ref={toolboxMenuRef}>
                    <button
                      onClick={() => setIsToolboxOpen(!isToolboxOpen)}
                      className="flex items-center gap-1 px-4 py-2 font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-acid transition-colors"
                    >
                      {t.navbar.toolbox}
                      <ChevronDown className={`w-3 h-3 transition-transform ${isToolboxOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
                    </button>
                    
                    {/* 工具箱下拉菜单 */}
                    {isToolboxOpen && (
                      <div className="absolute left-0 top-full mt-1 py-1 min-w-[180px] bg-tech-card border border-tech-border rounded-sm shadow-xl z-50">
                        {toolboxItems.map((item) => (
                          <Link
                            key={item.key}
                            href={item.route}
                            onClick={() => setIsToolboxOpen(false)}
                            className="block px-4 py-2 font-mono text-xs text-zinc-400 hover:text-acid hover:bg-acid/5 transition-colors"
                          >
                            {t.navbar.toolbox_items[item.key]}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              
              // 其他直接链接
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

            {/* 分隔线 - 仅桌面端显示 */}
            <div className="w-px h-6 bg-tech-border mx-2 hidden md:block" />

            {/* 用户菜单 - 仅桌面端显示 */}
            <div className="hidden md:block">
              <UserMenu />
            </div>

            {/* 移动端汉堡菜单按钮 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 text-zinc-400 hover:text-acid transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

    </header>

      {/* 移动端全屏菜单 - 放在 header 外面确保层级正确 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 top-16 z-[100] bg-[#0a0a0a] border-t border-tech-border"
          >
            <div className="flex flex-col h-full overflow-y-auto">
              {/* 导航链接 */}
              <nav className="flex-1 px-6 py-8 space-y-2">
                {navbarItems.map((key, index) => {
                  // 工具箱展开菜单
                  if (key === 'toolbox') {
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="space-y-1"
                      >
                        <button
                          onClick={() => setIsToolboxOpen(!isToolboxOpen)}
                          className="w-full flex items-center justify-between px-4 py-4 font-mono text-lg uppercase tracking-wider text-zinc-300 hover:text-acid hover:bg-acid/5 rounded-sm transition-colors border-b border-tech-border/50"
                        >
                          {t.navbar.toolbox}
                          <ChevronDown className={`w-4 h-4 transition-transform ${isToolboxOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
                        </button>
                        
                        {/* 子菜单 */}
                        {isToolboxOpen && (
                          <div className="pl-4 space-y-1">
                            {toolboxItems.map((item) => (
                              <Link
                                key={item.key}
                                href={item.route}
                                onClick={() => {
                                  setIsToolboxOpen(false);
                                  setIsMobileMenuOpen(false);
                                }}
                                className="block px-4 py-3 font-mono text-sm text-zinc-400 hover:text-acid hover:bg-acid/5 rounded-sm transition-colors"
                              >
                                {t.navbar.toolbox_items[item.key]}
                              </Link>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    );
                  }
                  
                  // 其他直接链接
                  const route = navbarRoutes[key];
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={route}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-4 font-mono text-lg uppercase tracking-wider text-zinc-300 hover:text-acid hover:bg-acid/5 rounded-sm transition-colors border-b border-tech-border/50"
                      >
                        {t.navbar[key as NavbarKey]}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* 底部用户区域 */}
              <div className="px-6 py-6 border-t border-tech-border bg-tech-card/50">
                <UserMenu />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
