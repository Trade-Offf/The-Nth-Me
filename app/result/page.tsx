'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Download, RotateCcw, ArrowLeft, ShieldCheck, Clock } from 'lucide-react';
import TechCard from '@/components/TechCard';
import Navbar from '@/components/Navbar';
import { useI18n } from '@/lib/i18n';
import { worldlines } from '@/lib/worldlines';

export default function ResultPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedWorldline, setSelectedWorldline] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const uploaded = sessionStorage.getItem('uploadedImage');
    const generated = sessionStorage.getItem('generatedImage');
    const worldline = sessionStorage.getItem('selectedWorldline');

    if (!uploaded || !generated || !worldline) {
      router.push('/portal');
      return;
    }

    setUploadedImage(uploaded);
    setGeneratedImage(generated);
    setSelectedWorldline(worldline);

    // Trigger reveal animation
    setTimeout(() => setRevealed(true), 300);
  }, [router]);

  const worldlineData = worldlines.find((w) => w.id === selectedWorldline);

  const handleDownload = async () => {
    if (!generatedImage) return;

    setIsDownloading(true);
    console.log('[Download] 开始下载图片...');

    try {
      let downloadUrl = generatedImage;

      // 如果是远程 URL，通过代理 API 获取 base64
      if (!generatedImage.startsWith('data:')) {
        console.log('[Download] 远程图片，通过代理下载...');
        const response = await fetch('/api/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl: generatedImage }),
        });

        const result = await response.json();

        if (!result.success || !result.base64) {
          throw new Error(result.error || '下载失败');
        }

        downloadUrl = result.base64;
        console.log('[Download] 代理下载成功');
      }

      // 创建下载链接
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `nth-me-${selectedWorldline}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('[Download] 下载完成');
    } catch (error) {
      console.error('[Download] 下载失败:', error);
      alert('下载失败，请稍后重试');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleTryAgain = () => {
    sessionStorage.clear();
    router.push('/portal');
  };

  if (!generatedImage || !uploadedImage) {
    return null;
  }

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
          className="text-center mb-8"
        >
          <h1 className="text-xl md:text-3xl font-mono font-medium mb-2 text-white uppercase tracking-wide">
            {t.result.title} <span className="text-acid">{t.result.titleHighlight}</span>
          </h1>
          <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-acid/30 rounded-sm bg-acid/5 mb-4">
            <span className="w-2 h-2 rounded-full bg-acid animate-pulse" />
            <span className="font-mono text-xs text-acid uppercase tracking-[0.15em]">
              {t.result.badge}
            </span>
          </div>
          <h2 className="text-lg md:text-2xl font-mono font-bold text-acid mb-2">{worldlineData?.name}</h2>
          <p className="text-zinc-500 text-sm font-mono">{`// ${worldlineData?.description}`}</p>
        </motion.div>

        {/* 左右对比布局 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: revealed ? 1 : 0, scale: revealed ? 1 : 0.95 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <TechCard className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* 原始图片 */}
              <div className="relative">
                <div className="relative aspect-square rounded-sm overflow-hidden bg-tech-bg border border-tech-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={uploadedImage} alt={t.result.originalSample} className="w-full h-full object-cover" />
                  {/* 标签 */}
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 rounded-sm text-[10px] font-mono text-zinc-400 uppercase flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                    {t.result.originalSample}
                  </div>
                </div>
              </div>

              {/* 生成的图片 */}
              <div className="relative">
                <div className="relative aspect-square rounded-sm overflow-hidden bg-tech-bg border border-acid/30">
                  <Image src={generatedImage} alt={t.result.generatedImage} fill className="object-cover" />
                  {/* 标签 */}
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 border border-acid/50 rounded-sm text-[10px] font-mono text-acid uppercase flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse" />
                    {worldlineData?.name}
                  </div>
                  {/* 揭示动效 */}
                  {!revealed && (
                    <motion.div
                      className="absolute inset-0 bg-tech-bg"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 中间箭头指示 */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-10 h-10 rounded-sm bg-tech-card border border-acid/50 flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 text-acid rotate-180" strokeWidth={1.5} />
              </div>
            </div>
          </TechCard>
        </motion.div>

        {/* 隐私提示 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 p-4 rounded-sm bg-tech-card border border-tech-border">
            <div className="flex items-center gap-2 text-green-500">
              <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-xs font-mono">{t.result.privacyNotice}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-tech-border" />
            <div className="flex items-center gap-2 text-amber-500">
              <Clock className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-xs font-mono">{t.result.saveReminder}</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons - 保存图片高亮，再次尝试调暗 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 md:gap-4"
        >
          {/* 保存图片 - 高亮主按钮 */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-6 py-3 rounded-sm bg-acid text-black hover:bg-acid-dim transition-all font-mono text-sm uppercase flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(57,255,20,0.3)]"
          >
            <Download className="w-4 h-4" strokeWidth={1.5} />
            {isDownloading ? t.result.downloading : t.result.saveImage}
          </button>
          {/* 再次尝试 - 次要按钮，调暗 */}
          <button
            onClick={handleTryAgain}
            className="px-6 py-3 rounded-sm border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300 transition-all font-mono text-sm uppercase flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
            {t.result.tryAgain}
          </button>
        </motion.div>
      </div>
    </main>
  );
}
