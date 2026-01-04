'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, GripVertical, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { jsPDF } from 'jspdf';

type PageSize = 'a4' | 'letter' | 'auto';

interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
}

export default function Img2PdfConverter() {
  const { t } = useI18n();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  // 处理文件上传
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ImageFile[] = files.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    setPdfBlob(null);
  }, []);

  // 删除图片
  const handleRemove = (id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) URL.revokeObjectURL(image.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  };

  // 拖拽排序
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/html'));
    if (dragIndex === dropIndex) return;

    setImages((prev) => {
      const newImages = [...prev];
      const [draggedImage] = newImages.splice(dragIndex, 1);
      newImages.splice(dropIndex, 0, draggedImage);
      return newImages;
    });
  };

  // 生成 PDF
  const handleGenerate = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);

    try {
      // 创建 PDF (portrait 竖版)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: pageSize === 'auto' ? 'a4' : pageSize,
      });

      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        // 加载图片
        const img = await loadImage(image.previewUrl);

        // 计算页面尺寸
        let pageWidth: number, pageHeight: number;

        if (pageSize === 'auto') {
          // 自动尺寸：根据图片比例
          const aspectRatio = img.width / img.height;
          if (aspectRatio > 1) {
            // 横图
            pageWidth = 297; // A4 横向宽度
            pageHeight = pageWidth / aspectRatio;
          } else {
            // 竖图
            pageHeight = 297; // A4 竖向高度
            pageWidth = pageHeight * aspectRatio;
          }
        } else {
          // 固定尺寸
          pageWidth = pdf.internal.pageSize.getWidth();
          pageHeight = pdf.internal.pageSize.getHeight();
        }

        // 添加新页（第一页已存在）
        if (i > 0) {
          pdf.addPage([pageWidth, pageHeight]);
        } else if (pageSize === 'auto') {
          // 调整第一页尺寸
          pdf.internal.pageSize.width = pageWidth;
          pdf.internal.pageSize.height = pageHeight;
        }

        // 计算图片在页面中的位置和大小
        const imgAspectRatio = img.width / img.height;
        const pageAspectRatio = pageWidth / pageHeight;

        let imgWidth: number, imgHeight: number;

        if (imgAspectRatio > pageAspectRatio) {
          // 图片更宽，以宽度为准
          imgWidth = pageWidth;
          imgHeight = pageWidth / imgAspectRatio;
        } else {
          // 图片更高，以高度为准
          imgHeight = pageHeight;
          imgWidth = pageHeight * imgAspectRatio;
        }

        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        // 添加图片
        pdf.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);
      }

      // 生成 PDF Blob
      const blob = pdf.output('blob');
      setPdfBlob(blob);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('生成失败，请重试');
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

  // 下载 PDF
  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merged_${Date.now()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 重置
  const handleReset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setPdfBlob(null);
  };

  // 格式化文件大小
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <div>
        <label className="block font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">
          {t.formats.img2pdf.pageSize}
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setPageSize('a4')}
            className={`px-4 py-2 font-mono text-xs rounded-sm border transition-colors ${
              pageSize === 'a4'
                ? 'bg-acid text-black border-acid'
                : 'bg-tech-card text-zinc-400 border-tech-border hover:border-acid/50'
            }`}
          >
            {t.formats.img2pdf.a4}
          </button>
          <button
            onClick={() => setPageSize('letter')}
            className={`px-4 py-2 font-mono text-xs rounded-sm border transition-colors ${
              pageSize === 'letter'
                ? 'bg-acid text-black border-acid'
                : 'bg-tech-card text-zinc-400 border-tech-border hover:border-acid/50'
            }`}
          >
            {t.formats.img2pdf.letter}
          </button>
          <button
            onClick={() => setPageSize('auto')}
            className={`px-4 py-2 font-mono text-xs rounded-sm border transition-colors ${
              pageSize === 'auto'
                ? 'bg-acid text-black border-acid'
                : 'bg-tech-card text-zinc-400 border-tech-border hover:border-acid/50'
            }`}
          >
            {t.formats.img2pdf.auto}
          </button>
        </div>
      </div>

      {/* 文件上传区 */}
      <div className="relative">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="border-2 border-dashed border-tech-border hover:border-acid/50 rounded-sm p-8 text-center transition-colors">
          <Upload className="w-10 h-10 mx-auto mb-3 text-zinc-600" strokeWidth={1.5} />
          <p className="font-mono text-sm text-zinc-400 mb-1">
            {images.length > 0 ? '继续添加图片' : t.formats.modal.uploadHint}
          </p>
          <p className="font-mono text-xs text-zinc-600">
            JPG / PNG / WebP · {t.formats.modal.uploadHintMulti}
          </p>
        </div>
      </div>

      {/* 图片列表 */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-zinc-500">
              {t.formats.img2pdf.imageCount.replace('{count}', images.length.toString())} ({t.formats.img2pdf.dragToReorder})
            </p>
            <button
              onClick={handleReset}
              className="font-mono text-xs text-zinc-500 hover:text-acid transition-colors"
            >
              清空全部
            </button>
          </div>

          <div className="space-y-2">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="flex items-center gap-3 p-3 bg-tech-card border border-tech-border rounded-sm hover:border-acid/30 transition-colors cursor-move"
              >
                <GripVertical className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                <span className="font-mono text-xs text-zinc-500 w-6">{index + 1}</span>
                <img
                  src={image.previewUrl}
                  alt=""
                  className="w-12 h-12 object-cover rounded border border-tech-border"
                />
                <span className="font-mono text-xs text-white truncate flex-1">
                  {image.file.name}
                </span>
                <button
                  onClick={() => handleRemove(image.id)}
                  className="p-1 text-zinc-500 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {!pdfBlob && (
            <button
              onClick={handleGenerate}
              disabled={isProcessing}
              className="w-full px-6 py-3 bg-acid text-black font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-acid/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? t.formats.modal.processing : t.formats.img2pdf.generating}
            </button>
          )}
        </div>
      )}

      {/* PDF 生成完成 */}
      {pdfBlob && (
        <div className="space-y-4">
          <div className="p-6 bg-tech-card border border-acid/30 rounded-sm text-center space-y-4">
            <p className="font-mono text-sm text-acid">
              ✓ {t.formats.modal.completed}
            </p>
            <p className="font-mono text-xs text-zinc-500">
              文件大小: {formatSize(pdfBlob.size)}
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleDownload}
                className="px-6 py-2 bg-acid text-black font-mono text-xs rounded-sm hover:bg-acid/90 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                下载 PDF
              </button>
              <button
                onClick={() => setPdfBlob(null)}
                className="px-6 py-2 bg-tech-card text-zinc-400 border border-tech-border font-mono text-xs rounded-sm hover:border-acid/50 hover:text-acid transition-colors"
              >
                重新生成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

