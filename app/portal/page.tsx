'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Upload, ArrowRight, X, RefreshCw, AlertCircle, Square, Smartphone, Monitor, LogIn, Lock, Flame, Zap } from 'lucide-react';
import TechCard from '@/components/TechCard';
import Navbar from '@/components/Navbar';
import ImageCompareSlider from '@/components/ImageCompareSlider';
import { useI18n } from '@/lib/i18n';
import { worldlines } from '@/lib/worldlines';
import { Worldline, ImageAspectRatio } from '@/lib/types';

// TODO: 后续从用户数据中读取 Pro 状态
// 暂时设置为 false，所有用户都是非 Pro 用户
const USER_HAS_PRO_ACCESS = false;

// 图片尺寸选项配置
const IMAGE_SIZE_OPTIONS: { value: ImageAspectRatio; label: string; icon: React.ReactNode; description: string }[] = [
  { value: '1:1', label: '1:1', icon: <Square className="w-4 h-4" strokeWidth={1.5} />, description: '适合头像、社交媒体' },
  { value: '9:16', label: '9:16', icon: <Smartphone className="w-4 h-4" strokeWidth={1.5} />, description: '适合手机壁纸、故事' },
  { value: '16:9', label: '16:9', icon: <Monitor className="w-4 h-4" strokeWidth={1.5} />, description: '适合桌面壁纸、封面' },
];



/**
 * 世界线选择卡片
 * 显示 Pro 徽章和锁定状态
 */
function WorldlineSelectCard({
  worldline,
  isSelected,
  onSelect,
  hasProAccess,
  localizedName,
}: {
  worldline: Worldline;
  isSelected: boolean;
  onSelect: () => void;
  hasProAccess: boolean;
  localizedName: string;
}) {
  const isPro = worldline.isPro ?? false;
  const isLocked = isPro && !hasProAccess;

  return (
    <button
      onClick={() => {
        if (!isLocked) {
          onSelect();
        }
      }}
      disabled={isLocked}
      className={`
        relative p-2 rounded-sm border transition-all group
        ${isSelected
          ? 'border-acid bg-acid/10'
          : isLocked
            ? 'border-zinc-800 bg-zinc-900/50 cursor-not-allowed opacity-60'
            : 'border-tech-border bg-transparent hover:border-acid/50 hover:bg-acid/5'
        }
      `}
    >
      {/* Pro 徽章 */}
      {isPro && (
        <div className={`
          absolute -top-1.5 -right-1.5 z-10 px-1.5 py-0.5 rounded-sm
          text-[8px] font-mono font-bold uppercase tracking-wider
          ${isLocked
            ? 'bg-zinc-700 text-zinc-400'
            : 'bg-green-500 text-black shadow-[0_0_8px_rgba(34,197,94,0.5)]'
          }
        `}>
          {isLocked ? (
            <Lock className="w-2.5 h-2.5 inline" strokeWidth={2.5} />
          ) : (
            <>
              <Flame className="w-2.5 h-2.5 inline mr-0.5" strokeWidth={2.5} />
              PRO
            </>
          )}
        </div>
      )}

      {/* 缩略图 */}
      <div className="w-full aspect-square rounded-sm overflow-hidden mb-1.5 relative">
        <Image
          src={`/showcase/${worldline.id}/after.png`}
          alt={localizedName}
          fill
          className={`object-cover transition-all ${isLocked ? 'grayscale' : ''}`}
        />
        {/* 锁定遮罩 */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Lock className="w-5 h-5 text-zinc-500" strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* 名称 */}
      <span className={`text-[10px] font-mono line-clamp-1 ${
        isSelected ? 'text-acid' : isLocked ? 'text-zinc-600' : 'text-zinc-500'
      }`}>
        {localizedName}
      </span>
    </button>
  );
}

export default function PortalPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedWorldline, setSelectedWorldline] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentWorldline, setCurrentWorldline] = useState<Worldline | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedImageSize, setSelectedImageSize] = useState<ImageAspectRatio>('1:1');

  const isLoggedIn = status === 'authenticated' && !!session;

  // 从 sessionStorage 读取已选风格
  useEffect(() => {
    const savedWorldlineId = sessionStorage.getItem('selectedWorldline');
    if (savedWorldlineId) {
      setSelectedWorldline(savedWorldlineId);
      const wl = worldlines.find(w => w.id === savedWorldlineId);
      if (wl) setCurrentWorldline(wl);
    }
  }, []);

  // 当选择改变时更新 currentWorldline
  useEffect(() => {
    if (selectedWorldline) {
      const wl = worldlines.find(w => w.id === selectedWorldline);
      if (wl) setCurrentWorldline(wl);
    }
  }, [selectedWorldline]);

  // 自动清除错误提示
  useEffect(() => {
    if (uploadError) {
      const timer = setTimeout(() => setUploadError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadError]);

  // 压缩图片以适应 sessionStorage 限制
  const compressImage = (base64: string, maxWidth = 1024, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // 按比例缩小
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法创建 canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = base64;
    });
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // 清除之前的错误
    setUploadError(null);

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const fileExtension = file.name.toLowerCase().split('.').pop();

    // HEIC/HEIF 格式检测
    if (fileExtension === 'heic' || fileExtension === 'heif' || file.type === 'image/heic' || file.type === 'image/heif') {
      setUploadError('不支持 HEIC/HEIF 格式，请转换为 JPG 或 PNG 后再上传');
      return;
    }

    // 检查 MIME 类型
    if (!validTypes.includes(file.type) && file.type.startsWith('image/')) {
      setUploadError(`不支持 ${file.type.split('/')[1].toUpperCase()} 格式，请使用 JPG、PNG 或 WebP`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('请选择图片文件');
      return;
    }

    // 文件大小限制
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      setUploadError(`图片太大 (${sizeMB}MB)，请选择小于 10MB 的图片`);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      if (!result.startsWith('data:image/')) {
        setUploadError('图片格式解析失败，请尝试其他图片');
        return;
      }

      try {
        // 压缩图片
        const compressed = await compressImage(result, 1024, 0.85);
        setUploadedImage(compressed);
        setUploadError(null);
      } catch {
        setUploadError('图片处理失败，请尝试其他图片');
      }
    };
    reader.onerror = () => setUploadError('文件读取失败，请重试');
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleGenerate = () => {
    if (uploadedImage && selectedWorldline) {
      sessionStorage.removeItem('isGenerating');
      sessionStorage.removeItem('generatedImage');
      sessionStorage.setItem('uploadedImage', uploadedImage);
      sessionStorage.setItem('selectedWorldline', selectedWorldline);
      sessionStorage.setItem('selectedImageSize', selectedImageSize);
      router.push('/generate');
    }
  };

  const canGenerate = uploadedImage && selectedWorldline && isLoggedIn;

  return (
    <main className="min-h-screen bg-tech-bg relative">
      {/* 网格背景 */}
      <div className="fixed inset-0 tech-grid-bg opacity-30" />

      {/* 导航栏 */}
      <Navbar />

      <div className="max-w-6xl mx-auto relative z-10 px-4 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          {/* 标题区域 */}
          <h1 className="text-2xl md:text-4xl font-bold mb-3 text-white uppercase tracking-wide">
            {t.portal.title} <span className="text-acid">{t.portal.titleHighlight}</span>
          </h1>
          <p className="text-zinc-500 font-mono text-sm tracking-wider mb-4">{t.portal.description}</p>

          {/* 状态标签 */}
          <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-acid/30 rounded-sm bg-acid/5">
            <span className="w-2 h-2 rounded-full bg-acid animate-pulse" />
            <span className="font-mono text-xs text-acid uppercase tracking-[0.15em]">
              {t.portal.badge}
            </span>
          </div>
        </motion.div>

        {/* 左右分栏布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* 左侧：上传区域 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TechCard className="p-6 md:p-8 h-full">
              <h2 className="text-lg font-mono font-medium mb-4 flex items-center gap-2 text-white uppercase tracking-wider">
                <Upload className="w-4 h-4 text-acid" strokeWidth={1.5} />
                {t.portal.uploadTitle}
              </h2>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                className="hidden"
              />

              {/* 错误提示 */}
              {uploadError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 rounded-sm bg-red-500/10 border border-red-500/30 flex items-start gap-3"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div className="flex-1">
                    <p className="text-xs text-red-400 font-mono">[ERROR] {uploadError}</p>
                  </div>
                  <button
                    onClick={() => setUploadError(null)}
                    className="text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </motion.div>
              )}

              {!uploadedImage ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative border border-dashed rounded-sm p-8 md:p-10 text-center cursor-pointer
                    transition-all duration-300 overflow-hidden
                    ${isDragging
                      ? 'border-acid bg-acid/10'
                      : uploadError
                        ? 'border-red-500/50 hover:border-red-500/70'
                        : 'border-tech-border hover:border-acid/50 hover:bg-acid/5'}
                  `}
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-sm bg-tech-bg border border-tech-border flex items-center justify-center">
                    <Upload className="w-6 h-6 text-acid" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-mono mb-3 text-zinc-300">{t.portal.uploadHint}</p>
                  <p className="text-xs text-zinc-500 mb-3">{t.portal.uploadFormats}</p>

                  {/* 格式和尺寸限制说明 */}
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-center gap-2 text-zinc-500">
                      <span className="px-2 py-0.5 rounded-sm bg-tech-bg border border-tech-border">JPG</span>
                      <span className="px-2 py-0.5 rounded-sm bg-tech-bg border border-tech-border">PNG</span>
                      <span className="px-2 py-0.5 rounded-sm bg-tech-bg border border-tech-border">WebP</span>
                    </div>
                    <p className="text-zinc-600">最大 10MB · 推荐清晰正脸照</p>
                    <p className="text-red-500/60">⚠️ 不支持 HEIC 格式</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 已上传图片预览 */}
                  <div className="relative aspect-square rounded-sm overflow-hidden bg-tech-bg border border-tech-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={uploadedImage}
                      alt="已上传的照片"
                      className="w-full h-full object-cover"
                    />
                    {/* 删除按钮 */}
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-sm bg-black/70 border border-tech-border
                               flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors text-zinc-400"
                    >
                      <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    {/* 上传成功标识 */}
                    <div className="absolute bottom-3 left-3 px-2 py-1 rounded-sm bg-black/70 border border-acid/50 text-[10px] text-acid font-mono flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse" />
                      样本就绪
                    </div>
                  </div>

                  {/* 重新上传按钮 */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 rounded-sm border border-tech-border bg-transparent
                             text-zinc-500 hover:border-acid/50 hover:text-acid transition-all
                             flex items-center justify-center gap-2 text-xs font-mono uppercase"
                  >
                    <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
                    重新注入样本
                  </button>
                </div>
              )}

              {/* 图片尺寸选择 - 放在左侧容器底部 */}
              <div className="mt-6 pt-5 border-t border-tech-border">
                <p className="text-xs text-zinc-600 mb-3 font-mono uppercase tracking-wider">{t.portal.imageSize}</p>
                <div className="flex gap-2">
                  {IMAGE_SIZE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedImageSize(option.value)}
                      className={`
                        flex-1 flex flex-col items-center gap-1 py-2.5 rounded-sm border transition-all duration-200
                        ${selectedImageSize === option.value
                          ? 'border-acid bg-acid/10 text-acid'
                          : 'border-tech-border bg-transparent text-zinc-500 hover:border-acid/50 hover:text-acid'}
                      `}
                    >
                      <div>
                        {option.icon}
                      </div>
                      <span className="text-[10px] font-mono">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </TechCard>
          </motion.div>

          {/* 右侧：风格选择区域 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TechCard className="p-6 md:p-8 h-full flex flex-col">
              <h2 className="text-lg font-mono font-medium mb-4 text-white uppercase tracking-wider">{t.portal.selectSector}</h2>

              {currentWorldline ? (
                <div className="flex-1 flex flex-col">
                  {/* 已选风格预览 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full bg-acid animate-pulse" />
                      <span className="text-xs text-zinc-500 font-mono uppercase">{t.portal.lockedSector}</span>
                      {/* Pro 徽章 */}
                      {currentWorldline.isPro && (
                        <span className="px-2 py-0.5 rounded-sm bg-green-500/20 text-green-400 text-[10px] font-mono font-bold uppercase border border-green-500/30">
                          <Flame className="w-3 h-3 inline mr-1" strokeWidth={2} />
                          PRO
                        </span>
                      )}
                    </div>
                    <div className={`p-4 rounded-sm ${
                      currentWorldline.isPro
                        ? 'bg-green-500/5 border border-green-500/30'
                        : 'bg-acid/5 border border-acid/30'
                    }`}>
                      <h3 className="text-base font-mono font-medium text-white mb-1">
                        {t.worldlines[currentWorldline.id as keyof typeof t.worldlines]?.name ?? currentWorldline.name}
                      </h3>
                      <p className="text-xs text-zinc-500 mb-3">
                        {t.worldlines[currentWorldline.id as keyof typeof t.worldlines]?.description ?? currentWorldline.description}
                      </p>
                      {/* 迷你对比滑动器 */}
                      <ImageCompareSlider worldlineId={currentWorldline.id} variant="mini" />
                    </div>
                  </div>

                  {/* 切换其他风格 */}
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-xs text-zinc-600 font-mono uppercase">{t.portal.switchSector}:</p>
                      {!USER_HAS_PRO_ACCESS && (
                        <Link
                          href="/pricing"
                          className="text-[10px] text-green-400 font-mono hover:underline"
                        >
                          🔓 {t.portal.unlockPro}
                        </Link>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {worldlines.filter(w => w.id !== selectedWorldline).map((wl) => (
                        <WorldlineSelectCard
                          key={wl.id}
                          worldline={wl}
                          isSelected={false}
                          hasProAccess={USER_HAS_PRO_ACCESS}
                          localizedName={t.worldlines[wl.id as keyof typeof t.worldlines]?.name ?? wl.name}
                          onSelect={() => {
                            setSelectedWorldline(wl.id);
                            sessionStorage.setItem('selectedWorldline', wl.id);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <div className="w-14 h-14 rounded-sm bg-tech-bg border border-tech-border flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-zinc-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-zinc-500 mb-4 font-mono text-sm">{t.portal.noSectorLocked}</p>
                  <Link
                    href="/showcase"
                    className="px-4 py-2 rounded-sm border border-acid/50 text-acid hover:bg-acid hover:text-black
                             transition-all text-xs font-mono uppercase"
                  >
                    {t.portal.browseAllSectors} →
                  </Link>

                  {/* 快速选择 */}
                  <div className="mt-6 w-full">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-zinc-600 font-mono uppercase">{t.portal.quickSelect}:</p>
                      {!USER_HAS_PRO_ACCESS && (
                        <Link
                          href="/pricing"
                          className="flex items-center gap-1 text-[10px] text-green-400 font-mono hover:underline"
                        >
                          <Lock className="w-3 h-3" strokeWidth={2} />
                          {t.portal.unlockProModel}
                        </Link>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {worldlines.map((wl) => (
                        <WorldlineSelectCard
                          key={wl.id}
                          worldline={wl}
                          isSelected={selectedWorldline === wl.id}
                          hasProAccess={USER_HAS_PRO_ACCESS}
                          localizedName={t.worldlines[wl.id as keyof typeof t.worldlines]?.name ?? wl.name}
                          onSelect={() => {
                            setSelectedWorldline(wl.id);
                            sessionStorage.setItem('selectedWorldline', wl.id);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TechCard>
          </motion.div>
        </div>

        {/* 生成按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          {/* 未登录时显示登录提示 */}
          {!isLoggedIn && uploadedImage && selectedWorldline && (
            <div className="mb-4 p-4 rounded-sm bg-acid/5 border border-acid/30 max-w-md mx-auto">
              <p className="text-xs text-zinc-400 mb-3 font-mono">
                <LogIn className="inline w-4 h-4 mr-2" strokeWidth={1.5} />
                {t.portal.loginRequired}
              </p>
              <Link
                href="/login?callbackUrl=/portal"
                className="inline-block px-6 py-2 rounded-sm bg-acid text-black
                         font-mono text-xs uppercase hover:bg-acid-dim transition-all"
              >
                {t.portal.loginBtn}
              </Link>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`
              px-8 py-4 rounded-sm font-mono text-sm uppercase transition-all duration-300
              ${canGenerate
                ? 'bg-acid text-black hover:bg-acid-dim'
                : 'bg-tech-card border border-tech-border text-zinc-600 cursor-not-allowed'}
            `}
          >
            {canGenerate ? (
              <>[{t.portal.generateBtn}] <ArrowRight className="inline ml-2 w-4 h-4" strokeWidth={1.5} /></>
            ) : (
              <>[{t.portal.generateBtn}]</>
            )}
          </button>
        </motion.div>
      </div>
    </main>
  );
}
