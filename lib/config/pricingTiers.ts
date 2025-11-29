/**
 * 定价档位配置
 * 赛博朋克/命运石之门风格的等级系统
 * 
 * 包含 Pro Model 访问控制逻辑
 */

import { Zap, Sparkles, Crown } from 'lucide-react';

export interface PricingTier {
  id: 'basic' | 'advanced' | 'ultimate';
  name: string;
  subName: string;
  price: string;
  credits: number;
  features: string[];
  isPro: boolean;
  isRecommended?: boolean;
  glowColor: string;
  icon: typeof Zap | typeof Sparkles | typeof Crown;
}

/**
 * 定价档位配置
 * - 微型奇点: 基础入门级，无 Pro 访问权限
 * - 超弦引擎: 推荐档位，解锁 Pro 模型
 * - 拉普拉斯妖: 终极档位，完整 Pro 权限
 */
export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'basic',
    name: '微型奇点',
    subName: 'Micro-Singularity',
    price: '19.90',
    credits: 200,
    features: [
      '⚡️ 200 算力能源',
      '🎫 D 级人员身份卡',
      '🔓 标准时间线观测',
      '🚫 Pro 模型：未授权',
    ],
    isPro: false,
    glowColor: 'border-green-900/50',
    icon: Zap,
  },
  {
    id: 'advanced',
    name: '超弦引擎',
    subName: 'Superstring Engine',
    price: '39.90',
    credits: 550,
    isRecommended: true,
    features: [
      '⚡️ 550 算力能源 (+50 Bonus)',
      '🎫 B 级调查员身份卡',
      '🔥 解锁 [Pro: 深层潜入] 模式',
      '🚀 优先队列权限',
    ],
    isPro: true,
    glowColor: 'border-green-500 shadow-[0_0_15px_rgba(0,255,0,0.3)]',
    icon: Sparkles,
  },
  {
    id: 'ultimate',
    name: '拉普拉斯妖',
    subName: 'Laplace Core',
    price: '99.90',
    credits: 1500,
    features: [
      '⚡️ 1500 算力能源 (立省 ¥50+)',
      '👑 [核心观测员] 永久头衔',
      '🔥 Pro 模式极速通道',
      '🗝️ 隐藏协议访问权',
    ],
    isPro: true,
    glowColor: 'border-yellow-500/80 shadow-[0_0_20px_rgba(234,179,8,0.4)]',
    icon: Crown,
  },
];

/**
 * 获取用户是否拥有 Pro 权限
 * 基于用户购买的最高档位判断
 * 
 * TODO: 实际实现需要从数据库读取用户购买记录
 * 目前返回 false 作为默认值
 */
export function checkUserProAccess(userId?: string): boolean {
  // 暂时返回 false，后续需要接入数据库判断
  // 可以通过检查用户是否购买过 advanced 或 ultimate 档位来判断
  return false;
}

/**
 * 爱发电支付链接
 */
export const AFDIAN_URL = 'https://afdian.com/a/tradeofff';

