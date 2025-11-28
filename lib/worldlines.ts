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
  {
    id: 'federal-diplomat',
    name: '联邦特使',
    code: 'TL-04',
    description: '建立外交通讯，第一类接触协议，联邦最高授权认证',
    imageUrl: '/prompt_cover/04_联邦特使.png',
    prompt: buildFullPrompt(prompts.find((p) => p.id === 'federal-diplomat')!),
    sampleStrength: prompts.find((p) => p.id === 'federal-diplomat')?.sampleStrength || 1.0,
  },
  {
    id: 'puzzle-deconstruction',
    name: '解构协议',
    code: 'TL-05',
    description: '现实拓扑重构，虚空引索检测，维度异常报告生成',
    imageUrl: '/prompt_cover/05_解构协议.png',
    prompt: buildFullPrompt(prompts.find((p) => p.id === 'puzzle-deconstruction')!),
    sampleStrength: prompts.find((p) => p.id === 'puzzle-deconstruction')?.sampleStrength || 1.0,
  },
  {
    id: 'reverse-engineering',
    name: '逆向工程',
    code: 'TL-06',
    description: '工程权重已分配，残骸数据分析，大师工匠蓝图绘制',
    imageUrl: '/prompt_cover/06_逆向工程.png',
    prompt: buildFullPrompt(prompts.find((p) => p.id === 'reverse-engineering')!),
    sampleStrength: prompts.find((p) => p.id === 'reverse-engineering')?.sampleStrength || 0.8,
  },
];
