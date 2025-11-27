/**
 * 图片工具函数
 * 用于验证和转换图片格式
 */

// 支持的图片格式
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// 最大文件大小（5MB）
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * 验证 base64 图片
 */
export function validateBase64Image(base64: string): {
  valid: boolean;
  error?: string;
} {
  try {
    // 检查是否为 base64 格式
    if (!base64.startsWith('data:image/')) {
      return { valid: false, error: '图片格式不正确' };
    }

    // 提取 MIME 类型
    const mimeMatch = base64.match(/^data:(image\/[a-z]+);base64,/);
    if (!mimeMatch) {
      return { valid: false, error: '无法识别图片类型' };
    }

    const mimeType = mimeMatch[1];
    if (!SUPPORTED_IMAGE_TYPES.includes(mimeType)) {
      return {
        valid: false,
        error: `不支持的图片格式，仅支持 JPG、PNG、WebP`,
      };
    }

    // 估算文件大小（base64 编码后约为原文件的 4/3）
    const base64Data = base64.split(',')[1];
    const estimatedSize = (base64Data.length * 3) / 4;

    if (estimatedSize > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `图片大小超过限制（最大 5MB）`,
      };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: '图片验证失败' };
  }
}

/**
 * 将 File 对象转换为 base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
}

/**
 * 将 base64 转换为 Blob
 */
export function base64ToBlob(base64: string): Blob {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * 压缩图片（如果需要）
 * 注意：这是一个简单的实现，实际项目中可能需要更复杂的压缩逻辑
 */
export async function compressImage(
  base64: string,
  maxWidth: number = 1024,
  quality: number = 0.9
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // 如果图片宽度超过最大宽度，按比例缩放
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // 转换为 base64
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = base64;
  });
}

/**
 * 获取图片尺寸
 */
export function getImageDimensions(
  base64: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => reject(new Error('无法获取图片尺寸'));
    img.src = base64;
  });
}

