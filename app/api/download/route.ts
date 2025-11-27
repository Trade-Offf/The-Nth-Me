/**
 * 图片下载代理 API Route
 * POST /api/download
 * 
 * 用于代理下载远程图片，避免 CORS 问题
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: '缺少图片 URL' },
        { status: 400 }
      );
    }

    console.log('[Download] 代理下载图片:', imageUrl);

    // 如果是 base64 图片，直接返回
    if (imageUrl.startsWith('data:')) {
      return NextResponse.json({
        success: true,
        base64: imageUrl,
      });
    }

    // 如果是远程 URL，fetch 并返回 blob
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`下载失败: ${response.status}`);
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/jpeg';

    console.log('[Download] 下载成功，大小:', buffer.length, 'bytes');

    return NextResponse.json({
      success: true,
      base64: `data:${mimeType};base64,${base64}`,
    });
  } catch (error) {
    console.error('[Download] 下载失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '下载失败',
      },
      { status: 500 }
    );
  }
}

