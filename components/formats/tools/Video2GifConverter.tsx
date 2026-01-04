'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Play, Pause } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import GIF from 'gif.js';

type FpsOption = 5 | 10 | 15 | 30;
type ScaleOption = 1 | 0.5 | 0.25;

export default function Video2GifConverter() {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [fps, setFps] = useState<FpsOption>(10);
  const [scale, setScale] = useState<ScaleOption>(0.5);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [gifBlob, setGifBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string>('');

  // 处理文件上传
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // 检查文件大小（20MB）
    const maxSize = 20 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError(t.formats.video2gif.fileSizeExceeded);
      return;
    }

    setError('');
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setVideoUrl(url);
    setGifBlob(null);
  }, [t]);

  // 视频加载完成
  const handleVideoLoaded = () => {
    const video = videoRef.current;
    if (!video) return;

    const duration = video.duration;
    setVideoDuration(duration);

    // 检查视频时长（10秒）
    if (duration > 10) {
      setError(t.formats.video2gif.videoTooLong);
      setEndTime(10);
    } else {
      setEndTime(duration);
    }
  };

  // 播放/暂停
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 视频播放结束
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => setIsPlaying(false);
    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, []);

  // 提取视频帧并生成 GIF
  const handleConvert = async () => {
    const video = videoRef.current;
    if (!video || !file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      // 计算实际时间范围
      const actualStartTime = Math.max(0, startTime);
      const actualEndTime = Math.min(endTime, Math.min(videoDuration, 10));
      const duration = actualEndTime - actualStartTime;

      if (duration <= 0) {
        throw new Error('Invalid time range');
      }

      // 计算目标尺寸
      const targetWidth = Math.floor(video.videoWidth * scale);
      const targetHeight = Math.floor(video.videoHeight * scale);

      // 创建 Canvas
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

      // 创建 GIF 编码器
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: targetWidth,
        height: targetHeight,
        workerScript: '/gif.worker.js', // 需要将 worker 文件复制到 public
      });

      // 计算帧数
      const frameInterval = 1 / fps;
      const totalFrames = Math.ceil(duration * fps);

      // 提取帧
      let currentFrame = 0;
      video.currentTime = actualStartTime;

      const extractFrame = () => {
        return new Promise<void>((resolve) => {
          video.onseeked = () => {
            // 绘制当前帧
            ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

            // 添加到 GIF
            gif.addFrame(canvas, { copy: true, delay: frameInterval * 1000 });

            currentFrame++;
            const frameProgress = (currentFrame / totalFrames) * 80; // 80% 用于帧提取
            setProgress(frameProgress);

            // 继续下一帧
            if (currentFrame < totalFrames) {
              const nextTime = actualStartTime + currentFrame * frameInterval;
              if (nextTime <= actualEndTime) {
                video.currentTime = nextTime;
                // 递归提取下一帧（通过 onseeked 触发）
              } else {
                resolve();
              }
            } else {
              resolve();
            }
          };
        });
      };

      // 开始提取
      await extractFrame();

      // 渲染 GIF
      setProgress(85);

      gif.on('progress', (p) => {
        setProgress(85 + p * 15); // 剩余 15% 用于编码
      });

      gif.on('finished', (blob) => {
        setGifBlob(blob);
        setProgress(100);
        setIsProcessing(false);
      });

      gif.render();
    } catch (error) {
      console.error('Video to GIF conversion error:', error);
      setError(t.formats.video2gif.conversionFailed);
      setIsProcessing(false);
    }
  };

  // 下载 GIF
  const handleDownload = () => {
    if (!gifBlob) return;
    const url = URL.createObjectURL(gifBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.replace(/\.[^.]+$/, '')}_${Date.now()}.gif`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 重置
  const handleReset = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setFile(null);
    setVideoUrl('');
    setGifBlob(null);
    setProgress(0);
    setError('');
    setIsPlaying(false);
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 格式化文件大小
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* 说明 */}
      <div className="px-4 py-2 bg-tech-card/50 border border-tech-border rounded-sm">
        <p className="font-mono text-xs text-zinc-500">
          {t.formats.video2gif.limitations}
        </p>
      </div>

      {/* 控制面板 */}
      {file && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* 帧率 */}
          <div>
            <label className="block font-mono text-xs text-zinc-500 mb-1.5">
              {t.formats.video2gif.frameRate}
            </label>
            <select
              value={fps}
              onChange={(e) => setFps(parseInt(e.target.value) as FpsOption)}
              className="w-full px-3 py-1.5 bg-tech-card text-white border border-tech-border rounded-sm font-mono text-xs focus:outline-none focus:border-acid transition-colors"
            >
              <option value={5}>5 FPS</option>
              <option value={10}>10 FPS</option>
              <option value={15}>15 FPS</option>
              <option value={30}>30 FPS</option>
            </select>
          </div>

          {/* 尺寸缩放 */}
          <div>
            <label className="block font-mono text-xs text-zinc-500 mb-1.5">
              {t.formats.video2gif.scale}
            </label>
            <select
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value) as ScaleOption)}
              className="w-full px-3 py-1.5 bg-tech-card text-white border border-tech-border rounded-sm font-mono text-xs focus:outline-none focus:border-acid transition-colors"
            >
              <option value={1}>100%</option>
              <option value={0.5}>50%</option>
              <option value={0.25}>25%</option>
            </select>
          </div>

          {/* 开始时间 */}
          {videoDuration > 0 && (
            <>
              <div>
                <label className="block font-mono text-xs text-zinc-500 mb-1.5">
                  {t.formats.video2gif.startTime}
                </label>
                <input
                  type="number"
                  min={0}
                  max={Math.min(videoDuration, 10)}
                  step={0.1}
                  value={startTime}
                  onChange={(e) => setStartTime(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-tech-card text-white border border-tech-border rounded-sm font-mono text-xs focus:outline-none focus:border-acid transition-colors"
                />
              </div>
              
              {/* 结束时间 */}
              <div>
                <label className="block font-mono text-xs text-zinc-500 mb-1.5">
                  {t.formats.video2gif.endTime}
                </label>
                <input
                  type="number"
                  min={startTime}
                  max={Math.min(videoDuration, 10)}
                  step={0.1}
                  value={endTime}
                  onChange={(e) => setEndTime(parseFloat(e.target.value) || videoDuration)}
                  className="w-full px-3 py-1.5 bg-tech-card text-white border border-tech-border rounded-sm font-mono text-xs focus:outline-none focus:border-acid transition-colors"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* 时长信息 */}
      {videoDuration > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-tech-card/50 border border-tech-border rounded-sm">
          <p className="font-mono text-xs text-zinc-500">
            {t.formats.video2gif.videoDurationDisplay.replace('{duration}', formatTime(videoDuration))}
            {videoDuration > 10 && <span className="text-orange-500 ml-2">{t.formats.video2gif.limitNote}</span>}
          </p>
          <p className="font-mono text-xs text-zinc-500">
            {t.formats.video2gif.convertSegment
              .replace('{duration}', (endTime - startTime).toFixed(1))
              .replace('{frames}', Math.ceil((endTime - startTime) * fps).toString())}
          </p>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-sm">
          <p className="font-mono text-xs text-red-500">{error}</p>
        </div>
      )}

      {/* 文件上传区 */}
      {!file && (
        <div className="relative">
          <input
            type="file"
            accept="video/mp4,video/webm,video/ogg"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-tech-border hover:border-acid/50 rounded-sm p-8 text-center transition-colors">
            <Upload className="w-10 h-10 mx-auto mb-3 text-zinc-600" strokeWidth={1.5} />
            <p className="font-mono text-sm text-zinc-400 mb-1.5">
              {t.formats.modal.uploadHint}
            </p>
            <p className="font-mono text-xs text-zinc-600">
              MP4 / WebM / OGG
            </p>
          </div>
        </div>
      )}

      {/* 视频预览 */}
      {file && !gifBlob && (
        <div className="space-y-3">
          {/* 视频预览区 */}
          <div className="p-4 bg-tech-card border border-tech-border rounded-sm">
            <p className="font-mono text-xs text-zinc-500 mb-3">{t.formats.video2gif.videoPreview}</p>
            <div className="flex justify-center">
              <div className="relative bg-black rounded border border-tech-border overflow-hidden" style={{ maxWidth: '400px', maxHeight: '300px' }}>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  onLoadedMetadata={handleVideoLoaded}
                  className="w-full h-full object-contain"
                  style={{ maxHeight: '300px' }}
                  controls={false}
                />
                {/* 播放控制 */}
                <div className="absolute bottom-2 left-2">
                  <button
                    onClick={togglePlay}
                    className="px-3 py-1.5 bg-acid/90 text-black font-mono text-xs rounded hover:bg-acid transition-colors flex items-center gap-1.5"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3 h-3" />
                        {t.formats.video2gif.pause}
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        {t.formats.video2gif.play}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 进度条 */}
          {isProcessing && (
            <div className="space-y-1.5">
              <div className="w-full h-1.5 bg-tech-card rounded-full overflow-hidden">
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

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <button
              onClick={handleConvert}
              disabled={isProcessing || videoDuration === 0}
              className="flex-1 px-4 py-2 bg-acid text-black font-mono text-xs rounded-sm hover:bg-acid/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? t.formats.modal.processing : t.formats.video2gif.startConversion}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-tech-card text-zinc-400 border border-tech-border font-mono text-xs rounded-sm hover:border-acid/50 hover:text-acid transition-colors"
            >
              {t.formats.video2gif.reselect}
            </button>
          </div>
        </div>
      )}

      {/* GIF 结果 */}
      {gifBlob && (
        <div className="p-4 bg-tech-card border border-acid/30 rounded-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-acid">
              ✓ {t.formats.modal.completed}
            </p>
            <p className="font-mono text-xs text-zinc-500">
              {formatSize(gifBlob.size)}
            </p>
          </div>

          {/* GIF 预览 */}
          <div className="flex justify-center">
            <img
              src={URL.createObjectURL(gifBlob)}
              alt="Generated GIF"
              className="rounded border border-tech-border"
              style={{ maxWidth: '400px', maxHeight: '300px' }}
            />
          </div>

          <div className="flex gap-2 justify-center">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-acid text-black font-mono text-xs rounded-sm hover:bg-acid/90 transition-colors flex items-center gap-1.5"
            >
                <Download className="w-3.5 h-3.5" />
                {t.formats.video2gif.downloadGif}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-tech-card text-zinc-400 border border-tech-border font-mono text-xs rounded-sm hover:border-acid/50 hover:text-acid transition-colors"
            >
              {t.formats.modal.reset}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

