import defaultTranslations from './locales/translationDefault.json';
import libraryTranslations from './locales/translationLibrary.json';
import { getCurrentLanguage } from './languageManager';

// 定义翻译条目的类型
type TranslationTerm = {
  [key: string]: string;
};

// 定义翻译库的类型
type TranslationLibrary = {
  supportedLanguages: {
    [key: string]: string;
  };
  terms: {
    [key: string]: TranslationTerm;
  };
};

// 类型断言，确保翻译文件符合我们定义的类型
const typedDefaultTranslations = defaultTranslations as TranslationLibrary;
const typedLibraryTranslations = libraryTranslations as TranslationLibrary;

// 检查语言是否在默认翻译中支持
export const isLanguageSupportedInDefault = (language: string): boolean => {
  return language in typedDefaultTranslations.supportedLanguages;
};

// 检查语言是否在库翻译中支持
export const isLanguageSupportedInLibrary = (language: string): boolean => {
  return language in typedLibraryTranslations.supportedLanguages;
};

// 从默认翻译中获取翻译
export const getDefaultTranslation = (key: string, language: string = getCurrentLanguage()): string => {
  const term = typedDefaultTranslations.terms[key];
  if (!term) {
    console.warn(`Translation key not found in default translations: ${key}`);
    return key;
  }

  if (language in term) {
    return term[language];
  }

  // 如果请求的语言不支持，返回英文翻译
  return term.en || key;
};

// 从库翻译中获取翻译
export const getLibraryTranslation = (key: string, language: string = getCurrentLanguage()): string => {
  const term = typedLibraryTranslations.terms[key];
  if (!term) {
    console.warn(`Translation key not found in library translations: ${key}`);
    return key;
  }

  if (language in term) {
    return term[language];
  }

  // 如果请求的语言不支持，返回英文翻译
  return term.en || key;
};

// 转换国王key并获取翻译
export const getKingTranslation = (kingKey: string, language: string = getCurrentLanguage()): string => {
  // 将 "KingOf" 转换为 "King_"
  const libraryKey = kingKey.replace('KingOf', 'King_');
  return getLibraryTranslation(libraryKey, language);
};

// 获取天赋翻译
export const getPerkTranslation = (perkKey: string, language: string = getCurrentLanguage()): string => {
  return getLibraryTranslation(perkKey, language);
};

// 获取天赋描述翻译
export const getPerkDescriptionTranslation = (perkKey: string, language: string = getCurrentLanguage()): string => {
  return getLibraryTranslation(`${perkKey}_Desc`, language);
};

// 获取难度翻译
export const getDifficultyTranslation = (difficultyKey: string, language: string = getCurrentLanguage()): string => {
  return getLibraryTranslation(difficultyKey, language);
}; 