'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import type { ToolType } from '@/app/formats/page';
import dynamic from 'next/dynamic';

// 动态导入工具组件以避免 SSR 时访问 window 对象
const WebPConverter = dynamic(() => import('./tools/WebPConverter'), { ssr: false });
const CompressTool = dynamic(() => import('./tools/CompressTool'), { ssr: false });
const HeicConverter = dynamic(() => import('./tools/HeicConverter'), { ssr: false });
const Pdf2ImgConverter = dynamic(() => import('./tools/Pdf2ImgConverter'), { ssr: false });
const Img2PdfConverter = dynamic(() => import('./tools/Img2PdfConverter'), { ssr: false });
const Video2GifConverter = dynamic(() => import('./tools/Video2GifConverter'), { ssr: false });
const IcoGenerator = dynamic(() => import('./tools/IcoGenerator'), { ssr: false });

interface ToolModalProps {
  toolId: ToolType;
  onClose: () => void;
}

export default function ToolModal({ toolId, onClose }: ToolModalProps) {
  const { t } = useI18n();

  // 禁止背景滚动
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // ESC 键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // 根据工具类型渲染对应组件
  const renderTool = () => {
    switch (toolId) {
      case 'webp':
        return <WebPConverter />;
      case 'compress':
        return <CompressTool />;
      case 'heic':
        return <HeicConverter />;
      case 'pdf2img':
        return <Pdf2ImgConverter />;
      case 'img2pdf':
        return <Img2PdfConverter />;
      case 'video2gif':
        return <Video2GifConverter />;
      case 'ico':
        return <IcoGenerator />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      >
        {/* 背景遮罩 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* 弹窗内容 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-tech-bg border border-tech-border rounded-sm overflow-hidden"
        >
          {/* 顶部标题栏 */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-tech-card/95 border-b border-tech-border backdrop-blur-sm">
            <div>
              <h2 className="font-mono text-lg font-medium text-white">
                {t.formats.tools[toolId].name}
              </h2>
              <p className="font-mono text-xs text-zinc-500 mt-1">
                {t.formats.tools[toolId].desc}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-acid hover:bg-acid/10 rounded-sm transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* 工具内容区 */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="p-6">
              {renderTool()}
            </div>
          </div>

          {/* 底部状态栏 */}
          <div className="sticky bottom-0 h-8 bg-tech-bg/80 border-t border-tech-border flex items-center px-4 justify-between backdrop-blur-sm">
            <span className="font-mono text-[10px] text-zinc-600 tracking-wider">
              CLIENT_SIDE_PROCESSING: ACTIVE
            </span>
            <span className="font-mono text-[10px] text-acid animate-pulse">
              ● PRIVACY_MODE
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

