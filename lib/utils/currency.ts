/**
 * 货币检测与切换工具
 * 
 * 逻辑：
 * 1. 优先使用用户手动选择的货币（存储在 localStorage）
 * 2. 其次根据 IP 检测用户地区
 * 3. 兜底：根据浏览器语言判断
 */

import type { Currency } from '@/lib/config/pricingTiers';

const STORAGE_KEY = 'nth-me-currency';

// ==================== 货币检测 ====================

/**
 * 从 localStorage 获取用户选择的货币
 */
export function getStoredCurrency(): Currency | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'USD' || stored === 'CNY') {
    return stored;
  }
  return null;
}

/**
 * 保存用户选择的货币到 localStorage
 */
export function setStoredCurrency(currency: Currency): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, currency);
}

/**
 * 根据浏览器语言判断默认货币
 */
export function getCurrencyByLanguage(): Currency {
  if (typeof window === 'undefined') return 'USD';
  
  const lang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || '';
  // 中国大陆语言代码
  if (lang.startsWith('zh-CN') || lang === 'zh') {
    return 'CNY';
  }
  return 'USD';
}

/**
 * 通过 IP 检测用户地区
 * 使用免费的 IP 地理位置 API
 * 
 * @returns Promise<Currency> - 'CNY' for China mainland, 'USD' for others
 */
export async function detectCurrencyByIP(): Promise<Currency> {
  try {
    // 使用 ipapi.co 免费服务（每月1000次免费请求）
    const response = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(3000), // 3秒超时
    });
    
    if (!response.ok) {
      throw new Error('IP detection failed');
    }
    
    const data = await response.json();
    
    // 中国大陆 country_code 是 'CN'
    if (data.country_code === 'CN') {
      return 'CNY';
    }
    
    return 'USD';
  } catch (error) {
    console.warn('[Currency] IP detection failed, falling back to language:', error);
    return getCurrencyByLanguage();
  }
}

/**
 * 获取用户应使用的货币
 * 优先级：手动选择 > IP 检测 > 浏览器语言
 * 
 * 注意：此函数会进行异步 IP 检测，首次调用可能较慢
 */
export async function detectCurrency(): Promise<Currency> {
  // 1. 检查用户是否手动选择过
  const stored = getStoredCurrency();
  if (stored) {
    return stored;
  }
  
  // 2. 尝试 IP 检测
  const detected = await detectCurrencyByIP();
  
  // 3. 保存检测结果，避免重复检测
  setStoredCurrency(detected);
  
  return detected;
}

/**
 * 同步获取货币（不进行 IP 检测）
 * 用于初始渲染，避免闪烁
 */
export function getCurrencySync(): Currency {
  // 1. 检查用户是否手动选择过
  const stored = getStoredCurrency();
  if (stored) {
    return stored;
  }
  
  // 2. 根据浏览器语言判断
  return getCurrencyByLanguage();
}

// ==================== 货币格式化 ====================

/**
 * 格式化货币符号
 */
export function getCurrencySymbol(currency: Currency): string {
  return currency === 'USD' ? '$' : '¥';
}

/**
 * 格式化价格显示
 */
export function formatCurrencyAmount(amount: number | null, currency: Currency): string {
  if (amount === null) return 'N/A';
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toFixed(2)}`;
}

