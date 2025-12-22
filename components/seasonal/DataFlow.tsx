'use client';

import { motion } from 'framer-motion';

interface Particle {
  id: number;
  delay: number;
  duration: number;
  size: number;
}

export default function DataFlow() {
  // 顶部粒子流
  const topParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: i * 0.4,
    duration: 6 + Math.random() * 3, // 6-9秒
    size: 3 + Math.random() * 2, // 3-5px
  }));

  // 底部粒子流
  const bottomParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
    id: i + 8,
    delay: i * 0.5,
    duration: 7 + Math.random() * 3, // 7-10秒
    size: 3 + Math.random() * 2, // 3-5px
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-60 overflow-hidden">
      {/* 顶部数据流 */}
      <div className="absolute top-0 left-0 right-0 h-2">
        {topParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute top-0 rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: '#b9ff3a',
              boxShadow: '0 0 6px #b9ff3a, 0 0 3px #b9ff3a',
              left: '-10px',
            }}
            animate={{
              x: ['0vw', '110vw'],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'linear',
              opacity: {
                times: [0, 0.1, 0.9, 1],
              },
            }}
          />
        ))}
      </div>

      {/* 底部数据流 */}
      <div className="absolute bottom-0 left-0 right-0 h-2">
        {bottomParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bottom-0 rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: '#b9ff3a',
              boxShadow: '0 0 6px #b9ff3a, 0 0 3px #b9ff3a',
              left: '-10px',
            }}
            animate={{
              x: ['0vw', '110vw'],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'linear',
              opacity: {
                times: [0, 0.1, 0.9, 1],
              },
            }}
          />
        ))}
      </div>

      {/* 顶部装饰线 */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(185, 255, 58, 0.3), transparent)',
        }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 底部装饰线 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(185, 255, 58, 0.3), transparent)',
        }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
      />
    </div>
  );
}

