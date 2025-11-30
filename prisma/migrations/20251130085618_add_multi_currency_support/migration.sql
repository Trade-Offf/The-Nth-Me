/*
  Multi-currency support migration

  处理现有数据：
  1. 先添加新字段（允许 NULL）
  2. 将 amountCny 数据迁移到 amount
  3. 设置默认值后改为 NOT NULL
  4. 删除旧字段
*/

-- Step 1: 添加新字段（先允许 NULL）
ALTER TABLE "transactions"
ADD COLUMN "amount" DECIMAL(10,2),
ADD COLUMN "currency" TEXT DEFAULT 'CNY',
ADD COLUMN "paddleOrderId" TEXT,
ADD COLUMN "planId" TEXT,
ADD COLUMN "provider" TEXT DEFAULT 'afdian';

-- Step 2: 将现有 amountCny 数据迁移到 amount，没有金额的设为 0
UPDATE "transactions" SET "amount" = COALESCE("amountCny", 0);

-- Step 3: 将 amount 设为 NOT NULL
ALTER TABLE "transactions" ALTER COLUMN "amount" SET NOT NULL;
ALTER TABLE "transactions" ALTER COLUMN "currency" SET NOT NULL;
ALTER TABLE "transactions" ALTER COLUMN "provider" SET NOT NULL;

-- Step 4: 删除旧字段 amountCny
ALTER TABLE "transactions" DROP COLUMN "amountCny";

-- CreateTable
CREATE TABLE "redeem_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "maxUses" INTEGER NOT NULL DEFAULT 1,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redeem_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "code_redemptions" (
    "id" TEXT NOT NULL,
    "codeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "redeem_codes_code_key" ON "redeem_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "code_redemptions_codeId_userId_key" ON "code_redemptions"("codeId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_paddleOrderId_key" ON "transactions"("paddleOrderId");

-- AddForeignKey
ALTER TABLE "code_redemptions" ADD CONSTRAINT "code_redemptions_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "redeem_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
