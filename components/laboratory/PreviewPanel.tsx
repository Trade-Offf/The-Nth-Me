'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Copy, Check,
  ImageIcon, AlertTriangle,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import TechCard from '@/components/TechCard';
import { useI18n } from '@/lib/i18n';

// Matrix 数字雨组件
function MatrixRain() {
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

      ctx.fillStyle = '#CCFF00';
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30"
    />
  );
}

// 图片对比滑块组件
interface DynamicImageCompareSliderProps {
  beforeSrc: string;
  afterSrc: string;
}

function DynamicImageCompareSlider({ beforeSrc, afterSrc }: DynamicImageCompareSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updatePosition(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      updatePosition(e.touches[0].clientX);
    }
  };

  // 全局事件监听（支持拖动时鼠标移出容器）
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => updatePosition(e.clientX);
    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, updatePosition]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-sm overflow-hidden cursor-ew-resize select-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsDragging(false)}
    >
      {/* After 图片（底层 - 生成图） */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={afterSrc} alt="After" className="w-full h-full object-contain" draggable={false} />
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-sm bg-black/70 text-acid font-mono text-xs uppercase">
          After
        </div>
      </div>

      {/* Before 图片（裁剪层 - 原图） */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={beforeSrc} alt="Before" className="w-full h-full object-contain" draggable={false} />
        <div className="absolute bottom-2 left-2 px-2 py-1 rounded-sm bg-black/70 text-zinc-400 font-mono text-xs uppercase">
          Before
        </div>
      </div>

      {/* 滑动条 */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-acid z-10 pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* 滑块手柄 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-8 h-8 rounded-sm bg-tech-card border border-acid flex items-center justify-center">
          <div className="flex gap-0">
            <ChevronLeft className="w-4 h-4 text-acid" strokeWidth={1.5} />
            <ChevronRight className="w-4 h-4 text-acid" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface PreviewPanelProps {
  generatedImage: string | null;
  isGenerating: boolean;
  error: string | null;
  prompt: string;
  uploadedImage?: string | null; // 原图（用于对比）
}

export default function PreviewPanel({
  generatedImage,
  isGenerating,
  error,
  prompt,
  uploadedImage,
}: PreviewPanelProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

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

  // 下载图片 - 使用代理 API 避免 CORS，直接触发浏览器下载
  const handleDownload = () => {
    if (!generatedImage) return;

    // 直接使用 a 标签触发下载，浏览器会自动处理
    const downloadUrl = `/api/download?url=${encodeURIComponent(generatedImage)}`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `nthme-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <TechCard className="p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-mono font-medium text-white uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-acid" />
          {t.laboratory.output}
        </h2>

        {/* Action Buttons */}
        {generatedImage && !isGenerating && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-1.5 px-2 py-1 rounded-sm border border-tech-border
                       text-[10px] font-mono text-zinc-400 hover:text-acid hover:border-acid/50 transition-all"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? t.laboratory.copied : t.laboratory.copyPrompt}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-2 py-1 rounded-sm border border-acid/50 bg-acid/10
                       text-[10px] font-mono text-acid transition-all hover:bg-acid hover:text-black"
            >
              <Download className="w-3 h-3" />
              {t.laboratory.download}
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
              <MatrixRain />

              {/* 中心内容 */}
              <div className="relative z-10 text-center">
                {/* 闪烁的终端光标效果 */}
                <div className="mb-6">
                  <motion.div
                    className="w-20 h-20 rounded-sm border-2 border-acid bg-black/80 mx-auto
                               flex items-center justify-center shadow-[0_0_30px_rgba(204,255,0,0.3)]"
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
                      className="text-acid font-mono text-3xl font-bold"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      N
                    </motion.span>
                  </motion.div>
                </div>

                {/* 生成中文字 */}
                <motion.p
                  className="text-acid font-mono text-sm tracking-widest mb-2"
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
                  <div className="flex justify-between mt-1 text-[8px] font-mono text-acid/50">
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
              {uploadedImage ? (
                // 有原图 - 显示对比滑块
                <DynamicImageCompareSlider
                  beforeSrc={uploadedImage}
                  afterSrc={generatedImage}
                />
              ) : (
                // 无原图 - 显示单张生成图
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="max-w-full max-h-full object-contain rounded-sm shadow-lg shadow-black/50"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TechCard>
  );
}

