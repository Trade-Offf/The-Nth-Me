/**
 * 定价档位配置
 * 赛博朋克/命运石之门风格的等级系统
 *
 * 支持双币种 (USD/CNY) 和双支付渠道 (Paddle/爱发电)
 */

import { Atom, Zap, Sparkles, Crown } from 'lucide-react';

// ==================== 类型定义 ====================

export type TierId = 'tier_mini' | 'tier_basic' | 'tier_pro' | 'tier_ultra';
export type Currency = 'USD' | 'CNY';
export type PaymentProvider = 'paddle' | 'afdian';

export interface PricingTier {
  id: TierId;
  credits: number;

  // 双币种价格 (null 表示该币种不可购买)
  priceUsd: number | null;  // Paddle 渠道
  priceCny: number | null;  // 爱发电渠道

  // 第三方平台 ID (用于发起支付)
  paddlePriceId: string | null;  // Paddle Price ID
  afdianSkuId: string | null;    // 爱发电商品 ID

  // 地区可见性控制
  isVisibleGlobal: boolean;  // USD 区是否可见
  isVisibleCn: boolean;      // CNY 区是否可见

  // 权限与样式
  isPro: boolean;
  isRecommended?: boolean;
  glowColor: string;
  icon: typeof Atom | typeof Zap | typeof Sparkles | typeof Crown;
}

// ==================== 配置常量 ====================

/**
 * 汇率配置
 * Safe Rate: 1 USD = 7.8 CNY (含手续费和风险缓冲)
 */
export const EXCHANGE_RATE = {
  safeRate: 7.8,
  baseCurrency: 'USD' as Currency,
};

/**
 * 定价档位配置
 * - tier_mini:  普朗克瞬闪 - 仅中国区低价引流款
 * - tier_basic: 微型奇点   - 主力入门款
 * - tier_pro:   超弦引擎   - 推荐利润款，解锁 Pro
 * - tier_ultra: 拉普拉斯妖 - 大户终极款
 */
export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'tier_mini',
    credits: 120,
    priceUsd: null,       // 不在 USD 区销售
    priceCny: 9.90,
    paddlePriceId: null,
    afdianSkuId: null,    // TODO: 配置爱发电商品 ID
    isVisibleGlobal: false,
    isVisibleCn: true,
    isPro: false,
    glowColor: 'border-zinc-700/50',
    icon: Atom,
  },
  {
    id: 'tier_basic',
    credits: 1000,
    priceUsd: 9.90,
    priceCny: 79.00,
    paddlePriceId: null,  // TODO: 配置 Paddle Price ID
    afdianSkuId: null,    // TODO: 配置爱发电商品 ID
    isVisibleGlobal: true,
    isVisibleCn: true,
    isPro: false,
    glowColor: 'border-green-900/50',
    icon: Zap,
  },
  {
    id: 'tier_pro',
    credits: 2400,
    priceUsd: 19.90,
    priceCny: 159.00,
    paddlePriceId: null,  // TODO: 配置 Paddle Price ID
    afdianSkuId: null,    // TODO: 配置爱发电商品 ID
    isVisibleGlobal: true,
    isVisibleCn: true,
    isPro: true,
    isRecommended: true,
    glowColor: 'border-green-500 shadow-[0_0_15px_rgba(0,255,0,0.3)]',
    icon: Sparkles,
  },
  {
    id: 'tier_ultra',
    credits: 6500,
    priceUsd: 49.90,
    priceCny: 399.00,
    paddlePriceId: null,  // TODO: 配置 Paddle Price ID
    afdianSkuId: null,    // TODO: 配置爱发电商品 ID
    isVisibleGlobal: true,
    isVisibleCn: true,
    isPro: true,
    glowColor: 'border-yellow-500/80 shadow-[0_0_20px_rgba(234,179,8,0.4)]',
    icon: Crown,
  },
];

// ==================== 辅助函数 ====================

/**
 * 根据货币获取可见的定价档位
 */
export function getVisibleTiers(currency: Currency): PricingTier[] {
  return PRICING_TIERS.filter(tier =>
    currency === 'USD' ? tier.isVisibleGlobal : tier.isVisibleCn
  );
}

/**
 * 根据 ID 获取定价档位
 */
export function getTierById(id: TierId): PricingTier | undefined {
  return PRICING_TIERS.find(tier => tier.id === id);
}

/**
 * 根据金额和货币匹配定价档位
 * 用于 Webhook 回调时识别用户购买的档位
 */
export function getTierByAmount(amount: number, currency: Currency): PricingTier | undefined {
  return PRICING_TIERS.find(tier => {
    const price = currency === 'USD' ? tier.priceUsd : tier.priceCny;
    return price !== null && Math.abs(price - amount) < 0.01;
  });
}

/**
 * 获取档位价格（根据货币）
 */
export function getTierPrice(tier: PricingTier, currency: Currency): number | null {
  return currency === 'USD' ? tier.priceUsd : tier.priceCny;
}

/**
 * 格式化价格显示
 */
export function formatPrice(amount: number | null, currency: Currency): string {
  if (amount === null) return 'N/A';
  const symbol = currency === 'USD' ? '$' : '¥';
  return `${symbol}${amount.toFixed(2)}`;
}

/**
 * 获取用户是否拥有 Pro 权限
 * 基于用户购买的最高档位判断
 *
 * TODO: 实际实现需要从数据库读取用户购买记录
 */
export function checkUserProAccess(userId?: string): boolean {
  return false;
}

// ==================== 支付链接配置 ====================

/**
 * 爱发电支付链接
 */
export const AFDIAN_URL = 'https://afdian.com/a/tradeofff';

/**
 * Paddle 配置
 * TODO: 替换为实际的 Paddle 配置
 */
export const PADDLE_CONFIG = {
  environment: 'sandbox' as 'sandbox' | 'production',
  clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '',
};

