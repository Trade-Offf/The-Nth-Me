/**
 * 积分服务
 * 处理积分的增加、扣减和查询
 */

import prisma from '@/lib/prisma';
import { CREDITS_STANDARD } from '@/lib/types';

// 新用户赠送能量数量
const NEW_USER_CREDITS = 10;

// 每次生成消耗能量（兼容旧代码）
export const CREDITS_PER_GENERATION = CREDITS_STANDARD;

/**
 * 获取用户积分信息，如果不存在则创建
 */
export async function getOrCreateUserCredits(userId: string) {
  let credit = await prisma.credit.findUnique({
    where: { userId },
  });

  if (!credit) {
    // 新用户，创建积分记录并赠送初始积分
    credit = await prisma.credit.create({
      data: {
        userId,
        balance: NEW_USER_CREDITS,
        totalEarned: NEW_USER_CREDITS,
        totalUsed: 0,
      },
    });

    // 记录赠送交易（使用新的 schema）
    await prisma.transaction.create({
      data: {
        userId,
        creditsAdded: NEW_USER_CREDITS,
        planName: '新用户注册赠送',
        amount: 0,
        currency: 'CNY',
        provider: 'afdian',
        status: 'completed',
      },
    });

    console.log(`[Credit] 新用户 ${userId} 赠送 ${NEW_USER_CREDITS} 积分`);
  }

  return credit;
}

/**
 * 获取用户积分余额
 */
export async function getUserBalance(userId: string): Promise<number> {
  const credit = await getOrCreateUserCredits(userId);
  return credit.balance;
}

/**
 * 检查用户是否有足够积分
 */
export async function hasEnoughCredits(userId: string, amount: number = 1): Promise<boolean> {
  const balance = await getUserBalance(userId);
  return balance >= amount;
}

/**
 * 扣除用户积分
 * @returns 是否成功扣除
 */
export async function deductCredits(userId: string, amount: number = 1): Promise<boolean> {
  const credit = await getOrCreateUserCredits(userId);

  if (credit.balance < amount) {
    return false;
  }

  await prisma.credit.update({
    where: { userId },
    data: {
      balance: { decrement: amount },
      totalUsed: { increment: amount },
    },
  });

  console.log(`[Credit] 用户 ${userId} 扣除 ${amount} 积分，剩余 ${credit.balance - amount}`);
  return true;
}

/**
 * 增加用户积分（支持多币种和多支付渠道）
 */
export async function addCredits(
  userId: string,
  amount: number,
  options: {
    planName?: string;
    planId?: string;
    // 支付金额和货币
    paymentAmount: number;
    currency: 'CNY' | 'USD';
    // 支付渠道
    provider: 'afdian' | 'paddle';
    afdianOrderId?: string;
    paddleOrderId?: string;
    rawWebhook?: object;
  }
): Promise<void> {
  // 确保用户有积分记录
  await getOrCreateUserCredits(userId);

  // 更新积分
  await prisma.credit.update({
    where: { userId },
    data: {
      balance: { increment: amount },
      totalEarned: { increment: amount },
    },
  });

  // 记录交易（使用新的 schema 字段）
  await prisma.transaction.create({
    data: {
      userId,
      creditsAdded: amount,
      planName: options.planName,
      planId: options.planId,
      amount: options.paymentAmount,
      currency: options.currency,
      provider: options.provider,
      afdianOrderId: options.afdianOrderId,
      paddleOrderId: options.paddleOrderId,
      rawWebhook: options.rawWebhook as object,
      status: 'completed',
    },
  });

  console.log(`[Credit] 用户 ${userId} 增加 ${amount} 积分 (${options.provider}/${options.currency})`);
}

/**
 * 添加赠送积分（不涉及支付）
 */
export async function addBonusCredits(
  userId: string,
  amount: number,
  reason: string
): Promise<void> {
  // 确保用户有积分记录
  await getOrCreateUserCredits(userId);

  // 更新积分
  await prisma.credit.update({
    where: { userId },
    data: {
      balance: { increment: amount },
      totalEarned: { increment: amount },
    },
  });

  // 记录赠送交易
  await prisma.transaction.create({
    data: {
      userId,
      creditsAdded: amount,
      planName: reason,
      amount: 0,
      currency: 'CNY',
      provider: 'afdian', // 默认
      status: 'completed',
    },
  });

  console.log(`[Credit] 用户 ${userId} 赠送 ${amount} 积分: ${reason}`);
}

/**
 * 获取用户积分详情（包含历史统计）
 */
export async function getUserCreditDetails(userId: string) {
  const credit = await getOrCreateUserCredits(userId);
  return {
    balance: credit.balance,
    totalEarned: credit.totalEarned,
    totalUsed: credit.totalUsed,
  };
}

/**
 * 获取用户交易记录
 */
export async function getUserTransactions(userId: string, limit: number = 20) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

