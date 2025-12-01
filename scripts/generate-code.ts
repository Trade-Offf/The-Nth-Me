/**
 * 兑换码生成脚本
 * 
 * 使用方法:
 *   npx tsx scripts/generate-code.ts --credits=100
 *   npx tsx scripts/generate-code.ts --credits=50 --uses=10 --expires=30
 *   npx tsx scripts/generate-code.ts --credits=100 --count=5
 * 
 * 参数:
 *   --credits   积分数量 (必填)
 *   --uses      最大使用次数 (默认: 1)
 *   --expires   过期天数 (默认: 不过期)
 *   --count     生成数量 (默认: 1)
 */

import { createRedeemCode } from '../lib/services/redeemService';

async function main() {
  const args = process.argv.slice(2);
  
  // 解析参数
  const params: Record<string, string> = {};
  for (const arg of args) {
    const match = arg.match(/^--(\w+)=(.+)$/);
    if (match) {
      params[match[1]] = match[2];
    }
  }

  // 验证必填参数
  if (!params.credits) {
    console.error('❌ 缺少必填参数 --credits');
    console.log('\n使用方法:');
    console.log('  npx tsx scripts/generate-code.ts --credits=100');
    console.log('  npx tsx scripts/generate-code.ts --credits=50 --uses=10 --expires=30');
    console.log('  npx tsx scripts/generate-code.ts --credits=100 --count=5');
    process.exit(1);
  }

  const credits = parseInt(params.credits);
  const maxUses = params.uses ? parseInt(params.uses) : 1;
  const expiresInDays = params.expires ? parseInt(params.expires) : undefined;
  const count = params.count ? parseInt(params.count) : 1;

  console.log('\n🎟️  生成兑换码');
  console.log('━'.repeat(40));
  console.log(`   积分: ${credits}`);
  console.log(`   最大使用次数: ${maxUses}`);
  console.log(`   过期时间: ${expiresInDays ? `${expiresInDays} 天后` : '永不过期'}`);
  console.log(`   生成数量: ${count}`);
  console.log('━'.repeat(40));

  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    const code = await createRedeemCode({
      credits,
      maxUses,
      expiresInDays,
      createdBy: 'admin-cli',
    });
    codes.push(code);
    console.log(`   ✅ ${code}`);
  }

  console.log('━'.repeat(40));
  console.log('\n📋 复制以下兑换码:\n');
  codes.forEach(code => console.log(code));
  console.log('');

  process.exit(0);
}

main().catch((error) => {
  console.error('❌ 生成失败:', error);
  process.exit(1);
});

