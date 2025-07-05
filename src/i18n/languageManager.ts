import defaultTranslations from './locales/translationDefault.json';
import libraryTranslations from './locales/translationLibrary.json';

// 本地存储中语言设置的键名
const LANGUAGE_STORAGE_KEY = 'nine_kings_editor_language';

// 语言映射类型
type LanguageMap = {
  [key: string]: string;
};

// 获取所有支持的语言
export const getSupportedLanguages = (): LanguageMap => {
  // 合并两个翻译文件中的语言，并去重
  const languages = {
    ...libraryTranslations.supportedLanguages,
    ...defaultTranslations.supportedLanguages,
  } as LanguageMap;
  return languages;
};

// 获取当前语言
export const getCurrentLanguage = (): string => {
  // 1. 尝试从本地存储获取
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage && storedLanguage in getSupportedLanguages()) {
    return storedLanguage;
  }

  // 2. 尝试使用浏览器语言
  const browserLanguage = navigator.language;
  const supportedLanguages = getSupportedLanguages();

  // 检查完整的语言代码（例如 zh-CN）
  if (browserLanguage in supportedLanguages) {
    return browserLanguage;
  }

  // 检查语言的基础部分（例如 zh）
  const baseLanguage = browserLanguage.split('-')[0];
  const matchingLanguage = Object.keys(supportedLanguages).find(
    lang => lang.startsWith(baseLanguage + '-') || lang === baseLanguage
  );
  if (matchingLanguage) {
    return matchingLanguage;
  }

  // 3. 默认使用英语
  return 'en';
};

// 设置当前语言
export const setCurrentLanguage = (language: string): void => {
  if (language in getSupportedLanguages()) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    // 触发一个自定义事件，以便其他组件可以响应语言变化
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { language } }));
  } else {
    console.warn(`Language ${language} is not supported`);
  }
};

// 获取语言的本地化名称
export const getLanguageLocalName = (languageCode: string): string => {
  const supportedLanguages = getSupportedLanguages();
  return supportedLanguages[languageCode] || languageCode;
}; 