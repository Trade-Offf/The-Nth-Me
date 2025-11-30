/**
 * Paddle SDK 集成
 * 
 * Paddle 是一个 Merchant of Record (MoR) 支付平台
 * 自动处理全球税务、发票等合规问题
 * 
 * 文档: https://developer.paddle.com/paddlejs/overview
 */

import { PADDLE_CONFIG } from '@/lib/config/pricingTiers';

// Paddle 类型定义
declare global {
  interface Window {
    Paddle?: {
      Environment: {
        set: (env: 'sandbox' | 'production') => void;
      };
      Initialize: (options: { token: string }) => void;
      Checkout: {
        open: (options: PaddleCheckoutOptions) => void;
      };
    };
  }
}

export interface PaddleCheckoutOptions {
  items: Array<{
    priceId: string;
    quantity: number;
  }>;
  customer?: {
    email?: string;
  };
  customData?: {
    userId?: string;
    tierId?: string;
  };
  settings?: {
    displayMode?: 'overlay' | 'inline';
    theme?: 'light' | 'dark';
    locale?: string;
    successUrl?: string;
  };
}

let paddleInitialized = false;

/**
 * 初始化 Paddle SDK
 * 需要在客户端调用
 */
export async function initializePaddle(): Promise<boolean> {
  if (typeof window === 'undefined') {
    console.warn('[Paddle] Cannot initialize on server side');
    return false;
  }

  if (paddleInitialized) {
    return true;
  }

  // 检查是否配置了 Paddle Client Token
  if (!PADDLE_CONFIG.clientToken) {
    console.warn('[Paddle] Client token not configured');
    return false;
  }

  return new Promise((resolve) => {
    // 检查是否已加载
    if (window.Paddle) {
      initPaddleInstance();
      resolve(true);
      return;
    }

    // 动态加载 Paddle.js
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    
    script.onload = () => {
      initPaddleInstance();
      resolve(true);
    };
    
    script.onerror = () => {
      console.error('[Paddle] Failed to load Paddle.js');
      resolve(false);
    };

    document.head.appendChild(script);
  });
}

/**
 * 初始化 Paddle 实例
 */
function initPaddleInstance() {
  if (!window.Paddle) {
    console.error('[Paddle] Paddle.js not loaded');
    return;
  }

  // 设置环境
  window.Paddle.Environment.set(PADDLE_CONFIG.environment);
  
  // 初始化
  window.Paddle.Initialize({
    token: PADDLE_CONFIG.clientToken,
  });

  paddleInitialized = true;
  console.log(`[Paddle] Initialized in ${PADDLE_CONFIG.environment} mode`);
}

/**
 * 打开 Paddle Checkout
 */
export function openPaddleCheckout(options: PaddleCheckoutOptions): boolean {
  if (typeof window === 'undefined' || !window.Paddle) {
    console.error('[Paddle] Paddle not available');
    return false;
  }

  try {
    window.Paddle.Checkout.open({
      ...options,
      settings: {
        displayMode: 'overlay',
        theme: 'dark',
        ...options.settings,
      },
    });
    return true;
  } catch (error) {
    console.error('[Paddle] Checkout error:', error);
    return false;
  }
}

/**
 * 检查 Paddle 是否可用
 */
export function isPaddleAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.Paddle && paddleInitialized;
}

