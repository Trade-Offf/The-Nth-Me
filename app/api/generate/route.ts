/**
 * 图片生成 API Route
 * POST /api/generate
 *
 * 支持两种模式：
 * 1. 模板模式（worldlineId）- 使用预设提示词
 * 2. 自由生成模式（prompt）- 用户自定义提示词
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateImage } from '@/lib/api/nanobananaApi';
import { validateBase64Image } from '@/lib/utils/imageUtils';
import { worldlines } from '@/lib/worldlines';
import {
  hasEnoughCredits,
  deductCredits,
  addBonusCredits,
} from '@/lib/services/creditService';
import type { GenerateRequest, GenerateResponse, ModelType } from '@/lib/types';
import { CREDITS_STANDARD, CREDITS_PRO } from '@/lib/types';

// 计算积分消耗
function getCreditsForModel(model: ModelType): number {
  return model === 'pro' ? CREDITS_PRO : CREDITS_STANDARD;
}

export async function POST(request: NextRequest) {
  try {
    // 0. 验证用户登录状态
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: '请先登录',
          errorCode: 'UNAUTHORIZED',
        } as GenerateResponse,
        { status: 401 }
      );
    }

    console.log('[API] 用户已登录:', session.user.email);

    // 1. 解析请求体
    const body: GenerateRequest = await request.json();
    const {
      model = 'standard',
      taskType = 'image-to-image',
      image,
      prompt: userPrompt,
      worldlineId,
      imageSize = '1:1',
      resolution = '1K',
      watermark,
    } = body;

    // 2. 确定提示词
    let finalPrompt: string;

    if (worldlineId) {
      // 模板模式：使用世界线提示词
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
      finalPrompt = worldline.prompt;
      console.log('[API] 模板模式，世界线:', worldline.name);
    } else if (userPrompt) {
      // 自由生成模式：使用用户提示词
      finalPrompt = userPrompt;
      console.log('[API] 自由生成模式');
    } else {
      return NextResponse.json(
        {
          success: false,
          error: '缺少提示词参数',
          errorCode: 'MISSING_PROMPT',
        } as GenerateResponse,
        { status: 400 }
      );
    }

    console.log('[API] Model:', model, 'TaskType:', taskType);
    console.log('[API] Prompt:', finalPrompt.substring(0, 100) + '...');

    // 3. 验证图片（Image-to-Image 模式必须有图片）
    let base64Images: string[] = [];
    if (taskType === 'image-to-image') {
      if (!image) {
        return NextResponse.json(
          {
            success: false,
            error: 'Image-to-Image 模式需要上传图片',
            errorCode: 'MISSING_IMAGE',
          } as GenerateResponse,
          { status: 400 }
        );
      }
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
      base64Images = [image];
    }

    // 4. 计算积分消耗
    const creditsNeeded = getCreditsForModel(model);
    const userId = session.user.id;

    // 5. 检查用户能量余额
    const hasCredits = await hasEnoughCredits(userId, creditsNeeded);
    if (!hasCredits) {
      return NextResponse.json(
        {
          success: false,
          error: `能量不足，${model === 'pro' ? 'Pro 模型' : 'Standard 模型'}需要 ${creditsNeeded} 点能量`,
          errorCode: 'INSUFFICIENT_CREDITS',
        } as GenerateResponse,
        { status: 402 }
      );
    }

    // 6. 先扣除能量
    const deducted = await deductCredits(userId, creditsNeeded);
    if (!deducted) {
      return NextResponse.json(
        {
          success: false,
          error: '能量扣除失败，请重试',
          errorCode: 'DEDUCT_FAILED',
        } as GenerateResponse,
        { status: 500 }
      );
    }

    console.log(`[API] 已扣除 ${creditsNeeded} 点能量，用户: ${userId}`);

    // 7. 调用 NanoBanana API 生成图像
    let imageUrl: string;
    try {
      imageUrl = await generateImage(finalPrompt, base64Images, {
        model,
        taskType,
        imageSize,
        aspectRatio: imageSize as '1:1' | '16:9' | '9:16' | '4:3' | '3:4',
        resolution,
        watermark,
      });
    } catch (genError) {
      // 生成失败，退还能量
      console.log(`[API] 生成失败，退还 ${creditsNeeded} 点能量给用户: ${userId}`);
      await addBonusCredits(userId, creditsNeeded, '生成失败退还');
      throw genError;
    }

    console.log('[API] 生成成功，返回结果');

    // 8. 返回成功响应
    return NextResponse.json({
      success: true,
      imageUrl,
      creditsUsed: creditsNeeded,
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

