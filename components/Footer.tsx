'use client';

/**
 * 全局 Footer 组件
 * 包含版权信息、服务条款、隐私政策链接
 */

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-tech-border bg-tech-bg/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 版权信息 */}
          <div className="text-zinc-500 text-xs font-mono">
            © {currentYear} {t.footer.copyright}
          </div>

          {/* 链接 - Paddle 要求的法律三件套 + 联系方式 */}
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-zinc-500 text-xs font-mono hover:text-acid transition-colors"
            >
              {t.footer.terms}
            </Link>
            <Link
              href="/privacy"
              className="text-zinc-500 text-xs font-mono hover:text-acid transition-colors"
            >
              {t.footer.privacy}
            </Link>
            <Link
              href="/refund"
              className="text-zinc-500 text-xs font-mono hover:text-acid transition-colors"
            >
              {t.footer.refund}
            </Link>
            <a
              href="mailto:help@ainanobanana.io"
              className="text-zinc-500 text-xs font-mono hover:text-acid transition-colors"
            >
              {t.footer.contact}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

