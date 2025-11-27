/**
 * 爱发电服务
 * 处理爱发电 Webhook 和 API 调用
 */

import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { addCredits } from './creditService';

// 爱发电配置
const AFDIAN_USER_ID = process.env.AFDIAN_USER_ID || '';
const AFDIAN_TOKEN = process.env.AFDIAN_TOKEN || '';

// 积分配置：金额(元) -> 积分数
const CREDIT_TIERS: { [key: number]: number } = {
  5: 10,    // 5元 = 10次
  10: 22,   // 10元 = 22次 (送2次)
  25: 60,   // 25元 = 60次 (送10次)
  50: 130,  // 50元 = 130次 (送30次)
  100: 280, // 100元 = 280次 (送80次)
};

/**
 * 根据金额计算积分
 */
export function calculateCredits(amount: number): number {
  // 精确匹配价格档位
  if (CREDIT_TIERS[amount]) {
    return CREDIT_TIERS[amount];
  }
  // 默认比例：1元 = 2次
  return Math.floor(amount * 2);
}

/**
 * 验证爱发电 Webhook 签名
 */
export function verifyAfdianSignature(
  params: string,
  ts: string,
  sign: string
): boolean {
  if (!AFDIAN_TOKEN) {
    console.error('[Afdian] 未配置 AFDIAN_TOKEN');
    return false;
  }

  // 签名算法: MD5(token + "params" + params + "ts" + ts + "user_id" + user_id)
  const signStr = `${AFDIAN_TOKEN}params${params}ts${ts}user_id${AFDIAN_USER_ID}`;
  const calculatedSign = crypto.createHash('md5').update(signStr).digest('hex');

  return calculatedSign === sign;
}

// 爱发电订单类型定义
interface AfdianOrder {
  out_trade_no: string;
  user_id: string;
  user_private_id: string;
  plan_id: string;
  month: number;
  total_amount: string;
  show_amount: string;
  status: number;
  remark: string;
  sku_detail?: Array<{
    sku_id: string;
    count: number;
    name: string;
  }>;
}

interface AfdianWebhookData {
  ec: number;
  em: string;
  data: {
    type: string;
    order: AfdianOrder;
  };
}

/**
 * 处理爱发电 Webhook
 */
export async function handleAfdianWebhook(webhookData: AfdianWebhookData): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const { data } = webhookData;
    
    if (data.type !== 'order') {
      return { success: true, message: '非订单类型，忽略' };
    }

    const order = data.order;

    // 只处理成功的订单
    if (order.status !== 2) {
      return { success: true, message: `订单状态 ${order.status}，非成功状态` };
    }

    // 检查订单是否已处理
    const existingTransaction = await prisma.transaction.findUnique({
      where: { afdianOrderId: order.out_trade_no },
    });

    if (existingTransaction) {
      return { success: true, message: '订单已处理过' };
    }

    // 查找用户（通过爱发电ID）
    let user = await prisma.user.findUnique({
      where: { afdianId: order.user_private_id },
    });

    if (!user) {
      // 用户未绑定爱发电，记录订单但暂不充值
      // 用户可以后续在用户中心绑定
      console.log(`[Afdian] 未找到绑定用户，afdianId: ${order.user_private_id}`);
      
      // 可以选择创建待处理记录或直接返回
      return { 
        success: true, 
        message: `用户未绑定，订单号: ${order.out_trade_no}` 
      };
    }

    // 计算积分
    const amount = parseFloat(order.total_amount);
    const credits = calculateCredits(amount);

    // 增加积分
    await addCredits(user.id, credits, {
      planName: order.sku_detail?.[0]?.name || '爱发电充值',
      afdianOrderId: order.out_trade_no,
      amountCny: amount,
      rawWebhook: webhookData as any,
    });

    console.log(`[Afdian] 用户 ${user.id} 充值 ${amount}元，获得 ${credits} 积分`);

    return {
      success: true,
      message: `充值成功，获得 ${credits} 积分`,
    };
  } catch (error) {
    console.error('[Afdian] Webhook 处理失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '处理失败',
    };
  }
}

/**
 * 绑定爱发电账号
 */
export async function bindAfdianAccount(
  userId: string,
  afdianId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // 检查是否已被其他用户绑定
    const existingUser = await prisma.user.findUnique({
      where: { afdianId },
    });

    if (existingUser && existingUser.id !== userId) {
      return { success: false, message: '该爱发电账号已被其他用户绑定' };
    }

    // 更新用户的爱发电ID
    await prisma.user.update({
      where: { id: userId },
      data: { afdianId },
    });

    return { success: true, message: '绑定成功' };
  } catch (error) {
    console.error('[Afdian] 绑定失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '绑定失败',
    };
  }
}

