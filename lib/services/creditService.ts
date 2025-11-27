/**
 * 积分服务
 * 处理积分的增加、扣减和查询
 */

import prisma from '@/lib/prisma';

// 新用户赠送能量数量
const NEW_USER_CREDITS = 10;

// 每次生成消耗能量
export const CREDITS_PER_GENERATION = 4;

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

    // 记录赠送交易
    await prisma.transaction.create({
      data: {
        userId,
        creditsAdded: NEW_USER_CREDITS,
        planName: '新用户注册赠送',
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
 * 增加用户积分
 */
export async function addCredits(
  userId: string,
  amount: number,
  options?: {
    planName?: string;
    afdianOrderId?: string;
    amountCny?: number;
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

  // 记录交易
  await prisma.transaction.create({
    data: {
      userId,
      creditsAdded: amount,
      planName: options?.planName,
      afdianOrderId: options?.afdianOrderId,
      amountCny: options?.amountCny,
      rawWebhook: options?.rawWebhook as any,
      status: 'completed',
    },
  });

  console.log(`[Credit] 用户 ${userId} 增加 ${amount} 积分`);
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

