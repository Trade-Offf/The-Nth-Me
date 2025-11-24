'use client';

import { motion } from 'framer-motion';

export default function AiCoreVisual() {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      {/* Floating Container */}
      <motion.div
        className="relative w-[400px] h-[400px]"
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Outer Ring 1 - Rotating Clockwise */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-cyan-500/30"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-cyan-400 rounded-full -translate-x-1/2 shadow-lg shadow-cyan-500/50" />
        </motion.div>

        {/* Outer Ring 2 - Rotating Counter-Clockwise */}
        <motion.div
          className="absolute inset-8 rounded-full border-2 border-purple-500/40"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-purple-400 rounded-full shadow-lg shadow-purple-500/50" />
        </motion.div>

        {/* Middle Ring - Rotating Clockwise */}
        <motion.div
          className="absolute inset-16 rounded-full border-2 border-blue-500/50"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full -translate-x-1/2 shadow-lg shadow-blue-500/50" />
        </motion.div>

        {/* Inner Ring - Rotating Counter-Clockwise */}
        <motion.div
          className="absolute inset-24 rounded-full border-2 border-teal-500/60"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="absolute top-1/2 right-0 w-1.5 h-1.5 bg-teal-400 rounded-full -translate-y-1/2 shadow-lg shadow-teal-500/50" />
        </motion.div>

        {/* Core - Pulsing Glow */}
        <motion.div
          className="absolute inset-32 rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-blue-600 shadow-2xl"
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 60px rgba(6, 182, 212, 0.6), 0 0 120px rgba(168, 85, 247, 0.4)',
              '0 0 80px rgba(6, 182, 212, 0.8), 0 0 160px rgba(168, 85, 247, 0.6)',
              '0 0 60px rgba(6, 182, 212, 0.6), 0 0 120px rgba(168, 85, 247, 0.4)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Inner Core Glow */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
          
          {/* Center Dot */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Orbiting Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-cyan-300 rounded-full"
            style={{
              transformOrigin: '0 0',
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              rotate: {
                duration: 8 + i * 0.5,
                repeat: Infinity,
                ease: 'linear',
              },
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              },
              opacity: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              },
            }}
            initial={{
              x: 150 * Math.cos((i * Math.PI * 2) / 8),
              y: 150 * Math.sin((i * Math.PI * 2) / 8),
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

