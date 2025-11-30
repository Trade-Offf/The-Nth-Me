/**
 * NanoBanana API 封装
 * 文档：
 * - Standard: https://docs.nanobananaapi.ai/nanobanana-api/generate-or-edit-image
 * - Pro: https://docs.nanobananaapi.ai/nanobanana-api/generate-image-pro
 *
 * 异步 API，需要先提交任务，然后轮询获取结果
 */

const API_BASE_URL = 'https://api.nanobananaapi.ai/api/v1/nanobanana';
const API_KEY = process.env.NANOBANANA_API_KEY;

// 请求超时时间
const TIMEOUT_MS = 30000;

// 轮询间隔（3秒）
const POLL_INTERVAL_MS = 3000;

// 最大等待时间（3分钟）
const MAX_WAIT_TIME_MS = 180000;

// 模型类型
export type ModelType = 'standard' | 'pro';

// 任务类型
export type TaskType = 'text-to-image' | 'image-to-image';

// Standard API 尺寸
export type StandardImageSize = '1:1' | '9:16' | '16:9' | '3:4' | '4:3' | '3:2' | '2:3' | '5:4' | '4:5' | '21:9';

// Pro API 尺寸
export type ProAspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '3:2' | '2:3';

// Pro API 分辨率
export type ProResolution = '1K' | '2K' | '4K';

/**
 * 生成任务响应
 */
interface GenerateResponseData {
  code: number;
  msg: string;
  data?: {
    taskId: string;
  };
}

/**
 * 任务详情响应
 */
interface TaskDetailResponse {
  code: number;
  msg: string;
  data?: {
    taskId: string;
    successFlag: 0 | 1 | 2 | 3; // 0=生成中, 1=成功, 2=创建失败, 3=生成失败
    response?: {
      originImageUrl?: string;
      resultImageUrl?: string;
    };
    errorCode?: number;
    errorMessage?: string;
  };
}

/**
 * 带超时的 fetch
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('请求超时，请稍后再试');
    }
    throw error;
  }
}

/**
 * 等待指定时间
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Standard 生成选项
 */
export interface StandardGenerateOptions {
  /** 图片尺寸比例，默认 1:1 */
  imageSize?: StandardImageSize;
  /** 生成图片数量，1-4，默认 1 */
  numImages?: 1 | 2 | 3 | 4;
  /** 水印文字（可选） */
  watermark?: string;
}

/**
 * Pro 生成选项
 */
export interface ProGenerateOptions {
  /** 图片宽高比，默认 1:1 */
  aspectRatio?: ProAspectRatio;
  /** 分辨率，默认 1K */
  resolution?: ProResolution;
}

/**
 * 统一生成选项
 */
export interface GenerateOptions {
  /** 模型类型 */
  model?: ModelType;
  /** 任务类型 */
  taskType?: TaskType;
  /** 图片尺寸比例（Standard 模式） */
  imageSize?: StandardImageSize;
  /** 图片宽高比（Pro 模式） */
  aspectRatio?: ProAspectRatio;
  /** 分辨率（Pro 模式） */
  resolution?: ProResolution;
  /** 生成图片数量，1-4，默认 1 */
  numImages?: 1 | 2 | 3 | 4;
  /** 水印文字（Standard 模式） */
  watermark?: string;
}

/**
 * 提交 Standard 图像生成/编辑任务
 */
async function submitStandardTask(
  prompt: string,
  imageUrls: string[] = [],
  options: StandardGenerateOptions = {}
): Promise<string> {
  if (!API_KEY) {
    throw new Error('API Key 未配置，请在 .env.local 中设置 NANOBANANA_API_KEY');
  }

  const { imageSize = '1:1', numImages = 1, watermark } = options;
  const isTextToImage = imageUrls.length === 0;

  console.log('[NanoBanana Standard] 提交生成任务...');
  console.log('[NanoBanana Standard] Type:', isTextToImage ? 'TEXTTOIAMGE' : 'IMAGETOIAMGE');
  console.log('[NanoBanana Standard] Prompt:', prompt);

  const requestBody: Record<string, unknown> = {
    prompt: prompt,
    type: isTextToImage ? 'TEXTTOIAMGE' : 'IMAGETOIAMGE', // 注意: API 就是这个拼写
    numImages: numImages,
    image_size: imageSize,
    callBackUrl: 'https://example.com/callback', // 必填但不使用回调
  };

  if (!isTextToImage) {
    requestBody.imageUrls = imageUrls;
  }

  if (watermark) {
    requestBody.watermark = watermark;
  }

  const response = await fetchWithTimeout(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[NanoBanana Standard] API 错误:', response.status, errorText);
    throw new Error(`API 请求失败: ${response.status}`);
  }

  const result: GenerateResponseData = await response.json();
  console.log('[NanoBanana Standard] 任务提交响应:', result);

  if (result.code !== 200 || !result.data?.taskId) {
    throw new Error(result.msg || '任务提交失败');
  }

  return result.data.taskId;
}

/**
 * 提交 Pro 图像生成任务
 */
async function submitProTask(
  prompt: string,
  imageUrls: string[] = [],
  options: ProGenerateOptions = {}
): Promise<string> {
  if (!API_KEY) {
    throw new Error('API Key 未配置，请在 .env.local 中设置 NANOBANANA_API_KEY');
  }

  const { aspectRatio = '1:1', resolution = '1K' } = options;

  console.log('[NanoBanana Pro] 提交生成任务...');
  console.log('[NanoBanana Pro] Prompt:', prompt);
  console.log('[NanoBanana Pro] AspectRatio:', aspectRatio);
  console.log('[NanoBanana Pro] Resolution:', resolution);

  const requestBody: Record<string, unknown> = {
    prompt: prompt,
    aspectRatio: aspectRatio,
    resolution: resolution,
    callBackUrl: 'https://example.com/callback',
  };

  // Pro API 支持最多 8 张参考图
  if (imageUrls.length > 0) {
    requestBody.imageUrls = imageUrls.slice(0, 8);
  }

  const response = await fetchWithTimeout(`${API_BASE_URL}/generate-pro`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[NanoBanana Pro] API 错误:', response.status, errorText);
    throw new Error(`API 请求失败: ${response.status}`);
  }

  const result: GenerateResponseData = await response.json();
  console.log('[NanoBanana Pro] 任务提交响应:', result);

  if (result.code !== 200 || !result.data?.taskId) {
    throw new Error(result.msg || '任务提交失败');
  }

  return result.data.taskId;
}

/**
 * 查询任务状态
 */
async function getTaskStatus(taskId: string): Promise<TaskDetailResponse> {
  if (!API_KEY) {
    throw new Error('API Key 未配置');
  }

  const url = `${API_BASE_URL}/record-info?taskId=${encodeURIComponent(taskId)}`;
  const response = await fetchWithTimeout(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`查询任务状态失败: ${response.status}`);
  }

  return response.json();
}

/**
 * 轮询等待任务完成
 */
async function waitForTaskCompletion(taskId: string): Promise<string> {
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_WAIT_TIME_MS) {
    const result = await getTaskStatus(taskId);
    console.log('[NanoBanana] 任务状态:', result.data?.successFlag);

    if (result.code !== 200 || !result.data) {
      throw new Error(result.msg || '查询任务状态失败');
    }

    const { successFlag, response, errorMessage } = result.data;

    switch (successFlag) {
      case 1: // 成功
        const imageUrl = response?.resultImageUrl || response?.originImageUrl;
        if (!imageUrl) {
          throw new Error('API 未返回生成的图片');
        }
        console.log('[NanoBanana] 生成成功:', imageUrl);
        return imageUrl;

      case 2: // 创建任务失败
        throw new Error(errorMessage || '创建任务失败');

      case 3: // 生成失败
        throw new Error(errorMessage || '图像生成失败');

      case 0: // 生成中
      default:
        // 继续等待
        break;
    }

    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error('生成超时，请稍后再试');
}

/**
 * 将 base64 图片上传到临时存储并获取 URL
 * 使用 freeimage.host 免费图床服务
 */
async function uploadBase64ToUrl(base64Image: string): Promise<string> {
  // 移除 data:image/xxx;base64, 前缀
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

  // 方案1: 使用 imgbb（需要 API Key）
  const IMGBB_API_KEY = process.env.IMGBB_API_KEY;
  if (IMGBB_API_KEY) {
    try {
      const params = new URLSearchParams();
      params.append('key', IMGBB_API_KEY);
      params.append('image', base64Data);

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.url) {
          console.log('[NanoBanana] 图片上传成功 (imgbb):', result.data.url);
          return result.data.url;
        }
      }
      console.log('[NanoBanana] imgbb 上传失败，尝试备选方案');
    } catch (e) {
      console.log('[NanoBanana] imgbb 上传出错:', e);
    }
  }

  // 方案2: 使用 freeimage.host（无需 API Key）
  try {
    const params = new URLSearchParams();
    params.append('key', '6d207e02198a847aa98d0a2a901485a5'); // 公开 API Key
    params.append('source', base64Data);
    params.append('format', 'json');

    const response = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.status_code === 200 && result.image?.url) {
        console.log(
          '[NanoBanana] 图片上传成功 (freeimage):',
          result.image.url
        );
        return result.image.url;
      }
    }
    console.log('[NanoBanana] freeimage 上传失败');
  } catch (e) {
    console.log('[NanoBanana] freeimage 上传出错:', e);
  }

  // 方案3: 使用 sm.ms（备选）
  try {
    const params = new URLSearchParams();
    params.append('smfile', `data:image/png;base64,${base64Data}`);
    params.append('format', 'json');

    const response = await fetch('https://sm.ms/api/v2/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data?.url) {
        console.log('[NanoBanana] 图片上传成功 (sm.ms):', result.data.url);
        return result.data.url;
      }
    }
  } catch (e) {
    console.log('[NanoBanana] sm.ms 上传出错:', e);
  }

  throw new Error('图片上传失败，所有图床均不可用');
}

/**
 * 统一生成函数 - 支持 Standard 和 Pro 模型
 * @param prompt - 生成提示词
 * @param base64Images - base64 编码的图片数组（可选，Text-to-Image 时为空）
 * @param options - 生成选项
 * @returns 生成的图片 URL
 */
export async function generateImage(
  prompt: string,
  base64Images: string[] = [],
  options: GenerateOptions = {}
): Promise<string> {
  const { model = 'standard' } = options;

  console.log(`[NanoBanana] 开始图像生成 (${model})...`);
  console.log('[NanoBanana] 参考图片数量:', base64Images.length);

  // 1. 上传图片（如果有）
  let imageUrls: string[] = [];
  if (base64Images.length > 0) {
    const uploadPromises = base64Images.map((img, index) => {
      console.log(`[NanoBanana] 上传图片 ${index + 1}/${base64Images.length}...`);
      return uploadBase64ToUrl(img);
    });
    imageUrls = await Promise.all(uploadPromises);
    console.log('[NanoBanana] 所有图片上传完成');
  }

  // 2. 根据模型类型提交任务
  let taskId: string;
  if (model === 'pro') {
    taskId = await submitProTask(prompt, imageUrls, {
      aspectRatio: options.aspectRatio,
      resolution: options.resolution,
    });
  } else {
    taskId = await submitStandardTask(prompt, imageUrls, {
      imageSize: options.imageSize,
      numImages: options.numImages,
      watermark: options.watermark,
    });
  }

  // 3. 轮询等待结果
  const resultUrl = await waitForTaskCompletion(taskId);

  return resultUrl;
}

/**
 * 兼容旧 API - 使用 NanoBanana API 生成图像（单张参考图）
 * @deprecated 使用 generateImage 代替
 */
export async function generateImageWithNanoBanana(
  base64Image: string,
  prompt: string,
  options?: { imageSize?: StandardImageSize }
): Promise<string> {
  return generateImage(prompt, [base64Image], {
    model: 'standard',
    imageSize: options?.imageSize,
  });
}

/**
 * 兼容旧 API - 使用 NanoBanana API 生成图像（多张参考图）
 * @deprecated 使用 generateImage 代替
 */
export async function generateImageWithMultipleReferences(
  base64Images: string[],
  prompt: string,
  options?: { imageSize?: StandardImageSize }
): Promise<string> {
  return generateImage(prompt, base64Images, {
    model: 'standard',
    imageSize: options?.imageSize,
  });
}

/**
 * 导出上传函数供外部使用
 */
export { uploadBase64ToUrl };

