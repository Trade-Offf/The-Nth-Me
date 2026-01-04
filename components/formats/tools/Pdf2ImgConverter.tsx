'use client';

import { useState, useCallback } from 'react';
import { Upload, Download } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import * as pdfjsLib from 'pdfjs-dist';

// 设置 PDF.js worker（使用本地文件）
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

type ConversionMode = 'single' | 'long';
type ScaleType = 1 | 2 | 3;

interface ConvertedImage {
  name: string;
  blob: Blob;
  previewUrl: string;
  size: number;
}

export default function Pdf2ImgConverter() {
  const { t } = useI18n();
  const [mode, setMode] = useState<ConversionMode>('single');
  const [scale, setScale] = useState<ScaleType>(2);
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<ConvertedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageFrom, setPageFrom] = useState(1);
  const [pageTo, setPageTo] = useState(0);
  const [useCustomRange, setUseCustomRange] = useState(false);

  // 处理文件上传
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImages([]);
      setProgress(0);
      // 读取 PDF 页数
      loadPdfPageCount(selectedFile);
    }
  }, []);

  // 读取 PDF 页数
  const loadPdfPageCount = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPageCount(pdf.numPages);
      setPageTo(pdf.numPages);
    } catch (error) {
      console.error('Failed to load PDF:', error);
    }
  };

  // 渲染单页为图片
  const renderPage = async (
    pdf: pdfjsLib.PDFDocumentProxy,
    pageNum: number
  ): Promise<{ canvas: HTMLCanvasElement; width: number; height: number }> => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    return { canvas, width: viewport.width, height: viewport.height };
  };

  // 单页模式转换
  const convertSingleMode = async (pdf: pdfjsLib.PDFDocumentProxy): Promise<ConvertedImage[]> => {
    const results: ConvertedImage[] = [];
    const startPage = useCustomRange ? pageFrom : 1;
    const endPage = useCustomRange ? Math.min(pageTo, pdf.numPages) : pdf.numPages;

    for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
      const { canvas } = await renderPage(pdf, pageNum);

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.9);
      });

      const name = `${file!.name.replace('.pdf', '')}_page_${pageNum}.jpg`;
      const previewUrl = URL.createObjectURL(blob);

      results.push({
        name,
        blob,
        previewUrl,
        size: blob.size,
      });

      setProgress((pageNum / (endPage - startPage + 1)) * 100);
    }

    return results;
  };

  // 长图模式转换
  const convertLongMode = async (pdf: pdfjsLib.PDFDocumentProxy): Promise<ConvertedImage[]> => {
    const startPage = useCustomRange ? pageFrom : 1;
    const endPage = useCustomRange ? Math.min(pageTo, pdf.numPages) : pdf.numPages;

    // 渲染所有页面
    const pages = [];
    for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
      const pageData = await renderPage(pdf, pageNum);
      pages.push(pageData);
      setProgress((pageNum / (endPage - startPage + 1)) * 50);
    }

    // 计算总高度和最大宽度
    const maxWidth = Math.max(...pages.map((p) => p.width));
    const totalHeight = pages.reduce((sum, p) => sum + p.height, 0);

    // 创建长图 canvas
    const longCanvas = document.createElement('canvas');
    longCanvas.width = maxWidth;
    longCanvas.height = totalHeight;
    const ctx = longCanvas.getContext('2d')!;

    // 绘制所有页面
    let currentY = 0;
    pages.forEach(({ canvas, height }) => {
      ctx.drawImage(canvas, 0, currentY);
      currentY += height;
    });

    setProgress(75);

    // 转为 blob
    const blob = await new Promise<Blob>((resolve) => {
      longCanvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.9);
    });

    setProgress(100);

    const name = `${file!.name.replace('.pdf', '')}_long_image.jpg`;
    const previewUrl = URL.createObjectURL(blob);

    return [
      {
        name,
        blob,
        previewUrl,
        size: blob.size,
      },
    ];
  };

  // 执行转换
  const handleConvert = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const results =
        mode === 'single'
          ? await convertSingleMode(pdf)
          : await convertLongMode(pdf);

      setImages(results);
    } catch (error) {
      console.error('PDF conversion error:', error);
      alert('转换失败，请确保上传的是有效的 PDF 文件');
    } finally {
      setIsProcessing(false);
    }
  };

  // 下载单个文件
  const handleDownload = (image: ConvertedImage) => {
    const a = document.createElement('a');
    a.href = image.previewUrl;
    a.download = image.name;
    a.click();
  };

  // 下载全部
  const handleDownloadAll = async () => {
    for (const image of images) {
      handleDownload(image);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  // 重置
  const handleReset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setFile(null);
    setImages([]);
    setProgress(0);
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
      <div className="space-y-4">
        {/* 转换模式 */}
        <div>
          <label className="block font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">
            {t.formats.pdf2img.modeTitle}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode('single')}
              className={`p-3 font-mono text-xs rounded-sm border transition-colors text-left ${
                mode === 'single'
                  ? 'bg-acid/10 text-acid border-acid'
                  : 'bg-tech-card text-zinc-400 border-tech-border hover:border-acid/50'
              }`}
            >
              <div className="font-medium mb-1">{t.formats.pdf2img.singlePage}</div>
              <div className="text-[10px] text-zinc-600">{t.formats.pdf2img.singlePageDesc}</div>
            </button>
            <button
              onClick={() => setMode('long')}
              className={`p-3 font-mono text-xs rounded-sm border transition-colors text-left ${
                mode === 'long'
                  ? 'bg-acid/10 text-acid border-acid'
                  : 'bg-tech-card text-zinc-400 border-tech-border hover:border-acid/50'
              }`}
            >
              <div className="font-medium mb-1">{t.formats.pdf2img.longImage}</div>
              <div className="text-[10px] text-zinc-600">{t.formats.pdf2img.longImageDesc}</div>
            </button>
          </div>
        </div>

        {/* 清晰度和页码范围 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 清晰度 */}
          <div>
            <label className="block font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">
              {t.formats.pdf2img.scale}
            </label>
            <select
              value={scale}
              onChange={(e) => setScale(parseInt(e.target.value) as ScaleType)}
              className="w-full px-4 py-2 bg-tech-card text-white border border-tech-border rounded-sm font-mono text-xs focus:outline-none focus:border-acid transition-colors"
            >
              <option value={1}>{t.formats.pdf2img.standard}</option>
              <option value={2}>{t.formats.pdf2img.hd}</option>
              <option value={3}>{t.formats.pdf2img.ultra}</option>
            </select>
          </div>

          {/* 页码范围 */}
          {pageCount > 0 && (
            <div>
              <label className="block font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">
                {t.formats.pdf2img.pageRange} (共 {pageCount} 页)
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-zinc-400">
                  <input
                    type="radio"
                    checked={!useCustomRange}
                    onChange={() => setUseCustomRange(false)}
                    className="accent-acid"
                  />
                  {t.formats.pdf2img.allPages}
                </label>
                <label className="flex items-center gap-2 text-xs text-zinc-400">
                  <input
                    type="radio"
                    checked={useCustomRange}
                    onChange={() => setUseCustomRange(true)}
                    className="accent-acid"
                  />
                  <span>{t.formats.pdf2img.customRange}</span>
                  {useCustomRange && (
                    <div className="flex items-center gap-2 ml-2">
                      <input
                        type="number"
                        min={1}
                        max={pageCount}
                        value={pageFrom}
                        onChange={(e) => setPageFrom(parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 bg-tech-bg border border-tech-border rounded text-white text-xs"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        min={pageFrom}
                        max={pageCount}
                        value={pageTo}
                        onChange={(e) => setPageTo(parseInt(e.target.value) || pageCount)}
                        className="w-16 px-2 py-1 bg-tech-bg border border-tech-border rounded text-white text-xs"
                      />
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 文件上传区 */}
      {!file && (
        <div className="relative">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-tech-border hover:border-acid/50 rounded-sm p-12 text-center transition-colors">
            <Upload className="w-12 h-12 mx-auto mb-4 text-zinc-600" strokeWidth={1.5} />
            <p className="font-mono text-sm text-zinc-400 mb-2">
              {t.formats.modal.uploadHint}
            </p>
            <p className="font-mono text-xs text-zinc-600">PDF</p>
          </div>
        </div>
      )}

      {/* 已选文件 */}
      {file && images.length === 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-zinc-500">已选择: {file.name}</p>
            <button
              onClick={handleReset}
              className="font-mono text-xs text-zinc-500 hover:text-acid transition-colors"
            >
              重新选择
            </button>
          </div>

          {/* 进度条 */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="w-full h-2 bg-tech-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-acid transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center font-mono text-xs text-zinc-500">
                {Math.round(progress)}% {t.formats.modal.processing}
              </p>
            </div>
          )}

          <button
            onClick={handleConvert}
            disabled={isProcessing}
            className="w-full px-6 py-3 bg-acid text-black font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-acid/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? t.formats.modal.processing : '开始转换'}
          </button>
        </div>
      )}

      {/* 转换结果 */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-acid">
              ✓ {t.formats.modal.completed} ({images.length} {images.length > 1 ? '张图片' : '张图片'})
            </p>
            <div className="flex gap-2">
              {images.length > 1 && (
                <button
                  onClick={handleDownloadAll}
                  className="px-4 py-2 bg-acid text-black font-mono text-xs rounded-sm hover:bg-acid/90 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  下载全部
                </button>
              )}
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-tech-card text-zinc-400 border border-tech-border font-mono text-xs rounded-sm hover:border-acid/50 hover:text-acid transition-colors"
              >
                {t.formats.modal.reset}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, i) => (
              <div
                key={i}
                className="p-4 bg-tech-card border border-tech-border rounded-sm space-y-3"
              >
                {/* 预览 */}
                <img
                  src={image.previewUrl}
                  alt={image.name}
                  className="w-full h-auto rounded border border-tech-border"
                />
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-white truncate">{image.name}</p>
                    <p className="font-mono text-xs text-zinc-500">{formatSize(image.size)}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(image)}
                    className="ml-4 px-3 py-1 bg-acid/10 text-acid border border-acid/30 font-mono text-xs rounded-sm hover:bg-acid hover:text-black transition-colors"
                  >
                    {t.formats.modal.download}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

