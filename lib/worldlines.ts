import { Worldline } from './types';
import { prompts, buildFullPrompt } from './prompts';

/**
 * 世界线配置
 * prompt 相关配置从 lib/prompts.ts 引用
 */
export const worldlines: Worldline[] = [
  {
    id: 'studio-portrait',
    name: '高级摄影棚',
    code: 'TL-01',
    description: '顶级摄影棚风格的半身肖像照，静谧温柔的黑白氛围',
    imageUrl: '/prompt_cover/01_高级摄影棚.png',
    prompt: buildFullPrompt(prompts.find((p) => p.id === 'studio-portrait')!),
    sampleStrength: prompts.find((p) => p.id === 'studio-portrait')?.sampleStrength || 0.75,
  },
  {
    id: 'tech-startup',
    name: '科技创业风',
    code: 'TL-02',
    description: '硅谷风格专业形象照，现代简约，创业者气质',
    imageUrl: '/prompt_cover/02_科技创业风.png',
    prompt: buildFullPrompt(prompts.find((p) => p.id === 'tech-startup')!),
    sampleStrength: prompts.find((p) => p.id === 'tech-startup')?.sampleStrength || 1.0,
  },
  {
    id: 'collectible-figure',
    name: '人偶手办',
    code: 'TL-03',
    description: '1/7比例商业化手办，逼真风格，电脑桌场景展示',
    imageUrl: '/prompt_cover/03_人偶手办.png',
    prompt: buildFullPrompt(prompts.find((p) => p.id === 'collectible-figure')!),
    sampleStrength: prompts.find((p) => p.id === 'collectible-figure')?.sampleStrength || 1.0,
  },
];
