/**
 * 图片生成 API Route
 * POST /api/generate
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateImageWithNanoBanana } from '@/lib/api/nanobananaApi';
import { validateBase64Image } from '@/lib/utils/imageUtils';
import { worldlines } from '@/lib/worldlines';
import type { GenerateRequest, GenerateResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // 1. 解析请求体
    const body: GenerateRequest = await request.json();
    const { image, worldlineId, imageSize = '1:1' } = body;

    console.log('[API] 收到生成请求，世界线:', worldlineId, '尺寸:', imageSize);

    // 2. 验证参数
    if (!image || !worldlineId) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必要参数',
          errorCode: 'MISSING_PARAMS',
        } as GenerateResponse,
        { status: 400 }
      );
    }

    // 3. 验证图片
    const validation = validateBase64Image(image);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error || '图片验证失败',
          errorCode: 'INVALID_IMAGE',
        } as GenerateResponse,
        { status: 400 }
      );
    }

    // 4. 获取世界线配置
    const worldline = worldlines.find((w) => w.id === worldlineId);
    if (!worldline) {
      return NextResponse.json(
        {
          success: false,
          error: '无效的世界线 ID',
          errorCode: 'INVALID_WORLDLINE',
        } as GenerateResponse,
        { status: 400 }
      );
    }

    console.log('[API] 使用世界线:', worldline.name);
    console.log('[API] Prompt:', worldline.prompt);
    console.log('[API] 图片尺寸:', imageSize);

    // 5. 调用 NanoBanana API 生成图像
    const imageUrl = await generateImageWithNanoBanana(image, worldline.prompt, { imageSize });

    console.log('[API] 生成成功，返回结果');

    // 6. 返回成功响应
    return NextResponse.json({
      success: true,
      imageUrl,
    } as GenerateResponse);
  } catch (error) {
    console.error('[API] 生成失败:', error);

    // 错误处理
    const errorMessage =
      error instanceof Error ? error.message : '图片生成失败，请重试';

    // 判断错误类型
    let errorCode = 'GENERATION_FAILED';
    let statusCode = 500;

    if (errorMessage.includes('API Key')) {
      errorCode = 'INVALID_API_KEY';
      statusCode = 500;
    } else if (errorMessage.includes('频繁')) {
      errorCode = 'RATE_LIMIT';
      statusCode = 429;
    } else if (errorMessage.includes('超时')) {
      errorCode = 'TIMEOUT';
      statusCode = 504;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        errorCode,
      } as GenerateResponse,
      { status: statusCode }
    );
  }
}

// 健康检查端点（可选）
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Generate API is running',
    timestamp: new Date().toISOString(),
  });
}

