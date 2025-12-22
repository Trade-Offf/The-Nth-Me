'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// 赛博朋克圣诞组件 - 动态导入以优化性能
const SnowfallEffect = dynamic(() => import('./SnowfallEffect'), {
  ssr: false,
});

const CyberSnowflakes = dynamic(() => import('./CyberSnowflakes'), {
  ssr: false,
});

const CyberScanlines = dynamic(() => import('./CyberScanlines'), {
  ssr: false,
});

const DataFlow = dynamic(() => import('./DataFlow'), {
  ssr: false,
});

// 圣诞装饰组件
const ChristmasTree3D = dynamic(() => import('./ChristmasTree3D'), {
  ssr: false,
});

const GiftStack = dynamic(() => import('./GiftStack'), {
  ssr: false,
});

interface ChristmasDecoratorProps {
  /**
   * 是否启用圣诞装饰
   * @default true
   */
  enabled?: boolean;

  /**
   * 是否显示飘雪效果
   * @default true
   */
  showSnow?: boolean;

  /**
   * 是否显示彩灯
   * @default true
   */
  showLights?: boolean;

  /**
   * 是否显示漂浮图标
   * @default true
   */
  showIcons?: boolean;

  /**
   * 是否在移动端减弱效果
   * @default true
   */
  reducedMobile?: boolean;
}

export default function ChristmasDecorator({
  enabled = true,
  showSnow = true,
  showLights = true,
  showIcons = true,
  reducedMobile = true,
}: ChristmasDecoratorProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 检测是否为移动设备
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 未启用或未挂载时不渲染
  if (!enabled || !mounted) return null;

  // 移动端简化效果
  // 赛博朋克优化：移动端智能降级
  const shouldShowSnow = showSnow && (!reducedMobile || !isMobile);
  const shouldShowLights = showLights && (!reducedMobile || !isMobile); // 移动端禁用扫描线和数据流
  const shouldShowTree = !reducedMobile || !isMobile; // 移动端可选择性禁用树

  return (
    <>
      {/* 🌃 赛博朋克圣诞效果 */}

      {/* 背景粒子效果 - 酸绿色氛围层 */}
      {shouldShowSnow && <SnowfallEffect />}

      {/* 六边形雪花晶体 - 主视觉层 */}
      {shouldShowSnow && <CyberSnowflakes />}

      {/* 四角雷达扫描线 - 科技感装饰 */}
      {shouldShowLights && <CyberScanlines />}

      {/* 顶部/底部数据流 - 边界装饰 */}
      {shouldShowLights && <DataFlow />}

      {/* 🎄 圣诞装饰元素 */}

      {/* 右下角 3D 圣诞树 */}
      <ChristmasTree3D />

      {/* 左下角礼物堆 */}
      <GiftStack />
    </>
  );
}
