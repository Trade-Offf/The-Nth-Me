'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Snowflake {
  id: number;
  left: string;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  color: 'white' | 'green';
  opacity: number;
}

export default function CyberSnowflakes() {
  // 响应式：移动端减少雪花数量
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const snowflakeCount = isMobile ? 6 : 12;

  // 生成六边形雪花：70% 白色 + 30% 绿色
  const snowflakes: Snowflake[] = Array.from({ length: snowflakeCount }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 12 + Math.random() * 8, // 12-20秒
    size: 15 + Math.random() * 20, // 15-35px
    rotation: Math.random() > 0.5 ? 360 : -360,
    color: Math.random() > 0.3 ? 'white' : 'green', // 70% 白 30% 绿
    opacity: 0.4 + Math.random() * 0.4, // 0.4-0.8
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute"
          style={{
            left: flake.left,
            top: '-50px',
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.random() * 100 - 50, 0], // 左右摆动
            rotate: [0, flake.rotation],
            opacity: [0, flake.opacity, flake.opacity, 0],
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: 'linear',
            opacity: {
              times: [0, 0.1, 0.9, 1],
              duration: flake.duration,
            },
          }}
        >
          {/* 六边形雪花 */}
          <div
            className="relative"
            style={{
              width: `${flake.size}px`,
              height: `${flake.size}px`,
            }}
          >
            {/* 方法：使用 clip-path 绘制六边形 */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)',
                background: flake.color === 'green'
                  ? 'rgba(185, 255, 58, 0.2)'
                  : 'rgba(255, 255, 255, 0.2)',
                border: flake.color === 'green'
                  ? '2px solid rgba(185, 255, 58, 0.8)'
                  : '2px solid rgba(255, 255, 255, 0.6)',
                filter: flake.color === 'green'
                  ? 'drop-shadow(0 0 8px rgba(185, 255, 58, 0.6)) drop-shadow(0 0 4px rgba(185, 255, 58, 0.4))'
                  : 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 3px rgba(255, 255, 255, 0.3))',
              }}
            />

            {/* 内部装饰线 */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                color: flake.color === 'green' ? '#b9ff3a' : '#ffffff',
                fontSize: `${flake.size * 0.3}px`,
                opacity: 0.6,
              }}
            >
              <div className="relative">
                {/* 中心点 */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: `${flake.size * 0.15}px`,
                    height: `${flake.size * 0.15}px`,
                    background: flake.color === 'green' ? '#b9ff3a' : '#ffffff',
                    boxShadow: flake.color === 'green'
                      ? '0 0 4px #b9ff3a'
                      : '0 0 4px rgba(255, 255, 255, 0.8)',
                  }}
                />

                {/* 六条线 */}
                {[0, 60, 120, 180, 240, 300].map((angle) => (
                  <div
                    key={angle}
                    className="absolute top-1/2 left-1/2 origin-left"
                    style={{
                      width: `${flake.size * 0.35}px`,
                      height: '1px',
                      background: flake.color === 'green' ? '#b9ff3a' : '#ffffff',
                      transform: `rotate(${angle}deg)`,
                      opacity: 0.4,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

