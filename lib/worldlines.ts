import { Worldline } from './types';
import { prompts, buildFullPrompt } from './prompts';

/**
 * 世界线配置
 * prompt 相关配置从 lib/prompts.ts 引用
 *
 * isPro 标记：
 * - false/undefined: 标准时间线，所有用户可用
 * - true: Pro 专属时间线，需要购买「超弦引擎」或更高档位才能访问
 */
export const worldlines: Worldline[] = [
  {
    id: 'studio-portrait',
    name: '高级摄影棚黑白写真风',
    code: 'TL-01',
    description: '专业摄影棚质感，黑白光影大片，适合头像和朋友圈',
    imageUrl: '/prompt_cover/01_高级摄影棚.png',
    prompt: buildFullPrompt(prompts.find((p) => p.id === 'studio-portrait')!),
    sampleStrength: prompts.find((p) => p.id === 'studio-portrait')?.sampleStrength || 0.75,
    isPro: false, // 标准时间线
  },
  {
    id: 'tech-startup',
    name: '硅谷创投照',
    code: 'TL-02',
    description: '科技公司创始人风格，职业形象照，LinkedIn首选',
    imageUrl: '/prompt_cover/02_科技创业风.png',
    prompt: buildFullPrompt(prompts.find((p) => p.id === 'tech-startup')!),
    sampleStrength: prompts.find((p) => p.id === 'tech-startup')?.sampleStrength || 1.0,
    isPro: false, // 标准时间线
  },
  {
    id: 'collectible-figure',
    name: '3D手办风格',
    code: 'TL-03',
    description: '潮玩手办质感，精致3D渲染，适合做头像或打印',
    imageUrl: '/prompt_cover/03_人偶手办.png',
    prompt: buildFullPrompt(prompts.find((p) => p.id === 'collectible-figure')!),
    sampleStrength: prompts.find((p) => p.id === 'collectible-figure')?.sampleStrength || 1.0,
    isPro: false, // 标准时间线
  },
  {
    id: 'federal-diplomat',
    name: '西装正装照',
    code: 'TL-04',
    description: '专业正式风格，商务证件照，适合简历和职场',
    imageUrl: '/prompt_cover/04_联邦特使.png',
    prompt: buildFullPrompt(prompts.find((p) => p.id === 'federal-diplomat')!),
    sampleStrength: prompts.find((p) => p.id === 'federal-diplomat')?.sampleStrength || 1.0,
    isPro: false, // 标准时间线
  },
  {
    id: 'puzzle-deconstruction',
    name: '封面拼图照',
    code: 'TL-05',
    description: '超现实主义拼贴，碎片化艺术效果，视觉冲击力强',
    imageUrl: '/prompt_cover/05_解构协议.png',
    prompt: buildFullPrompt(prompts.find((p) => p.id === 'puzzle-deconstruction')!),
    sampleStrength: prompts.find((p) => p.id === 'puzzle-deconstruction')?.sampleStrength || 1.0,
    isPro: false, // 标准时间线
  },
  {
    id: 'reverse-engineering',
    name: '工业蓝图风',
    code: 'TL-06',
    description: '机械设计图纸风格，工程师审美，硬核科技感',
    imageUrl: '/prompt_cover/06_逆向工程.png',
    prompt: buildFullPrompt(prompts.find((p) => p.id === 'reverse-engineering')!),
    sampleStrength: prompts.find((p) => p.id === 'reverse-engineering')?.sampleStrength || 0.8,
    isPro: true, // 🔥 Pro 专属时间线
  },
];

/**
 * 获取标准时间线（非 Pro）
 */
export const getStandardWorldlines = () => worldlines.filter(w => !w.isPro);

/**
 * 获取 Pro 专属时间线
 */
export const getProWorldlines = () => worldlines.filter(w => w.isPro);
