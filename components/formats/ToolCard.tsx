'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import type { ToolType } from '@/app/formats/page';
import {
  Image,
  FileImage,
  FileType,
  Film,
  Sparkles,
  Smartphone,
  FileText,
} from 'lucide-react';

const toolIcons: Record<ToolType, React.ReactNode> = {
  webp: <Image className="w-6 h-6" strokeWidth={1.5} />,
  compress: <Sparkles className="w-6 h-6" strokeWidth={1.5} />,
  heic: <Smartphone className="w-6 h-6" strokeWidth={1.5} />,
  pdf2img: <FileImage className="w-6 h-6" strokeWidth={1.5} />,
  img2pdf: <FileText className="w-6 h-6" strokeWidth={1.5} />,
  video2gif: <Film className="w-6 h-6" strokeWidth={1.5} />,
  ico: <FileType className="w-6 h-6" strokeWidth={1.5} />,
};

interface ToolCardProps {
  toolId: ToolType;
  index: number;
  onClick: () => void;
}

export default function ToolCard({ toolId, index, onClick }: ToolCardProps) {
  const { t } = useI18n();
  const tool = t.formats.tools[toolId];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      {/* 卡片容器 */}
      <div className="relative h-full p-6 bg-tech-card border border-tech-border rounded-sm hover:border-acid/50 transition-all duration-300 overflow-hidden">
        {/* 悬停光效 */}
        <div className="absolute inset-0 bg-gradient-to-br from-acid/0 via-acid/0 to-acid/0 group-hover:from-acid/5 group-hover:via-acid/10 group-hover:to-acid/5 transition-all duration-500" />

        {/* 内容 */}
        <div className="relative z-10 flex flex-col h-full">
          {/* 图标 */}
          <div className="mb-4 text-acid group-hover:scale-110 transition-transform duration-300">
            {toolIcons[toolId]}
          </div>

          {/* 工具名称 */}
          <h3 className="font-mono text-base font-medium text-white mb-2 group-hover:text-acid transition-colors">
            {tool.name}
          </h3>

          {/* 描述 */}
          <p className="text-xs text-zinc-500 mb-4 flex-1">
            {tool.desc}
          </p>

          {/* 分类标签 */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">
              {tool.category}
            </span>
            <span className="text-acid text-xs group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </div>

        {/* 顶部角标 */}
        <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-acid/50 group-hover:bg-acid" />
      </div>
    </motion.div>
  );
}

