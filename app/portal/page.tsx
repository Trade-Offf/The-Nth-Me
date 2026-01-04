'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Settings, Image as ImageIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ControlPanel from '@/components/laboratory/ControlPanel';
import PreviewPanel from '@/components/laboratory/PreviewPanel';
import PromptCarousel from '@/components/laboratory/PromptCarousel';
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

  // 移动端 Tab 切换
  const [mobileActiveTab, setMobileActiveTab] = useState<'control' | 'preview'>('control');

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

      <div className="max-w-7xl mx-auto relative z-10 px-4 pt-20 pb-8">
        {/* 移动端 Tab 切换 */}
        <div className="lg:hidden flex mb-4 border border-tech-border rounded-sm overflow-hidden">
          <button
            onClick={() => setMobileActiveTab('control')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 font-mono text-sm uppercase tracking-wider transition-colors ${
              mobileActiveTab === 'control'
                ? 'bg-acid/10 text-acid border-b-2 border-acid'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Settings className="w-5 h-5" />
            {t.laboratory.controlPanel}
          </button>
          <button
            onClick={() => setMobileActiveTab('preview')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 font-mono text-sm uppercase tracking-wider transition-colors ${
              mobileActiveTab === 'preview'
                ? 'bg-acid/10 text-acid border-b-2 border-acid'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            {t.laboratory.output}
          </button>
        </div>

        {/* 主内容区 - 桌面端左右分栏 / 移动端 Tab 切换 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-8rem)]">
          {/* 左侧：控制面板 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`lg:col-span-4 ${
              mobileActiveTab === 'control' ? 'block' : 'hidden lg:block'
            }`}
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
            className={`lg:col-span-8 ${
              mobileActiveTab === 'preview' ? 'block' : 'hidden lg:block'
            }`}
          >
            <PreviewPanel
              model={model}
              generatedImage={generatedImage}
              isGenerating={isGenerating}
              error={error}
              prompt={prompt}
            />
          </motion.div>
        </div>

        {/* 提示词轮播选择器 - 只在图生图模式时显示 */}
        {taskType === 'image-to-image' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <div className="mb-3">
              <h3 className="font-mono text-sm text-zinc-400 uppercase tracking-wider">
                快速选择风格
              </h3>
            </div>
            <PromptCarousel onSelectPrompt={setPrompt} />
          </motion.div>
        )}

        {/* 底部隐私提示 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-zinc-600 font-mono mt-6 pb-2"
        >
          {t.laboratory.privacyNotice}
        </motion.p>
      </div>
    </main>
  );
}
