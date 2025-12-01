/**
 * 兑换码兑换接口
 * POST /api/user/redeem
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redeemCode } from '@/lib/services/redeemService';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: '请输入兑换码' },
        { status: 400 }
      );
    }

    const result = await redeemCode(session.user.id, code);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, errorCode: result.errorCode },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      credits: result.credits,
      message: `恭喜您获得 ${result.credits} 能量！`,
    });
  } catch (error) {
    console.error('[API] 兑换失败:', error);
    return NextResponse.json(
      { error: '兑换失败，请稍后再试' },
      { status: 500 }
    );
  }
}

