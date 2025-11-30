export interface Worldline {
  id: string;
  name: string;
  code: string;             // Timeline code (e.g., "TL-2077")
  description: string;
  imageUrl: string;
  prompt: string;           // Flux Kontext Prompt
  sampleStrength?: number;  // 0-1，风格强度，默认 0.7
  isPro?: boolean;          // 是否为 Pro 专属模型，需要高级权限才能使用
}

export interface GenerationResult {
  originalImage: string;
  generatedImage: string;
  worldline: Worldline;
  timestamp: number;
}

// ========== API 相关类型 ==========

// 模型类型
export type ModelType = 'standard' | 'pro';

// 任务类型
export type TaskType = 'text-to-image' | 'image-to-image';

// 图片尺寸比例 (Standard)
export type ImageAspectRatio = '1:1' | '9:16' | '16:9' | '3:4' | '4:3';

// Pro 分辨率
export type ProResolution = '1K' | '2K' | '4K';

// 积分消耗
export const CREDITS_STANDARD = 4;
export const CREDITS_PRO = 24;

export interface GenerateRequest {
  /** 模型类型 */
  model?: ModelType;
  /** 任务类型 */
  taskType?: TaskType;
  /** base64 格式图片（Image-to-Image 时必填） */
  image?: string;
  /** 提示词（自由生成模式必填） */
  prompt?: string;
  /** 世界线 ID（模板模式使用） */
  worldlineId?: string;
  /** 图片尺寸比例 */
  imageSize?: ImageAspectRatio;
  /** 分辨率（Pro 模式） */
  resolution?: ProResolution;
  /** 水印（Standard 模式） */
  watermark?: string;
}

export interface GenerateResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  errorCode?: string;
  creditsUsed?: number;
}

// 银河杂货铺 API 类型
export interface GalaxyImageEditRequest {
  model: 'nanobanana' | 'gemini-2.5-flash-image' | 'gemini-2.5-flash-image-preview' | 'gemini-3-pro-image-preview';
  prompt: string;
  images: string[];  // base64 数组（只支持单张）
  response_format?: 'url' | 'b64_json';
  sample_strength?: number;
}

export interface GalaxyImageEditResponse {
  created: number;
  data: Array<{
    url?: string;
    b64_json?: string;
  }>;
  input_images?: number;
  composition_type?: string;
}

