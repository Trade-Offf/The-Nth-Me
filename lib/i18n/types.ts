import type zhCN from './locales/zh-CN';

/**
 * 将对象类型中的所有字符串字面量类型转换为 string
 * 移除 readonly 修饰符，保持结构但允许不同的字符串值
 */
type DeepMutableStringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? U extends string
      ? string[]
      : DeepMutableStringify<U>[]
    : T extends object
      ? { -readonly [K in keyof T]: DeepMutableStringify<T[K]> }
      : T;

/**
 * 翻译内容类型 - 基于 zh-CN 基准语言结构
 * 使用 DeepMutableStringify 允许不同语言使用不同的字符串值
 */
export type Translations = DeepMutableStringify<typeof zhCN>;

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

