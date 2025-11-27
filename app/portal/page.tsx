'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Upload, ArrowRight, X, RefreshCw, ChevronLeft, ChevronRight, AlertCircle, Square, Smartphone, Monitor, LogIn } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { worldlines } from '@/lib/worldlines';
import { Worldline, ImageAspectRatio } from '@/lib/types';

// 图片尺寸选项配置
const IMAGE_SIZE_OPTIONS: { value: ImageAspectRatio; label: string; icon: React.ReactNode; description: string }[] = [
  { value: '1:1', label: '正方形', icon: <Square className="w-4 h-4" />, description: '适合头像、社交媒体' },
  { value: '9:16', label: '人像', icon: <Smartphone className="w-4 h-4" />, description: '适合手机壁纸、故事' },
  { value: '16:9', label: '横屏', icon: <Monitor className="w-4 h-4" />, description: '适合桌面壁纸、封面' },
];

/**
 * 迷你图片对比滑动器（用于风格预览）
 */
function MiniCompareSlider({ worldlineId }: { worldlineId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const beforeSrc = `/showcase/${worldlineId}/before.png`;
  const afterSrc = `/showcase/${worldlineId}/after.png`;

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
      className="relative w-full aspect-square rounded-xl overflow-hidden cursor-ew-resize select-none"
      onMouseDown={handleMouseDown}
      onTouchStart={(e) => { setIsDragging(true); updatePosition(e.touches[0].clientX); }}
      onTouchMove={(e) => isDragging && updatePosition(e.touches[0].clientX)}
      onTouchEnd={() => setIsDragging(false)}
    >
      <div className="absolute inset-0">
        <Image src={afterSrc} alt="After" fill className="object-cover" draggable={false} />
        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/50 text-[10px] text-white/80">After</div>
      </div>
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
        <Image src={beforeSrc} alt="Before" fill className="object-cover" draggable={false} />
        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/50 text-[10px] text-white/80">Before</div>
      </div>
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10 pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center">
          <div className="flex gap-0">
            <ChevronLeft className="w-3 h-3 text-gray-600" />
            <ChevronRight className="w-3 h-3 text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortalPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
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
    <main className="min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <Link href="/" className="inline-block mb-4 text-white/60 hover:text-white transition-colors text-sm">
            ← 返回首页
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            <span className="text-gradient">时空传送门</span>
          </h1>
          <p className="text-white/60 text-base md:text-lg">上传照片，选择风格，开启你的平行宇宙之旅</p>
        </motion.div>

        {/* 左右分栏布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* 左侧：上传区域 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6 md:p-8 h-full">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-cosmic-purple" />
                上传你的照片
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
                  className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-300">{uploadError}</p>
                  </div>
                  <button
                    onClick={() => setUploadError(null)}
                    className="text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
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
                    relative border-2 border-dashed rounded-2xl p-8 md:p-10 text-center cursor-pointer
                    transition-all duration-300 overflow-hidden
                    ${isDragging
                      ? 'border-cosmic-purple bg-cosmic-purple/10'
                      : uploadError
                        ? 'border-red-500/50 hover:border-red-500/70'
                        : 'border-white/20 hover:border-cosmic-purple/50 hover:bg-white/5'}
                  `}
                >
                  {/* 渐变边框效果 */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-fuchsia-500/20 to-indigo-500/20 opacity-0 hover:opacity-100 transition-opacity -z-10" />

                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/30 to-indigo-500/30 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white/60" />
                  </div>
                  <p className="text-lg font-medium mb-3 text-white/90">点击上传或拖拽图片</p>

                  {/* 格式和尺寸限制说明 */}
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center justify-center gap-2 text-white/50">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-xs">JPG</span>
                      <span className="px-2 py-0.5 rounded bg-white/10 text-xs">PNG</span>
                      <span className="px-2 py-0.5 rounded bg-white/10 text-xs">WebP</span>
                    </div>
                    <p className="text-white/40 text-xs">最大 10MB · 建议清晰的正面人像照</p>
                    <p className="text-red-400/60 text-xs">⚠️ 不支持 iPhone 的 HEIC 格式</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 已上传图片预览 */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={uploadedImage}
                      alt="已上传的照片"
                      className="w-full h-full object-cover"
                    />
                    {/* 删除按钮 */}
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm
                               flex items-center justify-center hover:bg-red-500/80 transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                    {/* 上传成功标识 */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-green-500/80 backdrop-blur-sm text-xs text-white flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      已准备就绪
                    </div>
                  </div>

                  {/* 重新上传按钮 */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5
                             text-white/70 hover:bg-white/10 hover:text-white transition-all
                             flex items-center justify-center gap-2 text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    更换照片
                  </button>
                </div>
              )}

              {/* 图片尺寸选择 - 放在左侧容器底部 */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-sm text-white/60 mb-3">生成图片尺寸</p>
                <div className="flex gap-2">
                  {IMAGE_SIZE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedImageSize(option.value)}
                      className={`
                        flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all duration-200
                        ${selectedImageSize === option.value
                          ? 'border-cosmic-purple bg-cosmic-purple/20 text-white'
                          : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}
                      `}
                    >
                      <div className={`${selectedImageSize === option.value ? 'text-cosmic-purple' : ''}`}>
                        {option.icon}
                      </div>
                      <span className="text-xs font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* 右侧：风格选择区域 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6 md:p-8 h-full flex flex-col">
              <h2 className="text-xl font-bold mb-4">选择风格</h2>

              {currentWorldline ? (
                <div className="flex-1 flex flex-col">
                  {/* 已选风格预览 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-sm text-white/60">已选择风格</span>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-cosmic-purple/30">
                      <h3 className="text-lg font-bold text-white mb-1">{currentWorldline.name}</h3>
                      <p className="text-sm text-white/60 mb-3">{currentWorldline.description}</p>
                      {/* 迷你对比滑动器 */}
                      <MiniCompareSlider worldlineId={currentWorldline.id} />
                    </div>
                  </div>

                  {/* 切换其他风格 */}
                  <div className="mt-auto">
                    <p className="text-sm text-white/40 mb-3">或选择其他风格：</p>
                    <div className="grid grid-cols-3 gap-2">
                      {worldlines.filter(w => w.id !== selectedWorldline).map((wl) => (
                        <button
                          key={wl.id}
                          onClick={() => {
                            setSelectedWorldline(wl.id);
                            sessionStorage.setItem('selectedWorldline', wl.id);
                          }}
                          className="p-2 rounded-xl border border-white/10 bg-white/5
                                   hover:border-cosmic-purple/50 hover:bg-white/10 transition-all
                                   text-center"
                        >
                          <div className="w-full aspect-square rounded-lg overflow-hidden mb-1.5 relative">
                            <Image
                              src={`/showcase/${wl.id}/after.png`}
                              alt={wl.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-xs text-white/70 line-clamp-1">{wl.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <RefreshCw className="w-8 h-8 text-white/30" />
                  </div>
                  <p className="text-white/50 mb-4">尚未选择风格</p>
                  <Link
                    href="/showcase"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20
                             border border-cosmic-purple/30 text-cosmic-purple hover:bg-purple-500/30
                             transition-all text-sm"
                  >
                    浏览所有风格 →
                  </Link>

                  {/* 快速选择 */}
                  <div className="mt-6 w-full">
                    <p className="text-sm text-white/40 mb-3">快速选择：</p>
                    <div className="grid grid-cols-3 gap-2">
                      {worldlines.map((wl) => (
                        <button
                          key={wl.id}
                          onClick={() => {
                            setSelectedWorldline(wl.id);
                            sessionStorage.setItem('selectedWorldline', wl.id);
                          }}
                          className="p-2 rounded-xl border border-white/10 bg-white/5
                                   hover:border-cosmic-purple/50 hover:bg-white/10 transition-all"
                        >
                          <div className="w-full aspect-square rounded-lg overflow-hidden mb-1.5 relative">
                            <Image
                              src={`/showcase/${wl.id}/after.png`}
                              alt={wl.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-xs text-white/70 line-clamp-1">{wl.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
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
            <div className="mb-4 p-4 rounded-xl bg-cosmic-purple/10 border border-cosmic-purple/30 max-w-md mx-auto">
              <p className="text-sm text-white/70 mb-3">
                <LogIn className="inline w-4 h-4 mr-2" />
                登录后即可生成图像
              </p>
              <Link
                href="/login?callbackUrl=/portal"
                className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500
                         text-white font-medium text-sm shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all"
              >
                立即登录
              </Link>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`
              px-8 py-4 rounded-full text-lg font-medium transition-all duration-300
              ${canGenerate
                ? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 text-white shadow-[0_0_30px_rgba(192,132,252,0.5)] hover:shadow-[0_0_50px_rgba(192,132,252,0.7)] hover:scale-105'
                : 'bg-white/10 text-white/30 cursor-not-allowed'}
            `}
          >
            {canGenerate ? (
              <>生成第 N 个我 <ArrowRight className="inline ml-2 w-5 h-5" /></>
            ) : (
              <>请上传照片并选择风格</>
            )}
          </button>

          {!canGenerate && (
            <p className="mt-3 text-sm text-white/40">
              {!uploadedImage
                ? '👆 请先上传你的照片'
                : !selectedWorldline
                  ? '👆 请选择一个风格'
                  : !isLoggedIn
                    ? '👆 请先登录'
                    : ''}
            </p>
          )}
        </motion.div>
      </div>
    </main>
  );
}
