'use client';

import { motion } from 'framer-motion';

interface Corner {
  position: string;
  delay: number;
}

export default function CyberScanlines() {
  const corners: Corner[] = [
    { position: 'top-8 left-8', delay: 0 },
    { position: 'top-8 right-8', delay: 1 },
    { position: 'bottom-8 left-8', delay: 2 },
    { position: 'bottom-8 right-8', delay: 3 },
  ];

  return (
    <>
      {corners.map((corner, index) => (
        <div
          key={index}
          className={`fixed ${corner.position} z-55 pointer-events-none`}
        >
          {/* 容器 */}
          <div className="relative w-24 h-24">
            {/* 雷达扫描效果 - 旋转的圆锥渐变 */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(
                  from 0deg,
                  transparent 0%,
                  transparent 70%,
                  rgba(185, 255, 58, 0.4) 85%,
                  rgba(185, 255, 58, 0.8) 95%,
                  rgba(185, 255, 58, 1) 100%
                )`,
              }}
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
                delay: corner.delay,
              }}
            />

            {/* 外圈环 1 - 慢速旋转 */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: '2px solid rgba(185, 255, 58, 0.4)',
              }}
              animate={{
                rotate: [0, 360],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                opacity: { duration: 2, repeat: Infinity, delay: corner.delay },
              }}
            />

            {/* 外圈环 2 - 反向旋转 */}
            <motion.div
              className="absolute inset-2 rounded-full"
              style={{
                border: '1.5px solid rgba(185, 255, 58, 0.3)',
              }}
              animate={{
                rotate: [360, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
                opacity: { duration: 2, repeat: Infinity, delay: corner.delay + 0.5 },
              }}
            />

            {/* 中心脉冲圆 */}
            <motion.div
              className="absolute inset-8 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(185, 255, 58, 0.6), rgba(185, 255, 58, 0.2), transparent)',
                boxShadow: '0 0 20px rgba(185, 255, 58, 0.4), 0 0 40px rgba(185, 255, 58, 0.2)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: corner.delay,
                ease: 'easeInOut',
              }}
            />

            {/* 中心核心点 */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{
                background: '#b9ff3a',
                boxShadow: '0 0 8px #b9ff3a, 0 0 16px #b9ff3a',
              }}
            />

            {/* 扩散波纹 */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: '2px solid rgba(185, 255, 58, 0.6)',
              }}
              animate={{
                scale: [1, 2.5],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: corner.delay,
                ease: 'easeOut',
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
}

