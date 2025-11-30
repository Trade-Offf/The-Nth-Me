'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Copy, Check,
  ImageIcon, Loader2, AlertTriangle
} from 'lucide-react';
import TechCard from '@/components/TechCard';
import { useI18n } from '@/lib/i18n';

interface PreviewPanelProps {
  generatedImage: string | null;
  isGenerating: boolean;
  error: string | null;
  prompt: string;
}

export default function PreviewPanel({
  generatedImage,
  isGenerating,
  error,
  prompt,
}: PreviewPanelProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  // 复制 Prompt
  const handleCopyPrompt = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // 下载图片
  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <TechCard className="p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-mono font-medium text-white uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-acid" />
          {t.laboratory.output}
        </h2>

        {/* Action Buttons */}
        {generatedImage && !isGenerating && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-1.5 px-2 py-1 rounded-sm border border-tech-border
                       text-[10px] font-mono text-zinc-400 hover:text-acid hover:border-acid/50 transition-all"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? t.laboratory.copied : t.laboratory.copyPrompt}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-2 py-1 rounded-sm border border-acid/50 bg-acid/10
                       text-[10px] font-mono text-acid hover:bg-acid hover:text-black transition-all"
            >
              <Download className="w-3 h-3" />
              {t.laboratory.download}
            </button>
          </div>
        )}
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center rounded-sm border border-tech-border bg-tech-bg/50 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {/* Empty State */}
          {!generatedImage && !isGenerating && !error && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-sm bg-tech-bg border border-tech-border flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-zinc-600" strokeWidth={1} />
              </div>
              <p className="text-zinc-500 font-mono text-sm">{t.laboratory.noOutput}</p>
              <p className="text-zinc-600 font-mono text-xs mt-1">{t.laboratory.configureAndRun}</p>
            </motion.div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-sm bg-acid/10 border border-acid/30 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-acid animate-spin" strokeWidth={1.5} />
              </div>
              <p className="text-acid font-mono text-sm">{t.laboratory.generating}</p>
              <p className="text-zinc-600 font-mono text-xs mt-1">{`// QUANTUM COLLAPSE IN PROGRESS`}</p>

              {/* Animated progress bar */}
              <div className="mt-4 w-48 mx-auto h-1 bg-tech-bg rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-acid"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 60, ease: 'linear' }}
                />
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && !isGenerating && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-sm bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" strokeWidth={1.5} />
              </div>
              <p className="text-red-400 font-mono text-sm">{t.laboratory.generationFailed}</p>
              <p className="text-zinc-600 font-mono text-xs mt-1 max-w-xs">{error}</p>
            </motion.div>
          )}

          {/* Result */}
          {generatedImage && !isGenerating && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full h-full flex items-center justify-center p-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generatedImage}
                alt="Generated"
                className="max-w-full max-h-full object-contain rounded-sm shadow-lg shadow-black/50"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TechCard>
  );
}

