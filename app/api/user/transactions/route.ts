/**
 * 用户交易记录查询接口
 * GET /api/user/transactions
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserTransactions } from '@/lib/services/creditService';

// 标记为动态路由，不进行静态渲染
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    // 获取分页参数
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    const transactions = await getUserTransactions(session.user.id, limit);

    return NextResponse.json({
      success: true,
      data: transactions.map((t) => ({
        id: t.id,
        creditsAdded: t.creditsAdded,
        planName: t.planName,
        amountCny: t.amountCny ? Number(t.amountCny) : null,
        status: t.status,
        createdAt: t.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('[API] 获取交易记录失败:', error);
    return NextResponse.json(
      { error: '获取交易记录失败' },
      { status: 500 }
    );
  }
}

