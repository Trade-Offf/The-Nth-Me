'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Beaker } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ControlPanel from '@/components/laboratory/ControlPanel';
import PreviewPanel from '@/components/laboratory/PreviewPanel';
import { useI18n } from '@/lib/i18n';
import type { ModelType, TaskType, ImageAspectRatio, ProResolution, GenerateRequest, GenerateResponse } from '@/lib/types';

export default function PortalPage() {
  const { data: session, status } = useSession();
  const { t } = useI18n();

  // Control Panel 状态
  const [model, setModel] = useState<ModelType>('standard');
  const [taskType, setTaskType] = useState<TaskType>('text-to-image');
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>('1:1');
  const [resolution, setResolution] = useState<ProResolution>('1K');

  // Preview Panel 状态
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 用户积分
  const [userCredits, setUserCredits] = useState(0);

  const isLoggedIn = status === 'authenticated' && !!session;

  // 获取用户积分
  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/user/credits')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data?.balance !== undefined) {
            setUserCredits(data.data.balance);
          }
        })
        .catch(console.error);
    }
  }, [isLoggedIn]);

  // 生成图像
  const handleGenerate = useCallback(async () => {
    if (!isLoggedIn) return;

    setIsGenerating(true);
    setError(null);

    try {
      const requestBody: GenerateRequest = {
        model,
        taskType,
        prompt,
        imageSize: aspectRatio,
        resolution: model === 'pro' ? resolution : undefined,
      };

      if (taskType === 'image-to-image' && uploadedImage) {
        requestBody.image = uploadedImage;
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data: GenerateResponse = await response.json();

      if (data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        // 更新积分
        if (data.creditsUsed) {
          setUserCredits(prev => prev - data.creditsUsed!);
          // 触发全局事件，通知 UserMenu 刷新积分
          window.dispatchEvent(new CustomEvent('credits-updated'));
        }
      } else {
        setError(data.error || 'Generation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  }, [isLoggedIn, model, taskType, prompt, aspectRatio, resolution, uploadedImage]);

  return (
    <main className="min-h-screen bg-tech-bg relative">
      {/* 网格背景 */}
      <div className="fixed inset-0 tech-grid-bg opacity-30" />

      {/* 导航栏 */}
      <Navbar />

      <div className="max-w-7xl mx-auto relative z-10 px-4 pt-20 pb-8 h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Beaker className="w-6 h-6 text-acid" strokeWidth={1.5} />
            <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">
              THE <span className="text-acid">LABORATORY</span>
            </h1>
          </div>
          <p className="text-zinc-500 font-mono text-xs tracking-wider">
            {`// FREE GENERATION MODE · STANDARD & PRO MODELS`}
          </p>
        </motion.div>

        {/* 主内容区 - 左右分栏 */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
          {/* 左侧：控制面板 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 min-h-0 overflow-hidden"
          >
            <ControlPanel
              model={model}
              taskType={taskType}
              prompt={prompt}
              uploadedImage={uploadedImage}
              aspectRatio={aspectRatio}
              resolution={resolution}
              isGenerating={isGenerating}
              userCredits={userCredits}
              isLoggedIn={isLoggedIn}
              onModelChange={setModel}
              onTaskTypeChange={setTaskType}
              onPromptChange={setPrompt}
              onImageUpload={setUploadedImage}
              onImageRemove={() => setUploadedImage(null)}
              onAspectRatioChange={setAspectRatio}
              onResolutionChange={setResolution}
              onGenerate={handleGenerate}
            />
          </motion.div>

          {/* 右侧：预览面板 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 min-h-0"
          >
            <PreviewPanel
              generatedImage={generatedImage}
              isGenerating={isGenerating}
              error={error}
              prompt={prompt}
            />
          </motion.div>
        </div>

        {/* 底部隐私提示 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-[10px] text-zinc-600 font-mono mt-4 pb-2"
        >
          {t.laboratory.privacyNotice}
        </motion.p>
      </div>
    </main>
  );
}
