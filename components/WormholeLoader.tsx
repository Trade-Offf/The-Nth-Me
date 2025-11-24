'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const loadingSteps = [
  '正在定位时空坐标...',
  '解析面部特征...',
  '穿越维度壁垒...',
  '重构分子结构...',
  '即将抵达平行宇宙...',
];

interface WormholeLoaderProps {
  progress: number;
}

export default function WormholeLoader({ progress }: WormholeLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepIndex = Math.min(Math.floor(progress / 20), loadingSteps.length - 1);
    setCurrentStep(stepIndex);
  }, [progress]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      {/* Wormhole Visual Effect */}
      <div className="relative w-64 h-64 mb-12">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-2 border-cosmic-purple rounded-full"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ 
              scale: [0, 1.5, 2],
              opacity: [1, 0.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut"
            }}
          />
        ))}
        
        {/* Center Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-32 h-32 rounded-full bg-cosmic-purple/30 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full cosmic-gradient"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="mt-2 text-right text-sm text-white/60 font-mono">
          {progress}%
        </div>
      </div>

      {/* Loading Text */}
      <motion.p
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-xl text-white/80 font-mono text-center"
      >
        {loadingSteps[currentStep]}
      </motion.p>

      {/* Glitch Effect */}
      <motion.div
        className="mt-8 text-sm text-cosmic-teal font-mono"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        [ QUANTUM PROCESSING ]
      </motion.div>
    </div>
  );
}

