'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, ArrowLeftRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

type ConversionDirection = 'toWebP' | 'fromWebP';
type QualityPreset = 'high' | 'balanced' | 'compressed';

const qualityValues: Record<QualityPreset, number> = {
  high: 0.9,
  balanced: 0.8,
  compressed: 0.6,
};

interface ConvertedFile {
  name: string;
  originalSize: number;
  convertedSize: number;
  blob: Blob;
  previewUrl: string;
}

export default function WebPConverter() {
  const { t } = useI18n();
  const [direction, setDirection] = useState<ConversionDirection>('toWebP');
  const [quality, setQuality] = useState<QualityPreset>('balanced');
  const [files, setFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // 处理文件上传
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setConvertedFiles([]);
  }, []);

  // 转换单个文件
  const convertFile = async (file: File): Promise<ConvertedFile> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0);

        // 确定输出格式
        const outputFormat = direction === 'toWebP' ? 'image/webp' : 'image/jpeg';
        const outputExt = direction === 'toWebP' ? 'webp' : 'jpg';
        const qualityValue = qualityValues[quality];

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Conversion failed'));
              return;
            }

            const originalName = file.name.replace(/\.[^.]+$/, '');
            const newName = `${originalName}.${outputExt}`;
            const previewUrl = URL.createObjectURL(blob);

            resolve({
              name: newName,
              originalSize: file.size,
              convertedSize: blob.size,
              blob,
              previewUrl,
            });
          },
          outputFormat,
          qualityValue
        );
      };

      img.onerror = () => reject(new Error('Image load failed'));
      reader.readAsDataURL(file);
    });
  };

  // 批量转换
  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const results = await Promise.all(files.map(convertFile));
      setConvertedFiles(results);
    } catch (error) {
      console.error('Conversion error:', error);
      alert('转换失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  // 下载单个文件
  const handleDownload = (file: ConvertedFile) => {
    const a = document.createElement('a');
    a.href = file.previewUrl;
    a.download = file.name;
    a.click();
  };

  // 下载全部
  const handleDownloadAll = async () => {
    for (const file of convertedFiles) {
      handleDownload(file);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  // 重置
  const handleReset = () => {
    convertedFiles.forEach((file) => URL.revokeObjectURL(file.previewUrl));
    setFiles([]);
    setConvertedFiles([]);
  };

  // 格式化文件大小
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // 计算节省百分比
  const getSavedPercent = (original: number, converted: number) => {
    const saved = ((original - converted) / original) * 100;
    return saved > 0 ? `↓ ${saved.toFixed(1)}%` : `↑ ${Math.abs(saved).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* 说明 */}
      <div className="p-4 bg-tech-card border border-tech-border rounded-sm">
        <p 
          className="font-mono text-xs text-zinc-400 mb-2"
          dangerouslySetInnerHTML={{ __html: t.formats.webp.description || '<span class="text-acid">WebP 转换器</span>：现代 Web 格式，支持双向转换。' }}
        />
        <p className="font-mono text-xs text-zinc-500">
          {t.formats.webp.tip || '💡 WebP 比 JPEG 更高效，适合网页加载。'}
        </p>
      </div>

      {/* 控制面板 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 转换方向 */}
        <div>
          <label className="block font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">
            {t.formats.webp.direction}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDirection('toWebP')}
              className={`px-4 py-2 font-mono text-xs rounded-sm border transition-colors ${
                direction === 'toWebP'
                  ? 'bg-acid text-black border-acid'
                  : 'bg-tech-card text-zinc-400 border-tech-border hover:border-acid/50'
              }`}
            >
              {t.formats.webp.toWebP}
            </button>
            <button
              onClick={() => setDirection('fromWebP')}
              className={`px-4 py-2 font-mono text-xs rounded-sm border transition-colors ${
                direction === 'fromWebP'
                  ? 'bg-acid text-black border-acid'
                  : 'bg-tech-card text-zinc-400 border-tech-border hover:border-acid/50'
              }`}
            >
              {t.formats.webp.fromWebP}
            </button>
          </div>
        </div>

        {/* 质量预设 */}
        <div>
          <label className="block font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">
            {t.formats.webp.qualityPreset}
          </label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value as QualityPreset)}
            className="w-full px-4 py-2 bg-tech-card text-white border border-tech-border rounded-sm font-mono text-xs focus:outline-none focus:border-acid transition-colors"
          >
            <option value="high">{t.formats.webp.highQuality}</option>
            <option value="balanced">{t.formats.webp.balanced}</option>
            <option value="compressed">{t.formats.webp.compressed}</option>
          </select>
        </div>
      </div>

      {/* 文件上传区 */}
      {files.length === 0 && (
        <div className="relative">
          <input
            type="file"
            accept={direction === 'toWebP' ? 'image/jpeg,image/png' : 'image/webp'}
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
              {direction === 'toWebP' ? 'JPG / PNG' : 'WebP'} · {t.formats.modal.uploadHintMulti}
            </p>
          </div>
        </div>
      )}

      {/* 已选文件列表 */}
      {files.length > 0 && convertedFiles.length === 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-zinc-500">
              {t.formats.modal.filesSelected?.replace('{count}', files.length.toString()) || `已选择 ${files.length} 个文件`}
            </p>
            <button
              onClick={handleReset}
              className="font-mono text-xs text-zinc-500 hover:text-acid transition-colors"
            >
              重新选择
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
            onClick={handleConvert}
            disabled={isProcessing}
            className="w-full px-6 py-3 bg-acid text-black font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-acid/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                {t.formats.modal.processing}
              </>
            ) : (
              <>
                <ArrowLeftRight className="w-4 h-4" />
                {t.formats.webp.startConversion || '开始转换'}
              </>
            )}
          </button>
        </div>
      )}

      {/* 转换结果 */}
      {convertedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-acid">
              ✓ {t.formats.modal.completed} ({convertedFiles.length})
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadAll}
                className="px-4 py-2 bg-acid text-black font-mono text-xs rounded-sm hover:bg-acid/90 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                下载全部
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
            {convertedFiles.map((file, i) => (
              <div
                key={i}
                className="p-4 bg-tech-card border border-tech-border rounded-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-white truncate flex-1">{file.name}</span>
                  <button
                    onClick={() => handleDownload(file)}
                    className="ml-4 px-3 py-1 bg-acid/10 text-acid border border-acid/30 font-mono text-xs rounded-sm hover:bg-acid hover:text-black transition-colors"
                  >
                    {t.formats.modal.download}
                  </button>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-zinc-500">
                    {t.formats.webp.originalSize}: {formatSize(file.originalSize)}
                  </span>
                  <span className="text-zinc-600">→</span>
                  <span className="text-acid">
                    {t.formats.webp.convertedSize}: {formatSize(file.convertedSize)}
                  </span>
                  <span
                    className={`ml-auto ${
                      file.convertedSize < file.originalSize ? 'text-acid' : 'text-orange-500'
                    }`}
                  >
                    {getSavedPercent(file.originalSize, file.convertedSize)}
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

