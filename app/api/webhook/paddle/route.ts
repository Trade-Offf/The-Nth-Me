/**
 * Paddle Webhook 回调接口
 * POST /api/webhook/paddle
 * 
 * 接收 Paddle 支付通知，为用户增加能量
 * 
 * Paddle Webhook 文档:
 * https://developer.paddle.com/webhooks/overview
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { addCredits } from '@/lib/services/creditService';
import { getTierById, type TierId } from '@/lib/config/pricingTiers';

// Paddle Webhook Secret (用于验证签名)
const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET || '';

// Paddle Webhook 事件类型
interface PaddleWebhookEvent {
  event_id: string;
  event_type: string;
  occurred_at: string;
  data: {
    id: string;  // Transaction ID
    status: string;
    customer_id: string;
    currency_code: string;
    details: {
      totals: {
        total: string;
      };
    };
    items: Array<{
      price: {
        id: string;  // Price ID
      };
      quantity: number;
    }>;
    custom_data?: {
      userId?: string;
      tierId?: string;
    };
    checkout?: {
      url: string;
    };
  };
}

/**
 * 验证 Paddle Webhook 签名
 */
function verifyPaddleSignature(payload: string, signature: string): boolean {
  if (!PADDLE_WEBHOOK_SECRET) {
    console.warn('[Paddle Webhook] No secret configured, skipping verification');
    return true; // 开发环境可跳过
  }

  try {
    // Paddle 使用 HMAC-SHA256 签名
    const hmac = crypto.createHmac('sha256', PADDLE_WEBHOOK_SECRET);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('paddle-signature') || '';

    // 验证签名
    if (!verifyPaddleSignature(payload, signature)) {
      console.error('[Paddle Webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event: PaddleWebhookEvent = JSON.parse(payload);

    console.log('[Paddle Webhook] 收到事件:', event.event_type, event.event_id);

    // 只处理支付完成事件
    if (event.event_type !== 'transaction.completed') {
      console.log(`[Paddle Webhook] 忽略事件类型: ${event.event_type}`);
      return NextResponse.json({ received: true });
    }

    const { data } = event;
    const transactionId = data.id;

    // 检查订单是否已处理（防止重复）
    const existingTransaction = await prisma.transaction.findUnique({
      where: { paddleOrderId: transactionId },
    });

    if (existingTransaction) {
      console.log(`[Paddle Webhook] 订单已处理: ${transactionId}`);
      return NextResponse.json({ received: true, message: 'Already processed' });
    }

    // 获取用户 ID 和档位 ID
    const userId = data.custom_data?.userId;
    const tierId = data.custom_data?.tierId as TierId | undefined;

    if (!userId) {
      console.error('[Paddle Webhook] 缺少 userId');
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // 验证用户存在
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.error(`[Paddle Webhook] 用户不存在: ${userId}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 获取档位信息
    const tier = tierId ? getTierById(tierId) : undefined;
    if (!tier) {
      console.error(`[Paddle Webhook] 未知档位: ${tierId}`);
      return NextResponse.json({ error: 'Unknown tier' }, { status: 400 });
    }

    // 解析金额
    const amount = parseFloat(data.details.totals.total) / 100; // Paddle 金额单位是分

    // 增加用户能量
    await addCredits(userId, tier.credits, {
      planId: tier.id,
      planName: `${tier.id} (Paddle)`,
      paymentAmount: amount,
      currency: 'USD',
      provider: 'paddle',
      paddleOrderId: transactionId,
      rawWebhook: event as unknown as object,
    });

    console.log(
      `[Paddle Webhook] 充值成功！用户: ${user.email}, 档位: ${tier.id}, 能量: +${tier.credits}, 金额: $${amount}`
    );

    return NextResponse.json({ received: true, success: true });
  } catch (error) {
    console.error('[Paddle Webhook] 处理失败:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// 健康检查端点
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Paddle Webhook endpoint is ready',
    configured: !!PADDLE_WEBHOOK_SECRET,
  });
}

