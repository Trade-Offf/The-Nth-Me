/**
 * NanoBanana API 封装
 * 文档：https://docs.nanobananaapi.ai/cn/quickstart
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

/**
 * 生成任务响应
 */
interface GenerateResponse {
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
 * 生成选项
 */
export interface GenerateOptions {
  /** 图片尺寸比例，默认 1:1 */
  imageSize?: '1:1' | '9:16' | '16:9' | '3:4' | '4:3' | '3:2' | '2:3' | '5:4' | '4:5' | '21:9';
  /** 生成图片数量，1-4，默认 1 */
  numImages?: 1 | 2 | 3 | 4;
}

/**
 * 提交图像生成/编辑任务
 * @param imageUrls - 参考图片 URL 数组（支持多张）
 * @param prompt - 生成提示词
 * @param options - 生成选项
 */
async function submitGenerateTask(
  imageUrls: string[],
  prompt: string,
  options: GenerateOptions = {}
): Promise<string> {
  if (!API_KEY) {
    throw new Error('API Key 未配置，请在 .env.local 中设置 NANOBANANA_API_KEY');
  }

  const { imageSize = '1:1', numImages = 1 } = options;

  console.log('[NanoBanana] 提交生成任务...');
  console.log('[NanoBanana] Prompt:', prompt);
  console.log('[NanoBanana] 参考图片数量:', imageUrls.length);

  const requestBody = {
    prompt: prompt,
    type: 'IMAGETOIAMGE', // 注意: API 就是这个拼写
    imageUrls: imageUrls,
    numImages: numImages,
    image_size: imageSize,
    callBackUrl: 'https://example.com/callback', // 必填但不使用回调
  };

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
    console.error('[NanoBanana] API 错误:', response.status, errorText);
    throw new Error(`API 请求失败: ${response.status}`);
  }

  const result: GenerateResponse = await response.json();
  console.log('[NanoBanana] 任务提交响应:', result);

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
 * 使用 NanoBanana API 生成图像（单张参考图）
 * @param base64Image - base64 编码的原始图片
 * @param prompt - 生成提示词
 * @param options - 生成选项
 * @returns 生成的图片 URL
 */
export async function generateImageWithNanoBanana(
  base64Image: string,
  prompt: string,
  options?: GenerateOptions
): Promise<string> {
  console.log('[NanoBanana] 开始图像生成（单张参考图）...');

  // 1. 上传图片获取 URL
  const imageUrl = await uploadBase64ToUrl(base64Image);

  // 2. 提交生成任务
  const taskId = await submitGenerateTask([imageUrl], prompt, options);

  // 3. 轮询等待结果
  const resultUrl = await waitForTaskCompletion(taskId);

  return resultUrl;
}

/**
 * 使用 NanoBanana API 生成图像（多张参考图）
 * @param base64Images - base64 编码的图片数组
 * @param prompt - 生成提示词
 * @param options - 生成选项
 * @returns 生成的图片 URL
 */
export async function generateImageWithMultipleReferences(
  base64Images: string[],
  prompt: string,
  options?: GenerateOptions
): Promise<string> {
  console.log('[NanoBanana] 开始图像生成（多张参考图）...');
  console.log('[NanoBanana] 参考图片数量:', base64Images.length);

  // 1. 并行上传所有图片
  const uploadPromises = base64Images.map((img, index) => {
    console.log(`[NanoBanana] 上传图片 ${index + 1}/${base64Images.length}...`);
    return uploadBase64ToUrl(img);
  });

  const imageUrls = await Promise.all(uploadPromises);
  console.log('[NanoBanana] 所有图片上传完成');

  // 2. 提交生成任务
  const taskId = await submitGenerateTask(imageUrls, prompt, options);

  // 3. 轮询等待结果
  const resultUrl = await waitForTaskCompletion(taskId);

  return resultUrl;
}

/**
 * 导出上传函数供外部使用
 */
export { uploadBase64ToUrl };

