/**
 * 爱发电 Webhook 回调接口
 * POST /api/webhook/afdian
 *
 * 接收爱发电订单通知，为用户增加能量
 *
 * 新定价体系 (2024):
 * - 普朗克瞬闪: ¥9.90 / 120 积分 (仅中国区)
 * - 微型奇点:   ¥79.00 / 1000 积分
 * - 超弦引擎:   ¥159.00 / 2400 积分
 * - 拉普拉斯妖: ¥399.00 / 6500 积分
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { addCredits } from '@/lib/services/creditService';
import { getTierByAmount, type TierId } from '@/lib/config/pricingTiers';

// 充值档位配置（金额需与爱发电后台一致）
// 使用新的定价体系
const PRICING_PLANS: Record<string, { id: TierId; name: string; credits: number }> = {
  '9.90':  { id: 'tier_mini',  name: '普朗克瞬闪 (Mini)',  credits: 120 },
  '79.00': { id: 'tier_basic', name: '微型奇点 (Basic)',   credits: 1000 },
  '159.00': { id: 'tier_pro',  name: '超弦引擎 (Pro)',     credits: 2400 },
  '399.00': { id: 'tier_ultra', name: '拉普拉斯妖 (Ultra)', credits: 6500 },
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
    const existingTransaction = await prisma.transaction.findFirst({
      where: { afdianOrderId: out_trade_no },
    });

    if (existingTransaction) {
      console.log(`[Afdian Webhook] 订单已处理: ${out_trade_no}`);
      return NextResponse.json({ ec: 200, em: 'Order already processed' });
    }

    // 从留言中提取邮箱
    const remark = order.remark || '';
    const emailMatch = remark.match(/[\w.-]+@[\w.-]+\.\w+/);
    const email = emailMatch ? emailMatch[0].toLowerCase() : null;

    console.log(`[Afdian Webhook] 留言: ${remark}, 提取邮箱: ${email}`);

    if (!email) {
      console.log(`[Afdian Webhook] 留言中未找到邮箱，订单: ${out_trade_no}`);
      // 仍然返回成功，避免爱发电重试
      return NextResponse.json({ ec: 200, em: 'No email in remark, order logged for manual processing' });
    }

    // 根据邮箱查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`[Afdian Webhook] 未找到用户，邮箱: ${email}`);
      // 仍然返回成功，避免爱发电重试
      return NextResponse.json({ ec: 200, em: 'User not found, order logged for manual processing' });
    }

    // 根据金额匹配充值档位
    const plan = PRICING_PLANS[total_amount];
    if (!plan) {
      console.log(`[Afdian Webhook] 未知充值金额: ${total_amount}`);
      return NextResponse.json({ ec: 200, em: 'Unknown amount, order logged' });
    }

    // 增加用户能量（使用新的多币种接口）
    await addCredits(user.id, plan.credits, {
      planId: plan.id,
      planName: plan.name,
      paymentAmount: parseFloat(total_amount),
      currency: 'CNY',
      provider: 'afdian',
      afdianOrderId: out_trade_no,
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

