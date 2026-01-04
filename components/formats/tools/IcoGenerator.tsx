'use client';

import { useState, useCallback } from 'react';
import { Upload, Download } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const ICO_SIZES = [16, 32, 48, 64, 128, 256];

interface GeneratedImage {
  size: number;
  blob: Blob;
  previewUrl: string;
}

export default function IcoGenerator() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 48, 256]);

  // 处理文件上传
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setGeneratedImages([]);
    }
  }, []);

  // 切换尺寸选择
  const toggleSize = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b)
    );
  };

  // 生成指定尺寸的 PNG
  const generatePngAtSize = async (img: HTMLImageElement, size: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, size, size);

      canvas.toBlob((blob) => resolve(blob!), 'image/png');
    });
  };

  // 生成多个尺寸的 PNG 图片
  const handleGenerate = async () => {
    if (!file || selectedSizes.length === 0) return;

    setIsProcessing(true);

    try {
      const img = await loadImage(previewUrl);

      // 生成所有尺寸的 PNG
      const images: GeneratedImage[] = [];
      for (const size of selectedSizes) {
        const blob = await generatePngAtSize(img, size);
        images.push({
          size,
          blob,
          previewUrl: URL.createObjectURL(blob),
        });
      }

      setGeneratedImages(images);
    } catch (error) {
      console.error('Image generation error:', error);
      alert(t.formats.ico.generationFailed);
    } finally {
      setIsProcessing(false);
    }
  };

  // 加载图片
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  // 下载 ZIP 压缩包
  const handleDownload = async () => {
    if (generatedImages.length === 0) return;

    try {
      const zip = new JSZip();
      const folder = zip.folder('icons');

      // 添加所有图片到 zip
      for (const img of generatedImages) {
        const arrayBuffer = await img.blob.arrayBuffer();
        folder?.file(`icon-${img.size}x${img.size}.png`, arrayBuffer);
      }

      // 生成 zip 文件
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // 下载
      saveAs(zipBlob, 'icons.zip');
    } catch (error) {
      console.error('Download error:', error);
      alert(t.formats.ico.downloadFailed);
    }
  };

  // 重置
  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    generatedImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setFile(null);
    setPreviewUrl('');
    setGeneratedImages([]);
  };

  // 格式化文件大小
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* 说明 */}
      <div className="p-4 bg-tech-card border border-tech-border rounded-sm">
        <p className="font-mono text-xs text-zinc-400">
          {t.formats.ico.description}
        </p>
      </div>

      {/* 尺寸选择 */}
      <div>
        <label className="block font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">
          {t.formats.ico.selectSizes}
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {ICO_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-2 font-mono text-xs rounded-sm border transition-colors ${
                selectedSizes.includes(size)
                  ? 'bg-acid text-black border-acid'
                  : 'bg-tech-card text-zinc-400 border-tech-border hover:border-acid/50'
              }`}
            >
              {size}×{size}
            </button>
          ))}
        </div>
      </div>

      {/* 文件上传区 */}
      {!file && (
        <div className="relative">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-tech-border hover:border-acid/50 rounded-sm p-12 text-center transition-colors">
            <Upload className="w-12 h-12 mx-auto mb-4 text-zinc-600" strokeWidth={1.5} />
            <p className="font-mono text-sm text-zinc-400 mb-2">
              {t.formats.modal.uploadHint}
            </p>
            <p className="font-mono text-xs text-zinc-600">
              {t.formats.ico.supportedFormats}
            </p>
          </div>
        </div>
      )}

      {/* 预览和操作 */}
      {file && generatedImages.length === 0 && (
        <div className="space-y-4">
          {/* 预览 */}
          <div className="flex justify-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-xs max-h-64 rounded border border-tech-border"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={isProcessing || selectedSizes.length === 0}
              className="flex-1 px-6 py-3 bg-acid text-black font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-acid/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? t.formats.modal.processing : t.formats.ico.generating}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-tech-card text-zinc-400 border border-tech-border font-mono text-xs rounded-sm hover:border-acid/50 hover:text-acid transition-colors"
            >
              {t.formats.ico.reselect}
            </button>
          </div>

          {selectedSizes.length === 0 && (
            <p className="text-center font-mono text-xs text-red-500">
              {t.formats.ico.selectAtLeastOne}
            </p>
          )}
        </div>
      )}

      {/* 生成完成 */}
      {generatedImages.length > 0 && (
        <div className="space-y-4">
          <div className="p-6 bg-tech-card border border-acid/30 rounded-sm space-y-4">
            <div className="text-center">
              <p className="font-mono text-sm text-acid mb-2">
                ✓ {t.formats.modal.completed}
              </p>
              <p className="font-mono text-xs text-zinc-500">
                {t.formats.ico.generatedCount.replace('{count}', generatedImages.length.toString())}
              </p>
              <p className="font-mono text-xs text-zinc-600 mt-1">
                {t.formats.ico.totalSize.replace('{size}', formatSize(generatedImages.reduce((sum, img) => sum + img.blob.size, 0)))}
              </p>
            </div>

            {/* 预览各尺寸 */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-tech-border">
              {generatedImages.map((img) => (
                <div key={img.size} className="text-center">
                  <img
                    src={img.previewUrl}
                    alt={`${img.size}x${img.size}`}
                    width={img.size}
                    height={img.size}
                    className="border border-tech-border rounded mb-1"
                    style={{ imageRendering: img.size <= 32 ? 'pixelated' : 'auto' }}
                  />
                  <p className="font-mono text-[10px] text-zinc-600">{img.size}×{img.size}</p>
                  <p className="font-mono text-[9px] text-zinc-700">{formatSize(img.blob.size)}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={handleDownload}
                className="px-6 py-2 bg-acid text-black font-mono text-xs rounded-sm hover:bg-acid/90 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t.formats.ico.downloadZip}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-tech-card text-zinc-400 border border-tech-border font-mono text-xs rounded-sm hover:border-acid/50 hover:text-acid transition-colors"
              >
                {t.formats.modal.reset}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

