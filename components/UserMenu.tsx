'use client';

/**
 * 用户菜单组件 - Electric Green Tech Style
 * 显示登录状态、头像和下拉菜单
 */

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { User, LogOut, Settings } from 'lucide-react';

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 加载中
  if (status === 'loading') {
    return (
      <div className="w-8 h-8 rounded-sm bg-tech-card border border-tech-border flex items-center justify-center">
        <span className="font-mono text-[10px] text-acid animate-pulse">...</span>
      </div>
    );
  }

  // 未登录
  if (!session) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 rounded-sm border border-zinc-700 text-zinc-400 font-mono text-xs uppercase tracking-wider hover:border-acid hover:text-acid transition-colors"
      >
        LOGIN
      </Link>
    );
  }

  // 已登录
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-sm hover:bg-acid/10 transition-colors"
      >
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || '用户头像'}
            width={32}
            height={32}
            className="rounded-sm"
          />
        ) : (
          <div className="w-8 h-8 rounded-sm bg-acid flex items-center justify-center">
            <User className="w-4 h-4 text-black" strokeWidth={1.5} />
          </div>
        )}
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-sm bg-tech-card border border-tech-border overflow-hidden z-50">
          {/* 用户信息 */}
          <div className="px-4 py-3 border-b border-tech-border">
            <p className="text-sm font-medium text-white truncate">
              {session.user?.name || '用户'}
            </p>
            <p className="text-xs text-zinc-500 font-mono truncate">
              {session.user?.email}
            </p>
          </div>

          {/* 菜单项 */}
          <div className="py-1">
            <Link
              href="/user"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-400 hover:bg-acid/10 hover:text-acid transition-colors"
            >
              <Settings className="w-4 h-4" strokeWidth={1.5} />
              <span className="font-mono text-xs uppercase tracking-wider">用户中心</span>
            </Link>
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: '/' });
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              <span className="font-mono text-xs uppercase tracking-wider">退出登录</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

