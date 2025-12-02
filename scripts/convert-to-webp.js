#!/usr/bin/env node

/**
 * PNG/JPG → WebP 自动转换脚本
 *
 * 用于 pre-commit hook，自动将 public/showcase 中的图片转为 webp
 *
 * 使用方法:
 *   node scripts/convert-to-webp.js [file1.png] [file2.jpg] ...
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const CONFIG = {
  quality: 85,           // WebP 质量 (0-100)
  maxWidth: 1920,        // 最大宽度
  allowedExts: ['.png', '.jpg', '.jpeg'],
  targetDir: 'public/showcase',  // 只处理这个目录下的图片
};

async function convertToWebp(inputPath) {
  // 只处理 public/showcase 目录下的文件
  if (!inputPath.includes(CONFIG.targetDir)) {
    console.log(`⏭️  跳过 (非 showcase 目录): ${inputPath}`);
    return null;
  }

  const ext = path.extname(inputPath).toLowerCase();
  if (!CONFIG.allowedExts.includes(ext)) {
    console.log(`⏭️  跳过 (非图片): ${inputPath}`);
    return null;
  }

  const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

  try {
    // 读取并转换
    await sharp(inputPath)
      .resize({ width: CONFIG.maxWidth, withoutEnlargement: true })
      .webp({ quality: CONFIG.quality })
      .toFile(outputPath);

    // 获取文件大小对比
    const inputSize = fs.statSync(inputPath).size;
    const outputSize = fs.statSync(outputPath).size;
    const savedPercent = ((1 - outputSize / inputSize) * 100).toFixed(1);

    console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    console.log(`   📉 ${(inputSize / 1024).toFixed(1)}KB → ${(outputSize / 1024).toFixed(1)}KB (-${savedPercent}%)`);

    // 将新文件添加到 git 暂存区
    execSync(`git add "${outputPath}"`, { stdio: 'inherit' });
    console.log(`   📦 已添加到暂存区`);

    // 从暂存区移除原文件并删除
    execSync(`git rm --cached "${inputPath}"`, { stdio: 'inherit' });
    fs.unlinkSync(inputPath);
    console.log(`   🗑️  已删除原文件`);

    return outputPath;
  } catch (error) {
    console.error(`❌ 转换失败: ${inputPath}`, error.message);
    return null;
  }
}

async function main() {
  const files = process.argv.slice(2);

  if (files.length === 0) {
    console.log('没有需要转换的文件');
    process.exit(0);
  }

  console.log('\n🖼️  开始转换图片...\n');

  const converted = [];
  for (const file of files) {
    const result = await convertToWebp(file);
    if (result) {
      converted.push(result);
    }
  }

  if (converted.length > 0) {
    console.log(`\n✨ 共转换 ${converted.length} 个文件\n`);
  }
}

main().catch(console.error);

