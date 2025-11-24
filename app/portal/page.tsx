'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Upload, ArrowRight, X } from 'lucide-react';
import Image from 'next/image';
import GlowButton from '@/components/GlowButton';
import GlassCard from '@/components/GlassCard';
import WorldlineCard from '@/components/WorldlineCard';
import { worldlines } from '@/lib/worldlines';

export default function PortalPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedWorldline, setSelectedWorldline] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleGenerate = () => {
    if (uploadedImage && selectedWorldline) {
      // Store data in sessionStorage for the generation page
      sessionStorage.setItem('uploadedImage', uploadedImage);
      sessionStorage.setItem('selectedWorldline', selectedWorldline);
      router.push('/generate');
    }
  };

  const canGenerate = uploadedImage && selectedWorldline;

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">时空传送门</span>
          </h1>
          <p className="text-white/70 text-lg">准备好开启你的平行宇宙之旅了吗？</p>
        </motion.div>

        {/* Step 1: Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full cosmic-gradient flex items-center justify-center font-bold">
              1
            </div>
            <h2 className="text-2xl font-bold">上传现实世界的你</h2>
          </div>

          <GlassCard className="p-8">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            {!uploadedImage ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                  transition-all duration-300
                  ${isDragging 
                    ? 'border-cosmic-purple bg-cosmic-purple/10' 
                    : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                  }
                `}
              >
                <Upload className="w-16 h-16 mx-auto mb-4 text-white/40" />
                <p className="text-xl mb-2">点击上传或拖拽图片到这里</p>
                <p className="text-sm text-white/50">支持 JPG、PNG 格式</p>
              </div>
            ) : (
              <div className="relative">
                <div className="relative w-full max-w-md mx-auto aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src={uploadedImage}
                    alt="Uploaded"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => setUploadedImage(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm
                           flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Step 2: Select Worldline */}
        <AnimatePresence>
          {uploadedImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full cosmic-gradient flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-2xl font-bold">选择你的世界线</h2>
              </div>

              <div className="overflow-x-auto pb-4 -mx-4 px-4">
                <div className="flex gap-6">
                  {worldlines.map((worldline) => (
                    <WorldlineCard
                      key={worldline.id}
                      {...worldline}
                      selected={selectedWorldline === worldline.id}
                      onClick={() => setSelectedWorldline(worldline.id)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate Button */}
        <AnimatePresence>
          {canGenerate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <GlowButton onClick={handleGenerate}>
                生成第 N 个我 <ArrowRight className="inline ml-2" />
              </GlowButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

