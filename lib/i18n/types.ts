import type zhCN from './locales/zh-CN';

/**
 * 翻译内容类型 - 基于 zh-CN 基准语言自动推断
 * 添加新语言时，TypeScript 会强制要求实现完整结构
 */
export type Translations = typeof zhCN;

/**
 * 支持的语言代码
 * 添加新语言时需要在此处添加
 */
export type LangCode = 'zh-CN' | 'en-US';

/**
 * 语言元信息
 */
export interface LangMeta {
  code: LangCode;
  name: string;      // 原生语言名称（用于显示）
  nameEn: string;    // 英文名称
  flag: string;      // emoji 旗帜
}

/**
 * 世界线翻译内容结构
 */
export interface WorldlineI18n {
  name: string;
  description: string;
}

