import type { LangCode, LangMeta, Translations } from '../types';
import zhCN from './zh-CN';
import enUS from './en-US';

/**
 * 支持的语言列表
 * 添加新语言时：
 * 1. 创建新的语言文件 (如 ja-JP.ts)
 * 2. 在此处 import
 * 3. 添加到 SUPPORTED_LANGS
 * 4. 添加到 translations
 * 5. 在 types.ts 中添加 LangCode
 */
export const SUPPORTED_LANGS: LangMeta[] = [
  { code: 'en-US', name: 'English', nameEn: 'English', flag: '🇺🇸' },
  { code: 'zh-CN', name: '简体中文', nameEn: 'Chinese', flag: '🇨🇳' },
  // { code: 'ja-JP', name: '日本語', nameEn: 'Japanese', flag: '🇯🇵' },
  // { code: 'ko-KR', name: '한국어', nameEn: 'Korean', flag: '🇰🇷' },
];

/**
 * 翻译内容映射
 * 使用类型断言处理 as const 的 readonly 问题
 */
export const translations: Record<LangCode, Translations> = {
  'zh-CN': zhCN as unknown as Translations,
  'en-US': enUS,
};

/**
 * 默认语言
 */
export const DEFAULT_LANG: LangCode = 'en-US';

