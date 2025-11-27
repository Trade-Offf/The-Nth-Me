'use client';

/**
 * 用户菜单组件
 * 显示登录状态、头像和下拉菜单
 */

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { User, LogOut, Settings, Loader2 } from 'lucide-react';

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
      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-white/60" />
      </div>
    );
  }

  // 未登录
  if (!session) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20
                 border border-cosmic-purple/30 text-cosmic-purple hover:bg-purple-500/30
                 transition-all text-sm font-medium"
      >
        登录
      </Link>
    );
  }

  // 已登录
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full p-1 hover:bg-white/10 transition-colors"
      >
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || '用户头像'}
            width={36}
            height={36}
            className="rounded-full"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-cosmic-midnight/95 backdrop-blur-xl
                      border border-white/10 shadow-xl overflow-hidden z-50">
          {/* 用户信息 */}
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-medium text-white truncate">
              {session.user?.name || '用户'}
            </p>
            <p className="text-xs text-white/50 truncate">
              {session.user?.email}
            </p>
          </div>

          {/* 菜单项 */}
          <div className="py-2">
            <Link
              href="/user"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
              用户中心
            </Link>
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: '/' });
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

