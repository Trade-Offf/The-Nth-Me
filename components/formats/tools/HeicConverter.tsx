'use client';

import { useState, useCallback } from 'react';
import { Upload, Download } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import heic2any from 'heic2any';

type OutputFormat = 'jpeg' | 'png';
type FileType = 'heic' | 'mov';

interface ConvertedFrame {
  name: string;
  blob: Blob;
  previewUrl: string;
  size: number;
  timestamp?: number; // MOV 帧的时间戳（秒）
}

interface ConvertedFile {
  originalName: string;
  originalSize: number;
  fileType: FileType;
  frames: ConvertedFrame[];
  selectedFrames: number[]; // 选中的帧索引
  duration?: number; // MOV 文件的总时长（秒）
}

export default function HeicConverter() {
  const { t } = useI18n();
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [quality, setQuality] = useState(0.9);
  const [files, setFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [previewFileIndex, setPreviewFileIndex] = useState<number>(0);

  // 处理文件上传
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setConvertedFiles([]);
    setProgress(0);
  }, []);

  // 检测文件类型
  const getFileType = (file: File): FileType => {
    const ext = file.name.toLowerCase();
    if (ext.endsWith('.mov') || ext.endsWith('.mp4')) return 'mov';
    return 'heic';
  };

  // 从视频提取帧
  const extractFramesFromVideo = async (file: File): Promise<ConvertedFile> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = async () => {
        const duration = video.duration;
        const frameCount = Math.min(Math.ceil(duration * 10), 30); // 最多提取30帧，每0.1秒一帧
        const interval = duration / frameCount;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        const frames: ConvertedFrame[] = [];
        const originalName = file.name.replace(/\.(mov|mp4)$/i, '');
        const ext = format === 'jpeg' ? 'jpg' : 'png';

        try {
          for (let i = 0; i < frameCount; i++) {
            const timestamp = i * interval;
            video.currentTime = timestamp;

            await new Promise<void>((resolveFrame) => {
              video.onseeked = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0);

                canvas.toBlob(
                  (blob) => {
                    if (blob) {
                      frames.push({
                        name: `${originalName}_${String(i + 1).padStart(3, '0')}.${ext}`,
                        blob,
                        previewUrl: URL.createObjectURL(blob),
                        size: blob.size,
                        timestamp,
                      });
                    }
                    resolveFrame();
                  },
                  `image/${format}`,
                  quality
                );
              };
            });
          }

          URL.revokeObjectURL(video.src);

          resolve({
            originalName: file.name,
            originalSize: file.size,
            fileType: 'mov',
            frames,
            selectedFrames: [], // 默认不选择，让用户手动选择
            duration,
          });
        } catch (error) {
          URL.revokeObjectURL(video.src);
          reject(error);
        }
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error('Failed to load video'));
      };
    });
  };

  // 转换HEIC文件（支持多帧）
  const convertHeicFile = async (file: File): Promise<ConvertedFile> => {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: `image/${format}`,
        quality: quality,
        multiple: true, // 启用多帧转换
      });

      // heic2any 可能返回 Blob 或 Blob[]
      const blobs = Array.isArray(convertedBlob) ? convertedBlob : [convertedBlob];

      const originalName = file.name.replace(/\.(heic|heif)$/i, '');
      const ext = format === 'jpeg' ? 'jpg' : 'png';

      const frames: ConvertedFrame[] = blobs.map((blob, index) => {
        const name = blobs.length > 1 
          ? `${originalName}_frame_${String(index + 1).padStart(3, '0')}.${ext}`
          : `${originalName}.${ext}`;
        
        return {
          name,
          blob,
          previewUrl: URL.createObjectURL(blob),
          size: blob.size,
        };
      });

      // 单帧图片自动选中，多帧让用户手动选择
      const selectedFrames: number[] = frames.length === 1 ? [0] : [];

      return {
        originalName: file.name,
        originalSize: file.size,
        fileType: 'heic',
        frames,
        selectedFrames,
      };
    } catch (error) {
      console.error('HEIC conversion error:', error);
      throw new Error(`Failed to convert ${file.name}`);
    }
  };

  // 转换单个文件（自动检测类型）
  const convertFile = async (file: File): Promise<ConvertedFile> => {
    const fileType = getFileType(file);
    
    if (fileType === 'mov') {
      return extractFramesFromVideo(file);
    } else {
      return convertHeicFile(file);
    }
  };

  // 批量转换
  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const results: ConvertedFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const result = await convertFile(files[i]);
        results.push(result);
        setProgress(((i + 1) / files.length) * 100);
      }

      setConvertedFiles(results);
    } catch (error) {
      console.error('Batch conversion error:', error);
      alert(t.formats.heic.conversionFailed);
    } finally {
      setIsProcessing(false);
    }
  };

  // 切换帧选择
  const toggleFrameSelection = (fileIndex: number, frameIndex: number) => {
    setConvertedFiles((prev) =>
      prev.map((file, i) => {
        if (i !== fileIndex) return file;
        
        const selected = file.selectedFrames.includes(frameIndex);
        const selectedFrames = selected
          ? file.selectedFrames.filter((f) => f !== frameIndex)
          : [...file.selectedFrames, frameIndex].sort((a, b) => a - b);
        
        return { ...file, selectedFrames };
      })
    );
  };

  // 下载单个帧
  const handleDownloadFrame = (frame: ConvertedFrame) => {
    const a = document.createElement('a');
    a.href = frame.previewUrl;
    a.download = frame.name;
    a.click();
  };

  // 下载文件的所有选中帧
  const handleDownloadSelected = async (file: ConvertedFile) => {
    for (const frameIndex of file.selectedFrames) {
      handleDownloadFrame(file.frames[frameIndex]);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  // 下载全部
  const handleDownloadAll = async () => {
    for (const file of convertedFiles) {
      await handleDownloadSelected(file);
    }
  };

  // 重置
  const handleReset = () => {
    convertedFiles.forEach((file) => {
      file.frames.forEach((frame) => URL.revokeObjectURL(frame.previewUrl));
    });
    setFiles([]);
    setConvertedFiles([]);
    setProgress(0);
    setCurrentFrameIndex(0);
    setPreviewFileIndex(0);
  };

  // 格式化文件大小
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    return `${seconds.toFixed(2)}s`;
  };

  return (
    <div className="space-y-6">
      {/* 说明 */}
      <div className="p-4 bg-tech-card border border-tech-border rounded-sm">
        <p 
          className="font-mono text-xs text-zinc-400 mb-2"
          dangerouslySetInnerHTML={{ __html: t.formats.heic.description }}
        />
        <p className="font-mono text-xs text-zinc-500">
          {t.formats.heic.tip}
        </p>
      </div>

      {/* 文件上传区 */}
      {files.length === 0 && (
        <div className="relative">
          <input
            type="file"
            accept=".heic,.heif,.mov,.mp4,image/heic,image/heif,video/quicktime,video/mp4"
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
              {t.formats.heic.supportedFormats} · {t.formats.modal.uploadHintMulti}
            </p>
          </div>
        </div>
      )}

      {/* 输出设置 */}
      {files.length > 0 && convertedFiles.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 输出格式 */}
          <div>
            <label className="block font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">
              {t.formats.heic.outputFormat}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFormat('jpeg')}
                className={`px-4 py-2 font-mono text-xs rounded-sm border transition-colors ${
                  format === 'jpeg'
                    ? 'bg-acid text-black border-acid'
                    : 'bg-tech-card text-zinc-400 border-tech-border hover:border-acid/50'
                }`}
              >
                JPG
              </button>
              <button
                onClick={() => setFormat('png')}
                className={`px-4 py-2 font-mono text-xs rounded-sm border transition-colors ${
                  format === 'png'
                    ? 'bg-acid text-black border-acid'
                    : 'bg-tech-card text-zinc-400 border-tech-border hover:border-acid/50'
                }`}
              >
                PNG
              </button>
            </div>
          </div>

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
              {t.formats.modal.reselect || '重新选择'}
            </button>
          </div>
          <div className="space-y-2">
            {files.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-tech-card border border-tech-border rounded-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-white truncate">{file.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    getFileType(file) === 'mov' 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {getFileType(file).toUpperCase()}
                  </span>
                </div>
                <span className="font-mono text-xs text-zinc-500 ml-4">{formatSize(file.size)}</span>
              </div>
            ))}
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
            {isProcessing ? t.formats.modal.processing : t.formats.heic.startProcessing}
          </button>
        </div>
      )}

      {/* 转换结果 */}
      {convertedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-acid">
              ✓ {t.formats.modal.completed}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadAll}
                className="px-4 py-2 bg-acid text-black font-mono text-xs rounded-sm hover:bg-acid/90 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t.formats.heic.downloadSelected}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-tech-card text-zinc-400 border border-tech-border font-mono text-xs rounded-sm hover:border-acid/50 hover:text-acid transition-colors"
              >
                {t.formats.modal.reset}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {convertedFiles.map((file, fileIndex) => (
              <div
                key={fileIndex}
                className="p-4 bg-tech-card border border-tech-border rounded-sm space-y-4"
              >
                {/* 文件信息 */}
                <div className="flex items-center justify-between border-b border-tech-border pb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm text-white">{file.originalName}</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        file.fileType === 'mov' 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {file.fileType.toUpperCase()}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-zinc-500 mt-1">
                      {file.frames.length > 1 ? (
                        <>
                          <span dangerouslySetInnerHTML={{ 
                            __html: t.formats.heic.extractedFrames.replace('{count}', file.frames.length.toString()) 
                          }} />
                          {file.duration && <> · {t.formats.heic.frameDuration} {formatTime(file.duration)}</>}
                          · {t.formats.heic.selectedCount.replace('{count}', file.selectedFrames.length.toString())}
                        </>
                      ) : (
                        t.formats.heic.singleFrame
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadSelected(file)}
                    disabled={file.selectedFrames.length === 0}
                    className="px-4 py-2 bg-acid/10 text-acid border border-acid/30 font-mono text-xs rounded-sm hover:bg-acid hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t.formats.heic.downloadCount.replace('{count}', file.selectedFrames.length.toString())}
                  </button>
                </div>

                {/* 帧预览 */}
                {file.frames.length > 1 ? (
                  <div className="space-y-4">
                    {/* 大预览图 */}
                    <div className="relative bg-black rounded-lg overflow-hidden border border-tech-border">
                      <img
                        src={file.frames[fileIndex === previewFileIndex ? currentFrameIndex : 0].previewUrl}
                        alt={`Frame ${currentFrameIndex + 1}`}
                        className="w-full h-auto max-h-96 object-contain mx-auto"
                      />
                      
                      {/* 帧信息叠加 */}
                      <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded font-mono text-xs text-white">
                        {t.formats.heic.frameCount
                          .replace('{current}', (fileIndex === previewFileIndex ? currentFrameIndex + 1 : 1).toString())
                          .replace('{total}', file.frames.length.toString())}
                        {file.frames[fileIndex === previewFileIndex ? currentFrameIndex : 0].timestamp !== undefined && (
                          <span className="ml-2 text-zinc-400">
                            @ {formatTime(file.frames[fileIndex === previewFileIndex ? currentFrameIndex : 0].timestamp!)}
                          </span>
                        )}
                      </div>
                      
                      <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded font-mono text-xs text-zinc-400">
                        {formatSize(file.frames[fileIndex === previewFileIndex ? currentFrameIndex : 0].size)}
                      </div>
                    </div>

                    {/* 时间轴滑动条 */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-zinc-500">
                          {file.fileType === 'mov' ? t.formats.heic.videoTimeline : t.formats.heic.frameSequence}
                        </span>
                        <div className="flex-1">
                          <input
                            type="range"
                            min={0}
                            max={file.frames.length - 1}
                            step={1}
                            value={fileIndex === previewFileIndex ? currentFrameIndex : 0}
                            onChange={(e) => {
                              setPreviewFileIndex(fileIndex);
                              setCurrentFrameIndex(parseInt(e.target.value));
                            }}
                            className="w-full accent-acid"
                          />
                        </div>
                        <span className="font-mono text-xs text-acid">
                          #{fileIndex === previewFileIndex ? currentFrameIndex + 1 : 1}
                        </span>
                      </div>
                      
                      {/* 帧缩略图时间轴 */}
                      <div className="flex gap-1 overflow-x-auto pb-2">
                        {file.frames.map((frame, frameIndex) => {
                          const isSelected = file.selectedFrames.includes(frameIndex);
                          const isCurrent = fileIndex === previewFileIndex && frameIndex === currentFrameIndex;
                          
                          return (
                            <div
                              key={frameIndex}
                              onClick={() => {
                                setPreviewFileIndex(fileIndex);
                                setCurrentFrameIndex(frameIndex);
                              }}
                              className={`relative flex-shrink-0 w-16 h-16 cursor-pointer rounded border-2 overflow-hidden transition-all ${
                                isCurrent
                                  ? 'border-acid shadow-[0_0_8px_rgba(204,255,0,0.5)]'
                                  : isSelected
                                  ? 'border-acid/50'
                                  : 'border-tech-border hover:border-acid/30'
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-acid text-black rounded-full flex items-center justify-center text-[10px] font-bold z-10">
                                  ✓
                                </div>
                              )}
                              
                              <img
                                src={frame.previewUrl}
                                alt={`Frame ${frameIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                              
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-center">
                                <span className="font-mono text-[9px] text-white">
                                  {frameIndex + 1}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 帧选择操作 */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-tech-border">
                      <button
                        onClick={() => {
                          const idx = fileIndex === previewFileIndex ? currentFrameIndex : 0;
                          toggleFrameSelection(fileIndex, idx);
                        }}
                        className={`px-4 py-2 font-mono text-xs rounded-sm border transition-colors ${
                          file.selectedFrames.includes(fileIndex === previewFileIndex ? currentFrameIndex : 0)
                            ? 'bg-acid text-black border-acid'
                            : 'bg-tech-card text-zinc-400 border-tech-border hover:border-acid'
                        }`}
                      >
                        {file.selectedFrames.includes(fileIndex === previewFileIndex ? currentFrameIndex : 0)
                          ? t.formats.heic.currentFrameSelected
                          : t.formats.heic.selectCurrentFrame}
                      </button>
                      
                      <button
                        onClick={() => {
                          setConvertedFiles((prev) =>
                            prev.map((f, i) =>
                              i === fileIndex
                                ? { ...f, selectedFrames: f.frames.map((_, idx) => idx) }
                                : f
                            )
                          );
                        }}
                        className="px-4 py-2 bg-tech-card text-zinc-400 border border-tech-border font-mono text-xs rounded-sm hover:border-acid hover:text-acid transition-colors"
                      >
                        {t.formats.heic.selectAll}
                      </button>
                      
                      <button
                        onClick={() => {
                          setConvertedFiles((prev) =>
                            prev.map((f, i) =>
                              i === fileIndex ? { ...f, selectedFrames: [] } : f
                            )
                          );
                        }}
                        className="px-4 py-2 bg-tech-card text-zinc-400 border border-tech-border font-mono text-xs rounded-sm hover:border-red-500 hover:text-red-500 transition-colors"
                      >
                        {t.formats.heic.deselectAll}
                      </button>
                      
                      <div 
                        className="ml-auto font-mono text-xs text-zinc-500"
                        dangerouslySetInnerHTML={{ 
                          __html: t.formats.heic.selectedFramesCount
                            .replace('{selected}', file.selectedFrames.length.toString())
                            .replace('{total}', file.frames.length.toString())
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  // 单帧显示
                  <div className="flex gap-4">
                    <img
                      src={file.frames[0].previewUrl}
                      alt="Converted"
                      className="w-32 h-32 object-cover rounded border border-tech-border"
                    />
                    <div className="flex-1 space-y-2">
                      <p className="font-mono text-xs text-zinc-400">
                        {file.frames[0].name}
                      </p>
                      <p className="font-mono text-xs text-zinc-500">
                        {t.formats.heic.fileSizeChange
                          .replace('{original}', formatSize(file.originalSize))
                          .replace('{converted}', formatSize(file.frames[0].size))}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
