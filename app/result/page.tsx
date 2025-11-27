'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Download, RotateCcw, ArrowLeft, ShieldCheck, Clock } from 'lucide-react';
import GlowButton from '@/components/GlowButton';
import GlassCard from '@/components/GlassCard';
import { worldlines } from '@/lib/worldlines';

export default function ResultPage() {
  const router = useRouter();
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
    <main className="min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回首页
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            <span className="text-gradient">穿越成功！欢迎来到</span>
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold glow-text mb-2">{worldlineData?.name}</h2>
          <p className="text-white/60 text-base">{worldlineData?.description}</p>
        </motion.div>

        {/* 左右对比布局 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: revealed ? 1 : 0, scale: revealed ? 1 : 0.95 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard glow className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* 原始图片 */}
              <div className="relative">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={uploadedImage} alt="原始照片" className="w-full h-full object-cover" />
                  {/* 标签 */}
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/60" />
                    原始照片
                  </div>
                </div>
              </div>

              {/* 生成的图片 */}
              <div className="relative">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-cosmic-purple/30 shadow-lg shadow-cosmic-purple/20">
                  <Image src={generatedImage} alt="生成的照片" fill className="object-cover" />
                  {/* 标签 */}
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-gradient-to-r from-cosmic-purple to-cosmic-pink backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    {worldlineData?.name}
                  </div>
                  {/* 揭示动效 */}
                  {!revealed && (
                    <motion.div
                      className="absolute inset-0 bg-cosmic-black"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 中间箭头指示 */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-12 h-12 rounded-full bg-cosmic-purple/20 backdrop-blur-sm border border-cosmic-purple/40 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 text-cosmic-purple rotate-180" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* 隐私提示 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-green-400/80">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm">我们不存储任何用户图片</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2 text-amber-400/80">
              <Clock className="w-5 h-5" />
              <span className="text-sm">关闭页面后图片将无法恢复，请及时保存</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 md:gap-4"
        >
          <GlowButton onClick={handleDownload} variant="secondary" disabled={isDownloading}>
            <Download className="w-5 h-5 mr-2 inline" />
            {isDownloading ? '下载中...' : '保存照片'}
          </GlowButton>
          <GlowButton onClick={handleTryAgain}>
            <RotateCcw className="w-5 h-5 mr-2 inline" />
            再试一次
          </GlowButton>
        </motion.div>
      </div>
    </main>
  );
}
