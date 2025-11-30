'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, RefreshCw, AlertCircle,
  Square, Smartphone, Monitor,
  Zap, ImageIcon, Type, LogIn
} from 'lucide-react';
import TechCard from '@/components/TechCard';
import { useI18n } from '@/lib/i18n';
import type { ModelType, TaskType, ImageAspectRatio, ProResolution } from '@/lib/types';
import { CREDITS_STANDARD, CREDITS_PRO } from '@/lib/types';

// 尺寸选项配置
const ASPECT_RATIO_OPTIONS: { value: ImageAspectRatio; label: string; icon: React.ReactNode }[] = [
  { value: '1:1', label: '1:1', icon: <Square className="w-4 h-4" strokeWidth={1.5} /> },
  { value: '9:16', label: '9:16', icon: <Smartphone className="w-4 h-4" strokeWidth={1.5} /> },
  { value: '16:9', label: '16:9', icon: <Monitor className="w-4 h-4" strokeWidth={1.5} /> },
  { value: '4:3', label: '4:3', icon: <Monitor className="w-4 h-4" strokeWidth={1.5} /> },
  { value: '3:4', label: '3:4', icon: <Smartphone className="w-4 h-4" strokeWidth={1.5} /> },
];

// 分辨率选项 (Pro 模式)
const RESOLUTION_OPTIONS: { value: ProResolution; label: string; available: boolean }[] = [
  { value: '1K', label: '1K', available: true },
  { value: '2K', label: '2K', available: true },
  { value: '4K', label: '4K', available: true },
];

interface ControlPanelProps {
  // 状态
  model: ModelType;
  taskType: TaskType;
  prompt: string;
  uploadedImage: string | null;
  aspectRatio: ImageAspectRatio;
  resolution: ProResolution;
  isGenerating: boolean;
  userCredits: number;
  isLoggedIn: boolean;

  // 回调
  onModelChange: (model: ModelType) => void;
  onTaskTypeChange: (taskType: TaskType) => void;
  onPromptChange: (prompt: string) => void;
  onImageUpload: (image: string) => void;
  onImageRemove: () => void;
  onAspectRatioChange: (ratio: ImageAspectRatio) => void;
  onResolutionChange: (resolution: ProResolution) => void;
  onGenerate: () => void;
}

export default function ControlPanel({
  model,
  taskType,
  prompt,
  uploadedImage,
  aspectRatio,
  resolution,
  isGenerating,
  userCredits,
  isLoggedIn,
  onModelChange,
  onTaskTypeChange,
  onPromptChange,
  onImageUpload,
  onImageRemove,
  onAspectRatioChange,
  onResolutionChange,
  onGenerate,
}: ControlPanelProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 主题色配置 - 根据模型切换
  const isPro = model === 'pro';
  const theme = {
    // 主色调
    text: isPro ? 'text-purple-400' : 'text-acid',
    bg: isPro ? 'bg-purple-500/10' : 'bg-acid/10',
    border: isPro ? 'border-purple-500' : 'border-acid',
    borderLight: isPro ? 'border-purple-500/30' : 'border-acid/30',
    // 按钮
    btnBg: isPro ? 'bg-purple-500' : 'bg-acid',
    btnBgHover: isPro ? 'hover:bg-purple-400' : 'hover:bg-acid-dim',
    btnText: isPro ? 'text-white' : 'text-black',
    // focus 状态
    focusBorder: isPro ? 'focus:border-purple-500' : 'focus:border-acid',
    // 拖拽
    dragBorder: isPro ? 'border-purple-500' : 'border-acid',
    dragBg: isPro ? 'bg-purple-500/10' : 'bg-acid/10',
    hoverBorder: isPro ? 'hover:border-purple-500/50' : 'hover:border-acid/50',
    // 悬停文字
    hoverText: isPro ? 'hover:text-purple-400' : 'hover:text-acid',
  };

  // 计算消耗积分
  const creditsNeeded = isPro ? CREDITS_PRO : CREDITS_STANDARD;
  const hasEnoughCredits = userCredits >= creditsNeeded;
  const canGenerate = prompt.trim().length > 0 && 
    (taskType === 'text-to-image' || uploadedImage) &&
    hasEnoughCredits && 
    !isGenerating;

  // 自动清除错误
  useEffect(() => {
    if (uploadError) {
      const timer = setTimeout(() => setUploadError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadError]);

  // 压缩图片
  const compressImage = (base64: string, maxWidth = 1024, quality = 0.85): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas error')); return; }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = base64;
    });
  };

  // 处理文件选择
  const handleFileSelect = async (file: File) => {
    if (!file) return;
    setUploadError(null);

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const fileExtension = file.name.toLowerCase().split('.').pop();

    if (fileExtension === 'heic' || fileExtension === 'heif') {
      setUploadError('HEIC/HEIF not supported. Please convert to JPG/PNG.');
      return;
    }
    if (!validTypes.includes(file.type)) {
      setUploadError(`${file.type.split('/')[1].toUpperCase()} not supported`);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File too large (max 10MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      try {
        const compressed = await compressImage(result);
        onImageUpload(compressed);
      } catch {
        setUploadError('Image processing failed');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  return (
    <TechCard className="p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-mono font-medium text-white uppercase tracking-wider flex items-center gap-2">
          <Zap className={`w-4 h-4 ${theme.text}`} />
          {t.laboratory.controlPanel}
        </h2>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-sm ${theme.bg} border ${theme.borderLight}`}>
          <Zap className={`w-3 h-3 ${theme.text}`} strokeWidth={2} />
          <span className={`text-xs font-mono ${theme.text}`}>{userCredits}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* 1. Model 切换 */}
        <div>
          <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-2 block">
            {t.laboratory.model}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['standard', 'pro'] as ModelType[]).map((m) => (
              <button
                key={m}
                onClick={() => onModelChange(m)}
                className={`
                  px-3 py-2 rounded-sm border text-xs font-mono uppercase transition-all
                  ${model === m
                    ? m === 'pro'
                      ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                      : 'border-acid bg-acid/10 text-acid'
                    : 'border-tech-border bg-transparent text-zinc-500 hover:border-zinc-600'
                  }
                `}
              >
                {m} <span className="text-[10px] opacity-70">({m === 'pro' ? CREDITS_PRO : CREDITS_STANDARD}⚡️)</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Task Type */}
        <div>
          <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-2 block">
            {t.laboratory.taskType}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onTaskTypeChange('text-to-image')}
              className={`
                flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm border text-xs font-mono transition-all
                ${taskType === 'text-to-image'
                  ? `${theme.border} ${theme.bg} ${theme.text}`
                  : 'border-tech-border bg-transparent text-zinc-500 hover:border-zinc-600'
                }
              `}
            >
              <Type className="w-3.5 h-3.5" />
              {t.laboratory.textToImage}
            </button>
            <button
              onClick={() => onTaskTypeChange('image-to-image')}
              className={`
                flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm border text-xs font-mono transition-all
                ${taskType === 'image-to-image'
                  ? `${theme.border} ${theme.bg} ${theme.text}`
                  : 'border-tech-border bg-transparent text-zinc-500 hover:border-zinc-600'
                }
              `}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              {t.laboratory.imageToImage}
            </button>
          </div>
        </div>

        {/* 3. Prompt */}
        <div>
          <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-2 block">
            {t.laboratory.prompt}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={t.laboratory.promptPlaceholder}
            className={`w-full h-24 px-3 py-2 rounded-sm border border-tech-border bg-tech-bg
                     text-sm text-white placeholder:text-zinc-600 font-mono
                     ${theme.focusBorder} focus:outline-none resize-none`}
          />
        </div>

        {/* 4. Image Upload (仅 Image-to-Image) */}
        <AnimatePresence>
          {taskType === 'image-to-image' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-2 block">
                {t.laboratory.referenceImage}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                className="hidden"
              />

              {uploadError && (
                <div className="mb-2 p-2 rounded-sm bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3 text-red-400" />
                  <span className="text-[10px] text-red-400 font-mono">{uploadError}</span>
                  <button onClick={() => setUploadError(null)} className="ml-auto text-red-400/60 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {!uploadedImage ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    border border-dashed rounded-sm p-4 text-center cursor-pointer transition-all
                    ${isDragging ? `${theme.dragBorder} ${theme.dragBg}` : `border-tech-border ${theme.hoverBorder}`}
                  `}
                >
                  <Upload className="w-5 h-5 mx-auto mb-2 text-zinc-500" />
                  <p className="text-[10px] text-zinc-500 font-mono">{t.laboratory.dropOrClick}</p>
                </div>
              ) : (
                <div className="relative rounded-sm overflow-hidden border border-tech-border bg-black/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={uploadedImage}
                    alt="Reference"
                    className="w-full max-h-48 object-contain mx-auto"
                  />
                  <button
                    onClick={onImageRemove}
                    className="absolute top-2 right-2 w-6 h-6 rounded-sm bg-black/70 border border-tech-border
                             flex items-center justify-center hover:border-red-500 text-zinc-400 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`absolute bottom-2 right-2 px-2 py-1 rounded-sm bg-black/70 border border-tech-border
                             text-[10px] font-mono text-zinc-400 ${theme.hoverText} ${theme.hoverBorder} flex items-center gap-1`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    {t.laboratory.replace}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. Aspect Ratio */}
        <div>
          <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-2 block">
            {t.laboratory.aspectRatio}
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {ASPECT_RATIO_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onAspectRatioChange(opt.value)}
                className={`
                  flex items-center gap-1 px-2 py-1.5 rounded-sm border text-[10px] font-mono transition-all
                  ${aspectRatio === opt.value
                    ? `${theme.border} ${theme.bg} ${theme.text}`
                    : 'border-tech-border text-zinc-500 hover:border-zinc-600'
                  }
                `}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Resolution (Pro only) */}
        <AnimatePresence>
          {isPro && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-2 block">
                {t.laboratory.resolution} <span className={theme.text}>({t.laboratory.pro})</span>
              </label>
              <div className="flex gap-1.5">
                {RESOLUTION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onResolutionChange(opt.value)}
                    className={`
                      px-3 py-1.5 rounded-sm border text-[10px] font-mono transition-all
                      ${resolution === opt.value
                        ? `${theme.border} ${theme.bg} ${theme.text}`
                        : 'border-tech-border text-zinc-500 hover:border-zinc-600'
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>


      </div>

      {/* Run Button */}
      <div className="mt-4 pt-4 border-t border-tech-border">
        {!isLoggedIn ? (
          // 未登录 - 显示登录按钮
          <Link
            href="/login?callbackUrl=/portal"
            className={`w-full py-3 rounded-sm font-mono text-sm uppercase transition-all duration-300
                     flex items-center justify-center gap-2
                     ${theme.btnBg} ${theme.btnText} ${theme.btnBgHover}`}
          >
            <LogIn className="w-4 h-4" />
            {t.portal.loginBtn}
          </Link>
        ) : (
          // 已登录 - 显示运行按钮
          <>
            <button
              onClick={onGenerate}
              disabled={!canGenerate}
              className={`
                w-full py-3 rounded-sm font-mono text-sm uppercase transition-all duration-300
                flex items-center justify-center gap-2
                ${canGenerate
                  ? `${theme.btnBg} ${theme.btnText} ${theme.btnBgHover}`
                  : 'bg-tech-card border border-tech-border text-zinc-600 cursor-not-allowed'
                }
              `}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {t.laboratory.generating}
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  {t.laboratory.run} ({creditsNeeded}⚡️)
                </>
              )}
            </button>
            {!hasEnoughCredits && (
              <p className="mt-2 text-center text-[10px] text-red-400 font-mono">
                {t.laboratory.insufficientCredits.replace('{needed}', String(creditsNeeded)).replace('{have}', String(userCredits))}
              </p>
            )}
          </>
        )}
      </div>
    </TechCard>
  );
}

