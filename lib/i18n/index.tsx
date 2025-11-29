'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { LangCode, Translations } from './types';
import { translations, DEFAULT_LANG, SUPPORTED_LANGS } from './locales';

interface I18nContextType {
  /** 当前语言代码 */
  lang: LangCode;
  /** 翻译内容 */
  t: Translations;
  /** 切换语言 */
  setLang: (lang: LangCode) => void;
  /** 支持的语言列表 */
  supportedLangs: typeof SUPPORTED_LANGS;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'nth-me-lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(DEFAULT_LANG);
  const [isHydrated, setIsHydrated] = useState(false);

  // 客户端初始化：从 localStorage 读取语言偏好
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (stored && translations[stored]) {
      setLangState(stored);
    }
    setIsHydrated(true);
  }, []);

  // 切换语言
  const setLang = useCallback((newLang: LangCode) => {
    if (!translations[newLang]) return;
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    document.documentElement.lang = newLang;
  }, []);

  // 同步 html lang 属性
  useEffect(() => {
    if (isHydrated) {
      document.documentElement.lang = lang;
    }
  }, [lang, isHydrated]);

  return (
    <I18nContext.Provider
      value={{
        lang,
        t: translations[lang],
        setLang,
        supportedLangs: SUPPORTED_LANGS,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

/**
 * 获取 i18n 上下文
 */
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

// 导出类型和常量
export { SUPPORTED_LANGS, DEFAULT_LANG } from './locales';
export type { LangCode, Translations, LangMeta } from './types';

