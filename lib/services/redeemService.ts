/**
 * 兑换码服务
 * 处理兑换码的生成、验证和兑换
 */

import prisma from '@/lib/prisma';
import { addBonusCredits } from './creditService';

// 兑换码字符集（排除易混淆字符 0/O/I/L）
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/**
 * 生成随机兑换码
 * 格式: NTHME-XXXX-XXXX-XXXX
 */
export function generateCodeString(): string {
  const segments: string[] = [];
  for (let i = 0; i < 3; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      segment += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
    segments.push(segment);
  }
  return `NTHME-${segments.join('-')}`;
}

/**
 * 创建兑换码
 */
export async function createRedeemCode(options: {
  credits: number;
  maxUses?: number;
  expiresInDays?: number;
  createdBy?: string;
}): Promise<string> {
  const code = generateCodeString();
  
  await prisma.redeemCode.create({
    data: {
      code,
      credits: options.credits,
      maxUses: options.maxUses || 1,
      expiresAt: options.expiresInDays
        ? new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000)
        : null,
      createdBy: options.createdBy,
    },
  });

  return code;
}

/**
 * 兑换码兑换结果
 */
export interface RedeemResult {
  success: boolean;
  credits?: number;
  error?: string;
  errorCode?: 'NOT_FOUND' | 'EXPIRED' | 'MAX_USES' | 'ALREADY_USED';
}

/**
 * 兑换积分
 */
export async function redeemCode(userId: string, code: string): Promise<RedeemResult> {
  // 标准化兑换码（大写、去空格）
  const normalizedCode = code.trim().toUpperCase();

  // 查找兑换码
  const redeemCode = await prisma.redeemCode.findUnique({
    where: { code: normalizedCode },
    include: {
      redemptions: {
        where: { userId },
      },
    },
  });

  if (!redeemCode) {
    return { success: false, error: '兑换码不存在', errorCode: 'NOT_FOUND' };
  }

  // 检查是否过期
  if (redeemCode.expiresAt && redeemCode.expiresAt < new Date()) {
    return { success: false, error: '兑换码已过期', errorCode: 'EXPIRED' };
  }

  // 检查是否达到最大使用次数
  if (redeemCode.usedCount >= redeemCode.maxUses) {
    return { success: false, error: '兑换码已达到最大使用次数', errorCode: 'MAX_USES' };
  }

  // 检查该用户是否已使用过
  if (redeemCode.redemptions.length > 0) {
    return { success: false, error: '您已使用过此兑换码', errorCode: 'ALREADY_USED' };
  }

  // 执行兑换（事务）
  await prisma.$transaction(async (tx) => {
    // 更新兑换码使用次数
    await tx.redeemCode.update({
      where: { id: redeemCode.id },
      data: { usedCount: { increment: 1 } },
    });

    // 记录兑换
    await tx.codeRedemption.create({
      data: {
        codeId: redeemCode.id,
        userId,
        credits: redeemCode.credits,
      },
    });
  });

  // 发放积分
  await addBonusCredits(userId, redeemCode.credits, `兑换码: ${normalizedCode}`);

  return { success: true, credits: redeemCode.credits };
}

