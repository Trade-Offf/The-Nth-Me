/**
 * 用户能量查询接口
 * GET /api/user/credits
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserCreditDetails, CREDITS_PER_GENERATION } from '@/lib/services/creditService';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const credits = await getUserCreditDetails(session.user.id);

    return NextResponse.json({
      success: true,
      data: {
        balance: credits.balance,
        totalEarned: credits.totalEarned,
        totalUsed: credits.totalUsed,
        costPerGeneration: CREDITS_PER_GENERATION,
      },
    });
  } catch (error) {
    console.error('[API] 获取能量失败:', error);
    return NextResponse.json(
      { error: '获取能量信息失败' },
      { status: 500 }
    );
  }
}

