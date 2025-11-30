/**
 * 图片下载代理 API Route
 * GET /api/download?url=xxx
 *
 * 用于代理下载远程图片，避免 CORS 问题
 * 直接返回二进制流，性能更好
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const imageUrl = request.nextUrl.searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: '缺少图片 URL' }, { status: 400 });
    }

    // 如果是 base64 图片，解码并返回
    if (imageUrl.startsWith('data:')) {
      const matches = imageUrl.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': mimeType,
            'Content-Disposition': `attachment; filename="nthme-${Date.now()}.png"`,
          },
        });
      }
    }

    // 直接代理远程图片，返回二进制流
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`下载失败: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || 'image/png';
    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="nthme-${Date.now()}.png"`,
        'Content-Length': String(arrayBuffer.byteLength),
      },
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
