'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';

interface WormholeLoaderProps {
  progress: number;
  userImage?: string | null;
  targetWorldline?: string;
}

// 生成随机星星
function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));
}

export default function WormholeLoader({ progress, userImage, targetWorldline }: WormholeLoaderProps) {
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const stars = useMemo(() => generateStars(50), []);

  const loadingSteps = useMemo(() => [
    `> ${t.loader.step1}`,
    `> ${t.loader.step2}`,
    `> ${t.loader.step3}`,
    `> ${t.loader.step4}`,
    `> ${t.loader.step5}`,
  ], [t]);

  useEffect(() => {
    const stepIndex = Math.min(Math.floor(progress / 20), loadingSteps.length - 1);
    setCurrentStep(stepIndex);
  }, [progress]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-8 overflow-hidden bg-tech-bg">
      {/* 网格背景 */}
      <div className="fixed inset-0 tech-grid-bg opacity-30" />

      {/* 星空背景 - 改为酸性绿点 */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-acid"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* 飞向中心的粒子 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const startX = 50 + Math.cos(angle) * 60;
          const startY = 50 + Math.sin(angle) * 60;
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 rounded-sm bg-acid"
              style={{ left: `${startX}%`, top: `${startY}%` }}
              animate={{
                left: ['', '50%'],
                top: ['', '50%'],
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeIn',
              }}
            />
          );
        })}
      </div>

      {/* 虫洞效果 - 改为方形 */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8">
        {/* 扩散波纹 - 方形 */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border border-acid/60 rounded-sm"
            initial={{ scale: 0.3, opacity: 1 }}
            animate={{
              scale: [0.3, 1.2, 1.8],
              opacity: [0.8, 0.4, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* 中心光晕 - 酸性绿 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-40 h-40 md:w-48 md:h-48 rounded-sm bg-acid/20 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* 用户头像（如果有） */}
        {userImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative w-24 h-24 md:w-28 md:h-28 rounded-sm overflow-hidden border border-acid/50"
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 0 20px rgba(204,255,0,0.2)',
                  '0 0 40px rgba(204,255,0,0.4)',
                  '0 0 20px rgba(204,255,0,0.2)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={userImage}
                alt="你的照片"
                className="w-full h-full object-cover"
              />
              {/* 扫描线覆盖 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-acid/20 via-transparent to-acid/20"
                animate={{
                  backgroundPosition: ['0% 0%', '0% 100%', '0% 0%']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>
        )}

        {/* 无头像时的中心点 */}
        {!userImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-8 h-8 rounded-sm bg-acid"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        )}
      </div>

      {/* 目标世界线 */}
      {targetWorldline && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 px-4 py-2 rounded-sm bg-tech-card border border-tech-border font-mono"
        >
          <span className="text-xs text-zinc-500 uppercase">{t.loader.targetSector}:</span>
          <span className="ml-2 text-acid text-sm">{targetWorldline}</span>
        </motion.div>
      )}

      {/* 进度条 */}
      <div className="w-full max-w-md mb-6">
        <div className="h-1 bg-tech-border rounded-sm overflow-hidden relative">
          <motion.div
            className="h-full bg-acid"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
          {/* 流光效果 */}
          <motion.div
            className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ left: ['-20%', '120%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-zinc-500 font-mono uppercase">
          <span>{t.loader.progress}</span>
          <span className="text-acid">{progress}%</span>
        </div>
      </div>

      {/* 状态文字 */}
      <motion.p
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-sm md:text-base text-zinc-400 font-mono text-center"
      >
        {loadingSteps[currentStep]}
      </motion.p>

      {/* 底部状态指示 */}
      <motion.div
        className="mt-6 text-xs text-acid font-mono"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        [ {t.loader.establishing} ]
      </motion.div>
    </div>
  );
}

