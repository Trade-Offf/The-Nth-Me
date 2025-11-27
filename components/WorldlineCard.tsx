'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface WorldlineCardProps {
  id: string;
  name: string;
  code: string;
  description: string;
  imageUrl: string;
  selected: boolean;
  onClick: () => void;
}

export default function WorldlineCard({
  name,
  code,
  description,
  imageUrl,
  selected,
  onClick
}: WorldlineCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-lg cursor-pointer
        transition-all duration-300 min-w-[280px] aspect-[3/4]
        border-2 group
        ${selected
          ? 'border-acid-green shadow-[0_0_30px_rgba(204,255,0,0.5)]'
          : 'border-neutral-800 hover:border-neutral-600'
        }
      `}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className={`
            object-cover transition-all duration-500
            ${selected ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}
          `}
        />
        {/* Dark Gradient Overlay */}
        <div
          className={`
            absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent
            transition-opacity duration-300
            ${selected ? 'opacity-40' : 'opacity-70 group-hover:opacity-40'}
          `}
        />
      </div>

      {/* Timeline Code - Top Left */}
      <div className="absolute top-4 left-4 z-10">
        <span className="font-mono text-xs text-acid-green tracking-wider">
          {code}
        </span>
      </div>

      {/* Content - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="flex items-end justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-1 text-white tracking-tight">
              {name}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Select Icon */}
          <motion.div
            animate={{
              x: selected ? 0 : 10,
              opacity: selected ? 1 : 0.5
            }}
            className={`
              ml-3 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              transition-colors duration-300
              ${selected
                ? 'bg-acid-green text-black'
                : 'bg-neutral-800 text-neutral-400 group-hover:bg-neutral-700'
              }
            `}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>

      {/* Glitch Effect on Selection (Optional) */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.3, 0],
            x: [0, -5, 5, 0]
          }}
          transition={{
            duration: 0.3,
            times: [0, 0.5, 1]
          }}
          className="absolute inset-0 bg-acid-green mix-blend-screen pointer-events-none"
        />
      )}
    </motion.div>
  );
}

