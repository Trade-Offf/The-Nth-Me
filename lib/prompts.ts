/**
 * Prompt 配置文件
 * 所有世界线的 AI 生成提示词集中管理
 *
 * 每个 Prompt 包含:
 * - id: 唯一标识符，与 worldline id 对应（也用于定位 showcase 图片目录）
 * - name: 显示名称
 * - prompt: AI 生成提示词（英文）
 * - negativePrompt: 负面提示词（可选）
 * - sampleStrength: 风格强度 (0-2)
 * - tags: 标签分类
 * - hasShowcase: 是否有展示图片（默认 true）
 *
 * 展示图片约定路径: /showcase/{id}/before.png, /showcase/{id}/after.png
 */

export interface PromptConfig {
  id: string;
  name: string;
  prompt: string;
  negativePrompt?: string;
  sampleStrength: number;
  tags: string[];
  hasShowcase?: boolean; // 默认 true，表示有展示图片
}

/**
 * 所有可用的 Prompt 配置
 */
export const prompts: PromptConfig[] = [
  {
    id: 'studio-portrait',
    name: '高级摄影棚',
    prompt:
      '将图片转换为摄影棚风格的顶级半身肖像照。人物穿着都市休闲服饰，动作自然放松，镜头特写、聚焦面部。背景为柔和的渐变色，层次分明，突出主体与背景的分离，并加入 gobo lighting 光影投射，形成几何或窗棂状的光影效果。画面氛围静谧而温柔，细腻胶片颗粒质感，柔和定向光轻抚面庞，在眼神处留下光点，营造经典黑白摄影的高级氛围。中心构图',
    sampleStrength: 0.75,
    tags: ['摄影', '人像', '黑白', '高级'],
  },
  {
    id: 'tech-startup',
    name: '科技创业风',
    prompt: `Edit this image. I need a professional, high-resolution, profile photo, maintaining the exact facial structure, identity, and key features of the person in the input image. The subject is framed from the chest up, with ample headroom and negative space above their head, ensuring the top of their head is not cropped. The person looks directly at the camera with a relaxed, approachable expression, and the subject's body is casually positioned with a slight lean. They are styled for a professional photo studio shoot, wearing a modern henley shirt in heather gray with rolled sleeves. The background is a solid '#141414' neutral studio. Shot from a high angle with bright and airy soft, diffused studio lighting, gently illuminating the face and creating a subtle catchlight in the eyes, conveying a sense of innovation and accessibility. Captured on an 85mm f/1.8 lens with a shallow depth of field, exquisite focus on the eyes, and beautiful, soft bokeh. Observe crisp detail on the fabric texture of the henley, individual strands of hair, and natural, realistic skin texture，keep the glass if the picture has . The atmosphere exudes confidence, innovation, and modern professionalism. Clean and bright cinematic color grading with subtle warmth and balanced tones, ensuring a polished and contemporary feel.`,
    sampleStrength: 1.0,
    tags: ['商务', '科技', '创业', '专业', '现代'],
  },
  {
    id: 'collectible-figure',
    name: '人偶手办',
    prompt:
      'Create a 1/7 scale commercialized figure of the character in the illustration, in a realistic style and environment. Place the figure on a computer desk, using a circular transparent acrylic base without any text. On the computer screen, display the ZBrush modeling process of the figure. Next to the computer screen, place a BANDAI-style toy packaging box printed with the original artwork.',
    sampleStrength: 1.0,
    tags: ['手办', '3D', '商业', 'BANDAI'],
  },
];

/**
 * 根据 ID 获取 Prompt 配置
 */
export function getPromptById(id: string): PromptConfig | undefined {
  return prompts.find((p) => p.id === id);
}

/**
 * 根据标签过滤 Prompts
 */
export function getPromptsByTag(tag: string): PromptConfig[] {
  return prompts.filter((p) => p.tags.includes(tag));
}

/**
 * 获取所有唯一标签
 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  prompts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

/**
 * 构建完整的 prompt（包含负面提示词）
 */
export function buildFullPrompt(config: PromptConfig): string {
  if (config.negativePrompt) {
    return `${config.prompt}\nNegative prompt: ${config.negativePrompt}`;
  }
  return config.prompt;
}
