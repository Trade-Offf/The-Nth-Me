import { Worldline } from './types';
import { prompts, buildFullPrompt } from './prompts';

/**
 * 世界线配置
 * prompt 相关配置从 lib/prompts.ts 引用
 */
export const worldlines: Worldline[] = [
  {
    id: 'studio-portrait',
    name: '光影实验室',
    code: 'TL-01',
    description: '高保真光子捕捉，单色矩阵渲染，生物特征深度扫描',
    imageUrl: '/prompt_cover/01_高级摄影棚.png',
    prompt: buildFullPrompt(prompts.find((p) => p.id === 'studio-portrait')!),
    sampleStrength: prompts.find((p) => p.id === 'studio-portrait')?.sampleStrength || 0.75,
  },
  {
    id: 'tech-startup',
    name: '硅谷原型体',
    code: 'TL-02',
    description: '企业协议渲染，神经链接优化，创始人模式激活',
    imageUrl: '/prompt_cover/02_科技创业风.png',
    prompt: buildFullPrompt(prompts.find((p) => p.id === 'tech-startup')!),
    sampleStrength: prompts.find((p) => p.id === 'tech-startup')?.sampleStrength || 1.0,
  },
  {
    id: 'collectible-figure',
    name: '量子人偶',
    code: 'TL-03',
    description: '实体化协议执行，3D渲染引擎，收藏级商品化输出',
    imageUrl: '/prompt_cover/03_人偶手办.png',
    prompt: buildFullPrompt(prompts.find((p) => p.id === 'collectible-figure')!),
    sampleStrength: prompts.find((p) => p.id === 'collectible-figure')?.sampleStrength || 1.0,
  },
];
