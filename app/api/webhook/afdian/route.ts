/**
 * 爱发电 Webhook 回调接口
 * POST /api/webhook/afdian
 * 
 * 接收爱发电订单通知，为用户增加能量
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { addCredits } from '@/lib/services/creditService';

// 充值档位配置
const PRICING_PLANS: Record<string, { name: string; credits: number }> = {
  '19.90': { name: '基础版 (Basic)', credits: 200 },
  '39.90': { name: '进阶版 (Pro)', credits: 550 },
  '99.00': { name: '终极版 (Ultra)', credits: 1500 },
};

// 爱发电 Webhook 数据结构
interface AfdianWebhookData {
  ec: number;
  em: string;
  data: {
    type: string;
    order: {
      out_trade_no: string;
      user_id: string;
      plan_id: string;
      month: number;
      total_amount: string;
      show_amount: string;
      status: number;
      remark: string;
      product_type: number;
      discount: string;
      sku_detail: unknown[];
      address_person: string;
      address_phone: string;
      address_address: string;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: AfdianWebhookData = await request.json();

    console.log('[Afdian Webhook] 收到请求:', JSON.stringify(body, null, 2));

    // 验证请求格式
    if (body.ec !== 200 || !body.data?.order) {
      console.log('[Afdian Webhook] 无效请求格式');
      return NextResponse.json({ ec: 400, em: 'Invalid request format' });
    }

    const { order } = body.data;
    const { out_trade_no, user_id: afdianUserId, total_amount, status } = order;

    // 只处理已完成的订单 (status === 2)
    if (status !== 2) {
      console.log(`[Afdian Webhook] 订单状态不是已完成: ${status}`);
      return NextResponse.json({ ec: 200, em: 'Order not completed, skipped' });
    }

    // 检查订单是否已处理（防止重复）
    const existingTransaction = await prisma.transaction.findUnique({
      where: { afdianOrderId: out_trade_no },
    });

    if (existingTransaction) {
      console.log(`[Afdian Webhook] 订单已处理: ${out_trade_no}`);
      return NextResponse.json({ ec: 200, em: 'Order already processed' });
    }

    // 根据爱发电 user_id 查找用户
    const user = await prisma.user.findUnique({
      where: { afdianId: afdianUserId },
    });

    if (!user) {
      console.log(`[Afdian Webhook] 未找到绑定用户，爱发电ID: ${afdianUserId}`);
      // 仍然返回成功，避免爱发电重试
      // 可以记录到待处理队列，后续人工处理
      return NextResponse.json({ ec: 200, em: 'User not found, order logged' });
    }

    // 根据金额匹配充值档位
    const plan = PRICING_PLANS[total_amount];
    if (!plan) {
      console.log(`[Afdian Webhook] 未知充值金额: ${total_amount}`);
      return NextResponse.json({ ec: 200, em: 'Unknown amount, order logged' });
    }

    // 增加用户能量
    await addCredits(user.id, plan.credits, {
      planName: plan.name,
      afdianOrderId: out_trade_no,
      amountCny: parseFloat(total_amount),
      rawWebhook: body as unknown as object,
    });

    console.log(
      `[Afdian Webhook] 充值成功！用户: ${user.email}, 档位: ${plan.name}, 能量: +${plan.credits}`
    );

    // 返回成功响应（爱发电要求格式）
    return NextResponse.json({ ec: 200, em: 'ok' });
  } catch (error) {
    console.error('[Afdian Webhook] 处理失败:', error);
    // 返回成功避免爱发电重试，但记录错误
    return NextResponse.json({ ec: 200, em: 'Internal error logged' });
  }
}

// 测试端点
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Afdian Webhook endpoint is ready',
    plans: PRICING_PLANS,
  });
}

