'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Download, Share2, RotateCcw, ArrowLeft } from 'lucide-react';
import GlowButton from '@/components/GlowButton';
import GlassCard from '@/components/GlassCard';
import { worldlines } from '@/lib/worldlines';

export default function ResultPage() {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedWorldline, setSelectedWorldline] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [revealed, setRevealed] = useState(false);

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

  const worldlineData = worldlines.find(w => w.id === selectedWorldline);

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `nth-me-${selectedWorldline}.jpg`;
      link.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '第 N 个我',
          text: `我在平行宇宙的样子 - ${worldlineData?.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板！');
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
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回首页
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">欢迎来到</span>
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold glow-text mb-4">
            {worldlineData?.name}
          </h2>
          <p className="text-white/70 text-lg">{worldlineData?.description}</p>
        </motion.div>

        {/* Result Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: revealed ? 1 : 0, scale: revealed ? 1 : 0.9 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <GlassCard glow className="p-4 md:p-8">
            <div className="relative w-full max-w-2xl mx-auto aspect-square rounded-2xl overflow-hidden">
              {/* Generated Image */}
              <Image
                src={generatedImage}
                alt="Generated"
                fill
                className="object-cover"
              />

              {/* Comparison Overlay */}
              {isComparing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/80 flex items-center justify-center"
                >
                  <div className="grid grid-cols-2 gap-4 w-full h-full p-4">
                    <div className="relative rounded-lg overflow-hidden">
                      <Image src={uploadedImage} alt="Original" fill className="object-cover" />
                      <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 rounded-full text-sm">
                        原始
                      </div>
                    </div>
                    <div className="relative rounded-lg overflow-hidden">
                      <Image src={generatedImage} alt="Generated" fill className="object-cover" />
                      <div className="absolute bottom-4 right-4 px-3 py-1 bg-cosmic-purple/70 rounded-full text-sm">
                        生成
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Glitch Reveal Effect */}
              {!revealed && (
                <motion.div
                  className="absolute inset-0 bg-cosmic-black"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              )}
            </div>

            {/* Compare Button */}
            <div className="text-center mt-6">
              <button
                onMouseDown={() => setIsComparing(true)}
                onMouseUp={() => setIsComparing(false)}
                onMouseLeave={() => setIsComparing(false)}
                onTouchStart={() => setIsComparing(true)}
                onTouchEnd={() => setIsComparing(false)}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                按住查看对比 👆
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <GlowButton onClick={handleDownload} variant="secondary">
            <Download className="w-5 h-5 mr-2 inline" />
            保存照片
          </GlowButton>
          <GlowButton onClick={handleShare} variant="secondary">
            <Share2 className="w-5 h-5 mr-2 inline" />
            分享给朋友
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

