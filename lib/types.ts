export interface Worldline {
  id: string;
  name: string;
  code: string;             // Timeline code (e.g., "TL-2077")
  description: string;
  imageUrl: string;
  prompt: string;           // Flux Kontext Prompt
  sampleStrength?: number;  // 0-1，风格强度，默认 0.7
}

export interface GenerationResult {
  originalImage: string;
  generatedImage: string;
  worldline: Worldline;
  timestamp: number;
}

// ========== API 相关类型 ==========

// 图片尺寸比例
export type ImageAspectRatio = '1:1' | '9:16' | '16:9';

export interface GenerateRequest {
  image: string;      // base64 格式
  worldlineId: string;
  imageSize?: ImageAspectRatio; // 图片尺寸比例
}

export interface GenerateResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  errorCode?: string;
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

