'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface WorldlineCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  selected: boolean;
  onClick: () => void;
}

export default function WorldlineCard({ 
  name, 
  description, 
  imageUrl, 
  selected, 
  onClick 
}: WorldlineCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl cursor-pointer
        transition-all duration-300 min-w-[280px]
        ${selected 
          ? 'ring-4 ring-cosmic-purple shadow-2xl shadow-cosmic-purple/50' 
          : 'ring-1 ring-white/20 hover:ring-white/40'
        }
      `}
    >
      {/* Image */}
      <div className="relative h-80 w-full">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-2xl font-bold mb-2 glow-text">{name}</h3>
        <p className="text-sm text-white/70">{description}</p>
      </div>

      {/* Selected Indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full cosmic-gradient flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}

