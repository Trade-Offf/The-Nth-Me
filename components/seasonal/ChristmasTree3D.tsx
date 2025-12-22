'use client';

import { motion } from 'framer-motion';

export default function ChristmasTree3D() {
  return (
    <motion.div
      className="fixed bottom-4 right-4 z-40 pointer-events-none"
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="relative w-32 h-40">
        {/* 星星 */}
        <motion.div
          className="absolute -top-6 left-1/2 -translate-x-1/2 z-10"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.15, 1],
          }}
          transition={{
            rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="#FFD700"
              stroke="#FFA500"
              strokeWidth="1"
              style={{
                filter: 'drop-shadow(0 0 8px #FFD700) drop-shadow(0 0 12px #FFA500)',
              }}
            />
          </svg>
        </motion.div>

        {/* 树身 - 3层 */}
        {/* 第1层（顶部）*/}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: '25px solid transparent',
            borderRight: '25px solid transparent',
            borderBottom: '35px solid #2D5016',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}
        />

        {/* 第2层（中部）*/}
        <div
          className="absolute top-7 left-1/2 -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: '35px solid transparent',
            borderRight: '35px solid transparent',
            borderBottom: '40px solid #3A6B1F',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}
        />

        {/* 第3层（底部）*/}
        <div
          className="absolute top-14 left-1/2 -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: '45px solid transparent',
            borderRight: '45px solid transparent',
            borderBottom: '45px solid #4A7C2A',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}
        />

        {/* 装饰球 */}
        {/* 红色球 */}
        <motion.div
          className="absolute top-8 left-8 w-3 h-3 rounded-full bg-red-500"
          style={{
            boxShadow: '0 0 8px rgba(239, 68, 68, 0.8), inset -2px -2px 4px rgba(0,0,0,0.3)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            y: [0, -2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0,
          }}
        />

        {/* 金色球 */}
        <motion.div
          className="absolute top-10 right-10 w-3 h-3 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            boxShadow: '0 0 8px rgba(255, 215, 0, 0.8), inset -2px -2px 4px rgba(0,0,0,0.3)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            y: [0, -2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.5,
          }}
        />

        {/* 蓝色球 */}
        <motion.div
          className="absolute top-16 left-12 w-3 h-3 rounded-full bg-blue-400"
          style={{
            boxShadow: '0 0 8px rgba(96, 165, 250, 0.8), inset -2px -2px 4px rgba(0,0,0,0.3)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            y: [0, -2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1,
          }}
        />

        {/* 酸绿色球（品牌色）*/}
        <motion.div
          className="absolute top-18 right-14 w-3 h-3 rounded-full"
          style={{
            background: '#b9ff3a',
            boxShadow: '0 0 10px rgba(185, 255, 58, 0.9), inset -2px -2px 4px rgba(0,0,0,0.2)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            y: [0, -3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1.5,
          }}
        />

        {/* 树干 */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-8 rounded-sm"
          style={{
            background: 'linear-gradient(to bottom, #5D4037, #3E2723)',
            boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.5)',
          }}
        />
      </div>
    </motion.div>
  );
}

