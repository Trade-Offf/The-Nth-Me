'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, RotateCcw, AlertCircle, Scissors, Move } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DragState {
  isDragging: boolean;
  isResizing: boolean;
  startX: number;
  startY: number;
  resizeHandle?: 'tl' | 'tr' | 'bl' | 'br' | 'move';
  originalArea?: CropArea;
}

export default function WatermarkRemover() {
  const { t } = useI18n();
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>('');
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    isResizing: false,
    startX: 0,
    startY: 0,
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件上传
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(t.formats.watermark.invalidImage);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setProcessedImage(null);
      setFilename(file.name);
      setCropArea(null);
    };
    reader.readAsDataURL(file);
  }, [t]);

  // 获取鼠标在图片上的相对位置（实际图片坐标）
  const getMousePosition = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!imageContainerRef.current || !imageRef.current) return null;

    const container = imageContainerRef.current;
    const img = imageRef.current;
    const rect = container.getBoundingClientRect();
    
    // 图片显示区域（考虑padding）
    const padding = 16; // p-4
    const imgRect = {
      left: rect.left + padding,
      top: rect.top + padding,
      width: img.clientWidth,
      height: img.clientHeight,
    };
    
    // 鼠标相对于图片的位置（显示坐标）
    const displayX = e.clientX - imgRect.left;
    const displayY = e.clientY - imgRect.top;
    
    // 转换为实际图片坐标
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;
    const realX = displayX * scaleX;
    const realY = displayY * scaleY;
    
    return { 
      realX: Math.max(0, Math.min(realX, img.naturalWidth)),
      realY: Math.max(0, Math.min(realY, img.naturalHeight)),
      displayX,
      displayY,
      scaleX,
      scaleY,
    };
  }, []);

  // 检查是否点击了手柄
  const checkHandleHit = useCallback((displayX: number, displayY: number, area: CropArea, scaleX: number, scaleY: number): 'tl' | 'tr' | 'bl' | 'br' | null => {
    const handleSize = 30; // 手柄检测半径（像素）- 增大检测范围
    
    // 转换选区到显示坐标
    const x1 = area.x / scaleX;
    const y1 = area.y / scaleY;
    const x2 = (area.x + area.width) / scaleX;
    const y2 = (area.y + area.height) / scaleY;
    
    // 检查四个角（使用更宽松的检测）
    if (Math.abs(displayX - x1) <= handleSize && Math.abs(displayY - y1) <= handleSize) return 'tl';
    if (Math.abs(displayX - x2) <= handleSize && Math.abs(displayY - y1) <= handleSize) return 'tr';
    if (Math.abs(displayX - x1) <= handleSize && Math.abs(displayY - y2) <= handleSize) return 'bl';
    if (Math.abs(displayX - x2) <= handleSize && Math.abs(displayY - y2) <= handleSize) return 'br';
    
    return null;
  }, []);

  // 检测鼠标位置并返回应该显示的光标样式
  const getCursorStyle = useCallback((e: React.MouseEvent) => {
    // 如果正在拖拽或调整
    if (dragState.isDragging || dragState.isResizing) {
      if (dragState.isDragging) return 'crosshair';
      if (dragState.resizeHandle === 'move') return 'move';
      if (dragState.resizeHandle === 'tl' || dragState.resizeHandle === 'br') return 'nwse-resize';
      if (dragState.resizeHandle === 'tr' || dragState.resizeHandle === 'bl') return 'nesw-resize';
      return 'crosshair';
    }

    // 没有选区时
    if (!cropArea || cropArea.width === 0 || cropArea.height === 0) {
      return 'crosshair';
    }

    const pos = getMousePosition(e);
    if (!pos) return 'crosshair';

    // 优先检查是否在四个角的手柄上
    const handle = checkHandleHit(pos.displayX, pos.displayY, cropArea, pos.scaleX, pos.scaleY);
    if (handle) {
      // 根据手柄位置返回对应的调整光标
      if (handle === 'tl' || handle === 'br') return 'nwse-resize';
      if (handle === 'tr' || handle === 'bl') return 'nesw-resize';
    }

    // 检查是否在选区内（不在手柄上）
    const { x, y, width, height } = cropArea;
    if (pos.realX >= x && pos.realX <= x + width && pos.realY >= y && pos.realY <= y + height) {
      return 'move';
    }

    // 其他位置
    return 'crosshair';
  }, [cropArea, dragState, getMousePosition, checkHandleHit]);

  // 开始拖拽选择
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const pos = getMousePosition(e);
    if (!pos || !imageRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    // 如果已有选区
    if (cropArea && cropArea.width > 0 && cropArea.height > 0) {
      // 1. 优先检查是否点击了四个角的手柄
      const handle = checkHandleHit(pos.displayX, pos.displayY, cropArea, pos.scaleX, pos.scaleY);
      if (handle) {
        setDragState({ 
          isDragging: false, 
          isResizing: true, 
          startX: pos.realX, 
          startY: pos.realY, 
          resizeHandle: handle, 
          originalArea: { ...cropArea } 
        });
        return;
      }

      // 2. 检查是否点击在选区内（移动）
      const { x, y, width, height } = cropArea;
      if (pos.realX >= x && pos.realX <= x + width && pos.realY >= y && pos.realY <= y + height) {
        setDragState({ 
          isDragging: false, 
          isResizing: true, 
          startX: pos.realX, 
          startY: pos.realY, 
          resizeHandle: 'move', 
          originalArea: { ...cropArea } 
        });
        return;
      }
    }

    // 3. 点击在选区外，创建新选区
    setDragState({ isDragging: true, isResizing: false, startX: pos.realX, startY: pos.realY });
    setCropArea({ x: pos.realX, y: pos.realY, width: 0, height: 0 });
  }, [cropArea, getMousePosition, checkHandleHit]);

  // 拖拽中
  const handleMouseMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!dragState.isDragging && !dragState.isResizing) return;
    if (!imageRef.current) return;

    const pos = getMousePosition(e);
    if (!pos) return;

    e.preventDefault();

    if (dragState.isDragging) {
      // 创建新选区
      const x = Math.min(dragState.startX, pos.realX);
      const y = Math.min(dragState.startY, pos.realY);
      const width = Math.abs(pos.realX - dragState.startX);
      const height = Math.abs(pos.realY - dragState.startY);

      setCropArea({ x, y, width, height });
    } else if (dragState.isResizing && dragState.originalArea) {
      // 调整选区
      const deltaX = pos.realX - dragState.startX;
      const deltaY = pos.realY - dragState.startY;
      const original = dragState.originalArea;
      const img = imageRef.current;
      let newArea = { ...original };

      switch (dragState.resizeHandle) {
        case 'tl': // 左上角
          newArea.x = Math.max(0, original.x + deltaX);
          newArea.y = Math.max(0, original.y + deltaY);
          newArea.width = original.width - (newArea.x - original.x);
          newArea.height = original.height - (newArea.y - original.y);
          break;
        case 'tr': // 右上角
          newArea.y = Math.max(0, original.y + deltaY);
          newArea.width = Math.min(img.naturalWidth - original.x, original.width + deltaX);
          newArea.height = original.height - (newArea.y - original.y);
          break;
        case 'bl': // 左下角
          newArea.x = Math.max(0, original.x + deltaX);
          newArea.width = original.width - (newArea.x - original.x);
          newArea.height = Math.min(img.naturalHeight - original.y, original.height + deltaY);
          break;
        case 'br': // 右下角
          newArea.width = Math.min(img.naturalWidth - original.x, original.width + deltaX);
          newArea.height = Math.min(img.naturalHeight - original.y, original.height + deltaY);
          break;
        case 'move': // 移动整个选区
          newArea.x = Math.max(0, Math.min(original.x + deltaX, img.naturalWidth - original.width));
          newArea.y = Math.max(0, Math.min(original.y + deltaY, img.naturalHeight - original.height));
          break;
      }

      // 确保最小尺寸
      const minSize = 20;
      if (newArea.width < minSize) newArea.width = minSize;
      if (newArea.height < minSize) newArea.height = minSize;
      
      // 确保不超出边界
      if (newArea.x + newArea.width > img.naturalWidth) {
        newArea.width = img.naturalWidth - newArea.x;
      }
      if (newArea.y + newArea.height > img.naturalHeight) {
        newArea.height = img.naturalHeight - newArea.y;
      }

      setCropArea(newArea);
    }
  }, [dragState, getMousePosition]);

  // 结束拖拽
  const handleMouseUp = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setDragState({ isDragging: false, isResizing: false, startX: 0, startY: 0 });
  }, []);

  // 全局鼠标事件监听
  useEffect(() => {
    if (dragState.isDragging || dragState.isResizing) {
      const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
      const handleGlobalMouseUp = (e: MouseEvent) => handleMouseUp(e);

      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [dragState, handleMouseMove, handleMouseUp]);

  // 处理图片 - 改进的去水印算法
  const processImage = useCallback(async () => {
    if (!image || !cropArea || !imageRef.current) return;

    setIsProcessing(true);

    try {
      const img = imageRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Canvas context not available');

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      console.log('开始处理水印区域:', cropArea);

      // 扩大选区边界
      const padding = 5;
      const expandedArea = {
        x: Math.max(0, Math.floor(cropArea.x) - padding),
        y: Math.max(0, Math.floor(cropArea.y) - padding),
        width: Math.min(img.naturalWidth - Math.floor(cropArea.x) + padding, Math.ceil(cropArea.width) + padding * 2),
        height: Math.min(img.naturalHeight - Math.floor(cropArea.y) + padding, Math.ceil(cropArea.height) + padding * 2),
      };

      console.log('扩展区域:', expandedArea);

      // 获取水印区域的图像数据
      const areaData = ctx.getImageData(
        Math.floor(cropArea.x),
        Math.floor(cropArea.y),
        Math.ceil(cropArea.width),
        Math.ceil(cropArea.height)
      );

      console.log('获取到的图像数据尺寸:', areaData.width, 'x', areaData.height);

      // 简化的修复算法：从四周边缘采样并混合
      const borderWidth = 15; // 边缘采样宽度
      
      for (let y = 0; y < areaData.height; y++) {
        for (let x = 0; x < areaData.width; x++) {
          const idx = (y * areaData.width + x) * 4;
          
          // 计算采样权重（基于到四个边的距离）
          const distLeft = x;
          const distRight = areaData.width - x - 1;
          const distTop = y;
          const distBottom = areaData.height - y - 1;
          
          let r = 0, g = 0, b = 0, totalWeight = 0;
          
          // 从四个方向采样
          const samples = [
            { // 左边
              x: Math.max(0, cropArea.x - borderWidth + Math.random() * borderWidth),
              y: cropArea.y + y,
              weight: 1 / (1 + distLeft)
            },
            { // 右边
              x: Math.min(img.naturalWidth - 1, cropArea.x + cropArea.width + Math.random() * borderWidth),
              y: cropArea.y + y,
              weight: 1 / (1 + distRight)
            },
            { // 上边
              x: cropArea.x + x,
              y: Math.max(0, cropArea.y - borderWidth + Math.random() * borderWidth),
              weight: 1 / (1 + distTop)
            },
            { // 下边
              x: cropArea.x + x,
              y: Math.min(img.naturalHeight - 1, cropArea.y + cropArea.height + Math.random() * borderWidth),
              weight: 1 / (1 + distBottom)
            }
          ];
          
          // 采样并加权混合
          for (const sample of samples) {
            const sampleData = ctx.getImageData(Math.floor(sample.x), Math.floor(sample.y), 1, 1).data;
            r += sampleData[0] * sample.weight;
            g += sampleData[1] * sample.weight;
            b += sampleData[2] * sample.weight;
            totalWeight += sample.weight;
          }
          
          // 添加轻微噪点
          const noise = (Math.random() - 0.5) * 4;
          
          areaData.data[idx] = Math.max(0, Math.min(255, r / totalWeight + noise));
          areaData.data[idx + 1] = Math.max(0, Math.min(255, g / totalWeight + noise));
          areaData.data[idx + 2] = Math.max(0, Math.min(255, b / totalWeight + noise));
          areaData.data[idx + 3] = 255;
        }
      }

      console.log('修复完成，应用图像数据');

      // 应用修复后的数据
      ctx.putImageData(areaData, Math.floor(cropArea.x), Math.floor(cropArea.y));

      // 边缘模糊处理
      const blurCanvas = document.createElement('canvas');
      const blurSize = 10;
      blurCanvas.width = Math.ceil(cropArea.width) + blurSize * 2;
      blurCanvas.height = Math.ceil(cropArea.height) + blurSize * 2;
      const blurCtx = blurCanvas.getContext('2d');
      
      if (blurCtx) {
        blurCtx.filter = 'blur(2px)';
        blurCtx.drawImage(
          canvas,
          Math.floor(cropArea.x) - blurSize,
          Math.floor(cropArea.y) - blurSize,
          Math.ceil(cropArea.width) + blurSize * 2,
          Math.ceil(cropArea.height) + blurSize * 2,
          0,
          0,
          Math.ceil(cropArea.width) + blurSize * 2,
          Math.ceil(cropArea.height) + blurSize * 2
        );
        
        ctx.globalAlpha = 0.3;
        ctx.drawImage(
          blurCanvas,
          0,
          0,
          blurCanvas.width,
          blurCanvas.height,
          Math.floor(cropArea.x) - blurSize,
          Math.floor(cropArea.y) - blurSize,
          blurCanvas.width,
          blurCanvas.height
        );
        ctx.globalAlpha = 1.0;
      }

      console.log('处理完成，生成结果图片');

      const processedDataUrl = canvas.toDataURL('image/png', 1.0);
      setProcessedImage(processedDataUrl);
    } catch (error) {
      console.error('Processing error:', error);
      alert(t.formats.watermark.processFailed);
    } finally {
      setIsProcessing(false);
    }
  }, [image, cropArea, t]);

  // 下载处理后的图片
  const downloadImage = useCallback(() => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = filename.replace(/\.[^/.]+$/, '') + '_removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [processedImage, filename]);

  // 重置
  const reset = useCallback(() => {
    setImage(null);
    setProcessedImage(null);
    setFilename('');
    setCropArea(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // 拖拽上传
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);

    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert(t.formats.watermark.invalidImage);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setProcessedImage(null);
      setFilename(file.name);
      setCropArea(null);
    };
    reader.readAsDataURL(file);
  }, [t]);

  return (
    <div className="space-y-6">
      {/* 工具说明 */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm text-zinc-300 leading-relaxed">
              {t.formats.watermark.description}
            </p>
            <p className="text-xs text-yellow-500/80">
              {t.formats.watermark.aiTip}
            </p>
          </div>
        </div>
      </div>

      {/* 上传区域 */}
      {!image && (
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
            isDraggingFile
              ? 'border-acid bg-acid/5'
              : 'border-tech-border hover:border-acid/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-zinc-500" />
          <p className="text-zinc-400 mb-2">{t.formats.watermark.uploadHint}</p>
          <p className="text-xs text-zinc-600 mb-4">{t.formats.watermark.supportedFormats}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="watermark-upload"
          />
          <label
            htmlFor="watermark-upload"
            className="inline-block px-6 py-2 bg-acid text-black rounded-lg font-mono text-sm cursor-pointer hover:bg-acid/90 transition-colors"
          >
            {t.formats.modal.selectFiles}
          </label>
        </div>
      )}

      {/* 图片处理区域 */}
      {image && (
        <div className="space-y-4">
          {/* 图片预览 */}
          <div className="grid grid-cols-2 gap-4">
            {/* 原图 */}
            <div>
              <h3 className="text-sm text-zinc-500 font-mono mb-2">
                {t.formats.watermark.originalImage}
              </h3>
              <div 
                ref={imageContainerRef}
                className="relative bg-tech-panel border border-tech-border rounded-lg p-4 select-none overflow-hidden"
                style={{ cursor: 'crosshair' }}
                onMouseDown={handleMouseDown}
                onMouseMove={(e) => {
                  const cursor = getCursorStyle(e);
                  if (imageContainerRef.current) {
                    imageContainerRef.current.style.cursor = cursor;
                  }
                }}
              >
                <img
                  ref={imageRef}
                  src={image}
                  alt="Original"
                  className="w-full h-auto pointer-events-none"
                  draggable={false}
                />
                {cropArea && cropArea.width > 0 && cropArea.height > 0 && imageRef.current && (() => {
                  const img = imageRef.current;
                  const scaleX = img.clientWidth / img.naturalWidth;
                  const scaleY = img.clientHeight / img.naturalHeight;
                  const padding = 16; // p-4
                  
                  // 转换为显示坐标（像素）
                  const displayX = cropArea.x * scaleX;
                  const displayY = cropArea.y * scaleY;
                  const displayWidth = cropArea.width * scaleX;
                  const displayHeight = cropArea.height * scaleY;
                  
                  return (
                    <>
                      {/* 选区框 */}
                      <div
                        className="absolute border-2 border-red-500 bg-red-500/20 pointer-events-none"
                        style={{
                          left: `${padding + displayX}px`,
                          top: `${padding + displayY}px`,
                          width: `${displayWidth}px`,
                          height: `${displayHeight}px`,
                        }}
                      />
                      {/* 四个角的调整手柄 - 小红点 */}
                      <div 
                        className="absolute w-3 h-3 bg-red-500 border border-white rounded-full shadow-md transition-transform z-10"
                        style={{
                          left: `${padding + displayX - 6}px`,
                          top: `${padding + displayY - 6}px`,
                          pointerEvents: 'none',
                        }}
                      />
                      <div 
                        className="absolute w-3 h-3 bg-red-500 border border-white rounded-full shadow-md transition-transform z-10"
                        style={{
                          left: `${padding + displayX + displayWidth - 6}px`,
                          top: `${padding + displayY - 6}px`,
                          pointerEvents: 'none',
                        }}
                      />
                      <div 
                        className="absolute w-3 h-3 bg-red-500 border border-white rounded-full shadow-md transition-transform z-10"
                        style={{
                          left: `${padding + displayX - 6}px`,
                          top: `${padding + displayY + displayHeight - 6}px`,
                          pointerEvents: 'none',
                        }}
                      />
                      <div 
                        className="absolute w-3 h-3 bg-red-500 border border-white rounded-full shadow-md transition-transform z-10"
                        style={{
                          left: `${padding + displayX + displayWidth - 6}px`,
                          top: `${padding + displayY + displayHeight - 6}px`,
                          pointerEvents: 'none',
                        }}
                      />
                    </>
                  );
                })()}
              </div>
            </div>

            {/* 处理后 */}
            <div>
              <h3 className="text-sm text-zinc-500 font-mono mb-2">
                {t.formats.watermark.processedImage}
              </h3>
              <div className="bg-tech-panel border border-tech-border rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                {processedImage ? (
                  <img src={processedImage} alt="Processed" className="w-full h-auto" />
                ) : (
                  <p className="text-zinc-600 text-sm">{t.formats.watermark.previewPlaceholder}</p>
                )}
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 pb-8">
            <button
              onClick={processImage}
              disabled={!cropArea || isProcessing}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-acid text-black rounded-lg font-mono text-sm hover:bg-acid/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Scissors className="w-4 h-4" />
              {isProcessing ? t.formats.watermark.processing : t.formats.watermark.startProcess}
            </button>

            {processedImage && (
              <button
                onClick={downloadImage}
                className="flex items-center gap-2 px-6 py-3 bg-tech-panel border border-tech-border text-zinc-400 rounded-lg font-mono text-sm hover:border-acid hover:text-acid transition-all"
              >
                <Download className="w-4 h-4" />
                {t.formats.modal.download}
              </button>
            )}

            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 bg-tech-panel border border-tech-border text-zinc-400 rounded-lg font-mono text-sm hover:border-acid hover:text-acid transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              {t.formats.modal.reset}
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

