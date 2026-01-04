'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Copy, Check,
  ImageIcon, AlertTriangle, Loader2
} from 'lucide-react';
import TechCard from '@/components/TechCard';
import { useI18n } from '@/lib/i18n';
import type { ModelType } from '@/lib/types';

// Matrix 数字雨组件
function MatrixRain({ color = '#CCFF00' }: { color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置 canvas 尺寸
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = '01';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    const draw = () => {
      // 半透明黑色背景，产生拖尾效果
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30"
    />
  );
}

interface PreviewPanelProps {
  model: ModelType;
  generatedImage: string | null;
  isGenerating: boolean;
  error: string | null;
  prompt: string;
}

export default function PreviewPanel({
  model,
  generatedImage,
  isGenerating,
  error,
  prompt,
}: PreviewPanelProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // 主题色配置 - 根据模型切换
  const isPro = model === 'pro';
  const theme = {
    text: isPro ? 'text-purple-400' : 'text-acid',
    border: isPro ? 'border-purple-500' : 'border-acid',
    borderLight: isPro ? 'border-purple-500/30' : 'border-acid/30',
    bg: isPro ? 'bg-purple-500/10' : 'bg-acid/10',
    hoverBorder: isPro ? 'hover:border-purple-500/50' : 'hover:border-acid/50',
    hoverText: isPro ? 'hover:text-purple-400' : 'hover:text-acid',
    btnBg: isPro ? 'bg-purple-500' : 'bg-acid',
    btnBgHover: isPro ? 'hover:bg-purple-400' : 'hover:bg-acid',
    btnText: isPro ? 'text-white' : 'text-black',
    shadow: isPro ? 'shadow-[0_0_30px_rgba(168,85,247,0.3)]' : 'shadow-[0_0_30px_rgba(204,255,0,0.3)]',
    glow: isPro ? 'rgba(168,85,247,0.3)' : 'rgba(204,255,0,0.3)',
  };

  // 复制 Prompt
  const handleCopyPrompt = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // 下载图片 - 使用代理 API 避免 CORS
  const handleDownload = async () => {
    if (!generatedImage || isDownloading) return;

    setIsDownloading(true);
    try {
      const downloadUrl = `/api/download?url=${encodeURIComponent(generatedImage)}`;
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nthme-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <TechCard className="p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-mono font-medium text-white uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className={`w-5 h-5 ${theme.text}`} />
          {t.laboratory.output}
        </h2>

        {/* Action Buttons */}
        {generatedImage && !isGenerating && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPrompt}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border border-tech-border
                       text-xs font-mono text-zinc-400 ${theme.hoverText} ${theme.hoverBorder} transition-all`}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? t.laboratory.copied : t.laboratory.copyPrompt}
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-xs font-mono transition-all
                ${isDownloading
                  ? 'border-zinc-600 bg-zinc-800 text-zinc-500 cursor-wait'
                  : `${theme.borderLight} ${theme.bg} ${theme.text} ${theme.btnBgHover} ${theme.btnText}`
                }`}
            >
              {isDownloading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Download className="w-3 h-3" />
              )}
              {isDownloading ? t.laboratory.downloading : t.laboratory.download}
            </button>
          </div>
        )}
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center rounded-sm border border-tech-border bg-tech-bg/50 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {/* Empty State */}
          {!generatedImage && !isGenerating && !error && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-sm bg-tech-bg border border-tech-border flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-zinc-600" strokeWidth={1} />
              </div>
              <p className="text-zinc-500 font-mono text-sm">{t.laboratory.noOutput}</p>
              <p className="text-zinc-600 font-mono text-xs mt-1">{t.laboratory.configureAndRun}</p>
            </motion.div>
          )}

          {/* Loading State - Matrix Style */}
          {isGenerating && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black"
            >
              {/* Matrix 数字雨背景 */}
              <MatrixRain color={isPro ? '#A855F7' : '#CCFF00'} />

              {/* 中心内容 */}
              <div className="relative z-10 text-center">
                {/* 闪烁的终端光标效果 */}
                <div className="mb-6">
                  <motion.div
                    className={`w-20 h-20 rounded-sm border-2 ${theme.border} bg-black/80 mx-auto
                               flex items-center justify-center ${theme.shadow}`}
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(204,255,0,0.2)',
                        '0 0 40px rgba(204,255,0,0.4)',
                        '0 0 20px rgba(204,255,0,0.2)',
                      ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <motion.span
                      className={`${theme.text} font-mono text-3xl font-bold`}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      N
                    </motion.span>
                  </motion.div>
                </div>

                {/* 生成中文字 */}
                <motion.p
                  className={`${theme.text} font-mono text-sm tracking-widest mb-2`}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {`> ${t.laboratory.generating}`}
                </motion.p>

                {/* 进度条 */}
                <div className="mt-6 w-48 mx-auto">
                  <div className="h-1 bg-acid/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-acid"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 30, ease: 'linear' }}
                    />
                  </div>
                  <div className={`flex justify-between mt-1 text-[8px] font-mono ${isPro ? 'text-purple-400/50' : 'text-acid/50'}`}>
                    <span>0x00</span>
                    <span>PROCESSING</span>
                    <span>0xFF</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && !isGenerating && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-sm bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" strokeWidth={1.5} />
              </div>
              <p className="text-red-400 font-mono text-sm">{t.laboratory.generationFailed}</p>
              <p className="text-zinc-600 font-mono text-xs mt-1 max-w-xs">{error}</p>
            </motion.div>
          )}

          {/* Result */}
          {generatedImage && !isGenerating && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full h-full flex items-center justify-center p-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generatedImage}
                alt="Generated"
                className="max-w-full max-h-full object-contain rounded-sm shadow-lg shadow-black/50"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TechCard>
  );
}

