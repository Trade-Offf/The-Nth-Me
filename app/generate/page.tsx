'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import WormholeLoader from '@/components/WormholeLoader';
import { useI18n } from '@/lib/i18n';
import { worldlines } from '@/lib/worldlines';
import type { GenerateRequest, GenerateResponse, ImageAspectRatio } from '@/lib/types';

export default function GeneratePage() {
  const router = useRouter();
  const { t } = useI18n();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [targetWorldlineName, setTargetWorldlineName] = useState<string>('');
  const hasCalledApi = useRef(false);

  useEffect(() => {
    // 使用 ref 防止重复调用（即使在 React Strict Mode 下）
    if (hasCalledApi.current) {
      console.log('[Generate] 已经调用过 API，跳过');
      return;
    }

    const uploadedImage = sessionStorage.getItem('uploadedImage');
    const selectedWorldline = sessionStorage.getItem('selectedWorldline');
    const selectedImageSize = sessionStorage.getItem('selectedImageSize') as ImageAspectRatio | null;
    const isGeneratingFlag = sessionStorage.getItem('isGenerating');

    // 设置用户头像
    if (uploadedImage) {
      setUserImage(uploadedImage);
    }

    // 设置目标世界线名称
    if (selectedWorldline) {
      const wl = worldlines.find(w => w.id === selectedWorldline);
      if (wl) setTargetWorldlineName(wl.name);
    }

    // 检查是否正在生成中
    if (isGeneratingFlag === 'true') {
      console.log('[Generate] 检测到正在生成中，跳过重复请求');
      return;
    }

    if (!uploadedImage || !selectedWorldline) {
      router.push('/portal');
      return;
    }

    // 标记为已调用
    hasCalledApi.current = true;
    sessionStorage.setItem('isGenerating', 'true');
    console.log('[Generate] 首次调用 API，尺寸:', selectedImageSize || '1:1');

    // 调用真实 API 生成图片
    generateImage(uploadedImage, selectedWorldline, selectedImageSize || '1:1');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateImage = async (image: string, worldlineId: string, imageSize: ImageAspectRatio) => {
    try {
      // 模拟进度：0-90% 匀速增长
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5;
        });
      }, 200); // 每 200ms 增加 5%，约 3.6 秒到达 90%

      // 调用后端 API
      const requestBody: GenerateRequest = {
        image,
        worldlineId,
        imageSize,
      };

      console.log('[Generate] 发送 API 请求...');
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result: GenerateResponse = await response.json();

      // 清除进度模拟
      clearInterval(progressInterval);

      if (!result.success || !result.imageUrl) {
        throw new Error(result.error || '生成失败');
      }

      // 跳到 100%
      setProgress(100);

      // 存储结果并清除生成标志
      sessionStorage.setItem('generatedImage', result.imageUrl);
      sessionStorage.removeItem('isGenerating');

      console.log('[Generate] 生成成功，准备跳转');

      // 延迟跳转，让用户看到 100% 的进度
      setTimeout(() => {
        router.push('/result');
      }, 500);
    } catch (err) {
      console.error('[Generate] 生成失败:', err);
      const errorMessage = err instanceof Error ? err.message : '生成失败，请重试';
      setError(errorMessage);

      // 清除生成标志
      sessionStorage.removeItem('isGenerating');

      // 3 秒后返回 Portal 页面
      setTimeout(() => {
        router.push('/portal');
      }, 3000);
    }
  };

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className="min-h-screen bg-tech-bg flex items-center justify-center px-4 relative">
        <div className="fixed inset-0 tech-grid-bg opacity-30" />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-sm bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-lg font-mono font-medium mb-4 text-red-500">[{t.generate.error}] {t.generate.signalLost}</h2>
          <p className="text-zinc-400 mb-4 font-mono text-sm">{error}</p>
          <p className="text-xs text-zinc-600 font-mono">{`// ${t.generate.returning}`}</p>
        </div>
      </div>
    );
  }

  return (
    <WormholeLoader
      progress={progress}
      userImage={userImage}
      targetWorldline={targetWorldlineName}
    />
  );
}
