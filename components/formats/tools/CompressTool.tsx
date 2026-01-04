'use client';

import { useState, useCallback } from 'react';
import { Upload, Download } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface CompressedFile {
  name: string;
  originalSize: number;
  compressedSize: number;
  blob: Blob;
  previewUrl: string;
}

type SizePreset = 'original' | '1920' | '1280' | '800' | 'custom';

type SizePresetKey = 'original' | '1920' | '1280' | '800' | 'custom';

export default function CompressTool() {
  const { t } = useI18n();
  
  // 动态获取尺寸预设标签
  const getSizePresets = (): Record<SizePresetKey, { label: string; desc: string }> => ({
    original: { 
      label: t.formats.compress.sizePresets.original, 
      desc: t.formats.compress.sizePresets.originalDesc 
    },
    '1920': { 
      label: t.formats.compress.sizePresets.preset1920, 
      desc: t.formats.compress.sizePresets.preset1920Desc 
    },
    '1280': { 
      label: t.formats.compress.sizePresets.preset1280, 
      desc: t.formats.compress.sizePresets.preset1280Desc 
    },
    '800': { 
      label: t.formats.compress.sizePresets.preset800, 
      desc: t.formats.compress.sizePresets.preset800Desc 
    },
    custom: { 
      label: t.formats.compress.sizePresets.custom, 
      desc: t.formats.compress.sizePresets.customDesc 
    },
  });
  const [files, setFiles] = useState<File[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<CompressedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(0.8);
  const [sizePreset, setSizePreset] = useState<SizePreset>('1920');
  const [customWidth, setCustomWidth] = useState<number | null>(1920);
  const [customHeight, setCustomHeight] = useState<number | null>(null);

  // 处理文件上传
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setCompressedFiles([]);
  }, []);

  // 压缩单个文件
  const compressFile = async (file: File): Promise<CompressedFile> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // 计算目标尺寸
        let targetWidth: number | null = null;
        let targetHeight: number | null = null;

        if (sizePreset === 'original') {
          // 保持原始尺寸
          targetWidth = null;
          targetHeight = null;
        } else if (sizePreset === 'custom') {
          // 自定义尺寸
          targetWidth = customWidth;
          targetHeight = customHeight;
        } else {
          // 预设尺寸
          targetWidth = parseInt(sizePreset);
          targetHeight = null;
        }

        // 计算缩放比例
        if (targetWidth && width > targetWidth) {
          height = (height * targetWidth) / width;
          width = targetWidth;
        }
        if (targetHeight && height > targetHeight) {
          width = (width * targetHeight) / height;
          height = targetHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // 使用高质量缩放
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // 压缩统一转为 JPEG（支持质量参数）
        // PNG 是无损格式，不支持质量参数
        const mimeType = 'image/jpeg';
        const outputName = file.name.replace(/\.(png|webp)$/i, '.jpg').replace(/\.jpe?g$/i, '.jpg');

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Compression failed'));
              return;
            }

            const previewUrl = URL.createObjectURL(blob);

            resolve({
              name: outputName,
              originalSize: file.size,
              compressedSize: blob.size,
              blob,
              previewUrl,
            });
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => reject(new Error('Image load failed'));
      reader.readAsDataURL(file);
    });
  };

  // 批量压缩
  const handleCompress = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const results = await Promise.all(files.map(compressFile));
      setCompressedFiles(results);
    } catch (error) {
      console.error('Compression error:', error);
      alert('压缩失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  // 下载单个文件
  const handleDownload = (file: CompressedFile) => {
    const a = document.createElement('a');
    a.href = file.previewUrl;
    a.download = file.name;
    a.click();
  };

  // 下载全部
  const handleDownloadAll = async () => {
    for (const file of compressedFiles) {
      handleDownload(file);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  // 重置
  const handleReset = () => {
    compressedFiles.forEach((file) => URL.revokeObjectURL(file.previewUrl));
    setFiles([]);
    setCompressedFiles([]);
  };

  // 格式化文件大小
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // 计算节省百分比
  const getSavedPercent = (original: number, compressed: number) => {
    const saved = ((original - compressed) / original) * 100;
    return saved > 0 ? saved.toFixed(1) : '0';
  };

  return (
    <div className="space-y-6">
      {/* 说明 */}
      <div className="p-4 bg-tech-card border border-tech-border rounded-sm">
        <p 
          className="font-mono text-xs text-zinc-400 mb-2"
          dangerouslySetInnerHTML={{ __html: t.formats.compress.description }}
        />
        <p className="font-mono text-xs text-zinc-500">
          {t.formats.compress.tip}
        </p>
      </div>

      {/* 控制面板 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 质量 */}
        <div>
          <label className="block font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">
            {t.formats.modal.quality}
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full accent-acid"
            />
            <div className="flex justify-between text-xs font-mono text-zinc-600">
              <span>10%</span>
              <span className="text-acid">{Math.round(quality * 100)}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* 输出尺寸 */}
        <div className="md:col-span-2">
          <label className="block font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">
            {t.formats.compress.outputSize}
          </label>
          <div className="grid grid-cols-5 gap-2">
            {(Object.keys(getSizePresets()) as SizePresetKey[]).map((preset) => {
              const presets = getSizePresets();
              return (
              <button
                key={preset}
                onClick={() => setSizePreset(preset)}
                className={`px-3 py-2 font-mono text-xs rounded-sm border transition-colors ${
                  sizePreset === preset
                    ? 'bg-acid text-black border-acid'
                    : 'bg-tech-card text-zinc-400 border-tech-border hover:border-acid/50'
                }`}
              >
                <div className="font-medium">{presets[preset].label}</div>
                <div className="text-[10px] text-current opacity-60">{presets[preset].desc}</div>
              </button>
            );
            })}
          </div>
          
          {/* 自定义尺寸输入 */}
          {sizePreset === 'custom' && (
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block font-mono text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
                  {t.formats.compress.maxWidth}
                </label>
                <input
                  type="number"
                  placeholder={t.formats.compress.unlimited}
                  value={customWidth || ''}
                  onChange={(e) => setCustomWidth(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 bg-tech-bg text-white border border-tech-border rounded-sm font-mono text-xs focus:outline-none focus:border-acid transition-colors"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
                  {t.formats.compress.maxHeight}
                </label>
                <input
                  type="number"
                  placeholder={t.formats.compress.unlimited}
                  value={customHeight || ''}
                  onChange={(e) => setCustomHeight(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 bg-tech-bg text-white border border-tech-border rounded-sm font-mono text-xs focus:outline-none focus:border-acid transition-colors"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 文件上传区 */}
      {files.length === 0 && (
        <div className="relative">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-tech-border hover:border-acid/50 rounded-sm p-12 text-center transition-colors">
            <Upload className="w-12 h-12 mx-auto mb-4 text-zinc-600" strokeWidth={1.5} />
            <p className="font-mono text-sm text-zinc-400 mb-2">
              {t.formats.modal.uploadHint}
            </p>
            <p className="font-mono text-xs text-zinc-600">
              {t.formats.modal.supportedFormats || 'JPG / PNG / WebP'}
            </p>
            <p className="font-mono text-xs text-zinc-500 mt-1">
              {t.formats.compress.uniformOutput || '统一输出为 JPEG 格式'}
            </p>
          </div>
        </div>
      )}

      {/* 已选文件列表 */}
      {files.length > 0 && compressedFiles.length === 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-zinc-500">
              {t.formats.modal.filesSelected?.replace('{count}', files.length.toString()) || `已选择 ${files.length} 个文件`}
            </p>
            <button
              onClick={handleReset}
              className="font-mono text-xs text-zinc-500 hover:text-acid transition-colors"
            >
              {t.formats.modal.reselect || '重新选择'}
            </button>
          </div>
          <div className="space-y-2">
            {files.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-tech-card border border-tech-border rounded-sm"
              >
                <span className="font-mono text-xs text-white truncate">{file.name}</span>
                <span className="font-mono text-xs text-zinc-500 ml-4">{formatSize(file.size)}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleCompress}
            disabled={isProcessing}
            className="w-full px-6 py-3 bg-acid text-black font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-acid/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                {t.formats.compress.compressing}...
              </>
            ) : (
              t.formats.compress.startCompression
            )}
          </button>
        </div>
      )}

      {/* 压缩结果 */}
      {compressedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-acid">
              ✓ {t.formats.modal.completed} ({compressedFiles.length})
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadAll}
                className="px-4 py-2 bg-acid text-black font-mono text-xs rounded-sm hover:bg-acid/90 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t.formats.modal.downloadAll}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-tech-card text-zinc-400 border border-tech-border font-mono text-xs rounded-sm hover:border-acid/50 hover:text-acid transition-colors"
              >
                {t.formats.modal.reset}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {compressedFiles.map((file, i) => (
              <div
                key={i}
                className="p-4 bg-tech-card border border-tech-border rounded-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-white truncate">{file.name}</p>
                    {!file.name.match(/\.jpe?g$/i) && (
                      <p className="font-mono text-[10px] text-zinc-600 mt-0.5">→ 已转为 JPG</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDownload(file)}
                    className="ml-4 px-3 py-1 bg-acid/10 text-acid border border-acid/30 font-mono text-xs rounded-sm hover:bg-acid hover:text-black transition-colors flex-shrink-0"
                  >
                    {t.formats.modal.download}
                  </button>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-zinc-500">{formatSize(file.originalSize)}</span>
                  <span className="text-zinc-600">→</span>
                  <span className="text-acid">{formatSize(file.compressedSize)}</span>
                  <span className="ml-auto text-acid">
                    ↓ {getSavedPercent(file.originalSize, file.compressedSize)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

