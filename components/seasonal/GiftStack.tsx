'use client';

import { motion } from 'framer-motion';

export default function GiftStack() {
  return (
    <motion.div
      className="fixed bottom-4 left-4 z-40 pointer-events-none"
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="relative w-28 h-32">
        {/* 后面的礼物 - 蓝色 */}
        <motion.div
          className="absolute bottom-0 right-0 w-16 h-16 rounded-md"
          style={{
            background: 'linear-gradient(135deg, #1976D2, #1565C0)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset -2px -2px 6px rgba(0,0,0,0.2)',
          }}
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: 0.2,
          }}
        >
          {/* 蓝色礼物丝带 - 横向 */}
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-3 rounded-sm"
            style={{
              background: 'linear-gradient(to bottom, #FFD700, #FFA500)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          />
          {/* 蓝色礼物丝带 - 纵向 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-3 rounded-sm"
            style={{
              background: 'linear-gradient(to right, #FFD700, #FFA500)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          />
          {/* 蝴蝶结 */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            />
          </div>
        </motion.div>

        {/* 前面的礼物 - 红色 */}
        <motion.div
          className="absolute bottom-0 left-0 w-18 h-20 rounded-md"
          style={{
            background: 'linear-gradient(135deg, #C62828, #B71C1C)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.4), inset -3px -3px 8px rgba(0,0,0,0.3)',
            width: '72px',
            height: '80px',
          }}
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: 0,
          }}
        >
          {/* 红色礼物丝带 - 横向 */}
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-4 rounded-sm"
            style={{
              background: 'linear-gradient(to bottom, #FFFFFF, #E0E0E0)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          />
          {/* 红色礼物丝带 - 纵向 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-4 rounded-sm"
            style={{
              background: 'linear-gradient(to right, #FFFFFF, #E0E0E0)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          />
          {/* 大蝴蝶结 */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1">
            <div
              className="w-4 h-4 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #FFFFFF, #E0E0E0)',
                boxShadow: '0 3px 6px rgba(0,0,0,0.4)',
              }}
            />
            <div
              className="w-4 h-4 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #FFFFFF, #E0E0E0)',
                boxShadow: '0 3px 6px rgba(0,0,0,0.4)',
              }}
            />
          </div>
        </motion.div>

        {/* 小礼物 - 酸绿色（品牌色）*/}
        <motion.div
          className="absolute top-4 right-2 w-12 h-12 rounded-md"
          style={{
            background: 'linear-gradient(135deg, #b9ff3a, #a0e830)',
            boxShadow: '0 4px 8px rgba(185, 255, 58, 0.4), 0 0 12px rgba(185, 255, 58, 0.3), inset -2px -2px 6px rgba(0,0,0,0.2)',
          }}
          animate={{
            y: [0, -5, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: 0.5,
          }}
        >
          {/* 绿色礼物丝带 */}
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 rounded-sm"
            style={{
              background: 'linear-gradient(to bottom, #E53935, #C62828)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-2 rounded-sm"
            style={{
              background: 'linear-gradient(to right, #E53935, #C62828)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          />
          {/* 小蝴蝶结 */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #E53935, #C62828)',
                boxShadow: '0 2px 3px rgba(0,0,0,0.3)',
              }}
            />
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #E53935, #C62828)',
                boxShadow: '0 2px 3px rgba(0,0,0,0.3)',
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

