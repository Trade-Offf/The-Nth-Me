'use client';

import { useEffect, useRef } from 'react';

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  opacity: number;
  color: string;
}

export default function SnowfallEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 赛博朋克风格：纯酸绿色系
    const snowflakes: Snowflake[] = [];
    const snowflakeCount = 30; // 减少到30个粒子

    const colors = [
      'rgba(185, 255, 58, ', // 酸绿色主色
      'rgba(185, 255, 58, ', // 统一为绿色系
    ];

    for (let i = 0; i < snowflakeCount; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 2, // 赛博朋克：2-4px
        speed: Math.random() * 0.5 + 0.3, // 0.3-0.8
        drift: Math.random() * 0.5 - 0.25, // -0.25~0.25
        opacity: Math.random() * 0.1 + 0.05, // 极低透明度：0.05-0.15
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // 动画循环
    let animationFrameId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      snowflakes.forEach((flake) => {
        // 绘制雪花
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${flake.color}${flake.opacity})`;
        ctx.fill();

        // 添加发光效果（酸绿色雪花）
        if (flake.color.includes('185, 255, 58')) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(185, 255, 58, 0.6)';
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // 更新位置
        flake.y += flake.speed;
        flake.x += flake.drift;

        // 重置到顶部
        if (flake.y > canvas.height) {
          flake.y = -10;
          flake.x = Math.random() * canvas.width;
        }

        // 边界检查
        if (flake.x > canvas.width) flake.x = 0;
        if (flake.x < 0) flake.x = canvas.width;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

