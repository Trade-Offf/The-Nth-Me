'use client';

import { useEffect, useRef } from 'react';

export default function BinaryRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    
    // 每列的速度和字符
    const speeds: number[] = Array(columns).fill(0).map(() => 0.3 + Math.random() * 0.7);
    const chars: string[] = Array(columns).fill('0');

    const draw = () => {
      // 半透明黑色覆盖，产生拖尾效果
      ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(204, 255, 0, 0.15)';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // 随机切换 0 和 1
        if (Math.random() > 0.95) {
          chars[i] = Math.random() > 0.5 ? '1' : '0';
        }

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(chars[i], x, y);

        // 重置到顶部
        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }

        drops[i] += speeds[i];
      }
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

