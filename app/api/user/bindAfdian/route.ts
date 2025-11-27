/**
 * 绑定爱发电账号接口
 * POST /api/user/bindAfdian
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface BindRequest {
  afdianId: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const body: BindRequest = await request.json();
    const { afdianId } = body;

    // 验证爱发电 ID 格式（32位十六进制）
    if (!afdianId || !/^[a-f0-9]{32}$/.test(afdianId)) {
      return NextResponse.json(
        { error: '无效的爱发电 ID 格式' },
        { status: 400 }
      );
    }

    // 检查该爱发电 ID 是否已被其他用户绑定
    const existingUser = await prisma.user.findUnique({
      where: { afdianId },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return NextResponse.json(
        { error: '该爱发电 ID 已被其他账号绑定' },
        { status: 409 }
      );
    }

    // 更新用户的爱发电 ID
    await prisma.user.update({
      where: { id: session.user.id },
      data: { afdianId },
    });

    console.log(`[API] 用户 ${session.user.email} 绑定爱发电 ID: ${afdianId}`);

    return NextResponse.json({
      success: true,
      message: '绑定成功',
    });
  } catch (error) {
    console.error('[API] 绑定爱发电失败:', error);
    return NextResponse.json(
      { error: '绑定失败，请稍后重试' },
      { status: 500 }
    );
  }
}

// 获取当前绑定状态
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { afdianId: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        afdianId: user?.afdianId || null,
        isBound: !!user?.afdianId,
      },
    });
  } catch (error) {
    console.error('[API] 获取绑定状态失败:', error);
    return NextResponse.json(
      { error: '获取绑定状态失败' },
      { status: 500 }
    );
  }
}

