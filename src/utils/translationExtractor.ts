import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 扁平化输出结构类型
interface TranslationLibrary {
  supportedLanguages: { [code: string]: string };
  terms: { [term: string]: { [lang: string]: string } };
}

interface Language {
  code: string;
  name: string;
}

// 从 I2Languages.asset 文件中提取语言列表
function extractLanguages(i2Path: string): Language[] {
  const i2Content = fs.readFileSync(i2Path, 'utf-8');
  const languages: Language[] = [];
  let isInLanguages = false;

  const lines = i2Content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === 'mLanguages:') {
      isInLanguages = true;
      continue;
    }

    if (isInLanguages) {
      if (line.startsWith('- Name:')) {
        const name = line.split(':')[1].trim();
        const codeLine = lines[i + 1].trim();
        let code = codeLine.split(':')[1]?.trim() || '';
        
        // 为缺少语言代码的语言补充代码
        if (!code) {
          switch (name) {
            case 'Bulgarian':
              code = 'bg';
              break;
            case 'Filipino':
              code = 'fil';
              break;
            default:
              code = name.toLowerCase();
          }
        }

        languages.push({ code, name });
      }
    }
  }

  return languages;
}

// 从设置文件中提取所有术语令牌
function extractTermsFromSettings(settingsPath: string): Set<string> {
  const settingsContent = fs.readFileSync(settingsPath, 'utf-8');
  const settings = JSON.parse(settingsContent);
  const terms = new Set<string>();

  // 递归遍历对象，提取所有以 "Perk_", "Difficulty_" 等开头的值
  function extractTermsFromObject(obj: any) {
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        const value = obj[key];
        if (key === 'SerializedValue') {
          try {
            const serializedObj = JSON.parse(value);
            extractTermsFromObject(serializedObj);
          } catch (error) {
            console.error('解析 SerializedValue 时发生错误：', error);
          }
        } else if (typeof value === 'string') {
          if (value.startsWith('Perk_') || 
              value.startsWith('Difficulty_') ||
              value.startsWith('KingOf')) {
            terms.add(value);
          }
        } else if (typeof value === 'object') {
          extractTermsFromObject(value);
        }
      }
    }
  }

  extractTermsFromObject(settings);
  return terms;
}

// 从 I2Languages.asset 文件中提取翻译
function extractTranslationsFromI2(i2Path: string, languages: Language[]): Map<string, { [key: string]: string }> {
  const i2Content = fs.readFileSync(i2Path, 'utf-8');
  const translations = new Map<string, { [key: string]: string }>();
  
  // 解析 YAML 格式的内容
  const lines = i2Content.split('\n');
  let currentTerm: string | null = null;
  let isInTerms = false;
  let isInLanguages = false;
  let languageIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === 'mTerms:') {
      isInTerms = true;
      continue;
    }

    if (isInTerms) {
      if (line.startsWith('- Term:')) {
        currentTerm = line.split(':')[1].trim();
        translations.set(currentTerm, {});
        isInLanguages = false;
        languageIndex = 0;
      } else if (line === 'Languages:') {
        isInLanguages = true;
        continue;
      } else if (isInLanguages && line.startsWith('- ') && currentTerm) {
        const value = line.substring(2).trim();
        if (translations.has(currentTerm) && languageIndex < languages.length) {
          translations.get(currentTerm)![languages[languageIndex].code] = value;
          languageIndex++;
        }
      }
    }
  }

  return translations;
}

// 生成翻译术语库
function generateTranslationLibrary(
  terms: Set<string>,
  translations: Map<string, { [key: string]: string }>,
  languages: Language[]
): TranslationLibrary {
  const supportedLanguages: { [code: string]: string } = {};
  languages.forEach(lang => {
    supportedLanguages[lang.code] = lang.name;
  });
  const flatTerms: { [term: string]: { [lang: string]: string } } = {};
  terms.forEach(term => {
    if (translations.has(term)) {
      flatTerms[term] = translations.get(term)!;
    } else {
      console.log(`警告：找不到术语 "${term}" 的翻译`);
    }
  });
  return {
    supportedLanguages,
    terms: flatTerms
  };
}

// 主函数
export function extractTranslations() {
  const settingsPath = path.join(__dirname, '../../data/9KingsSettings.json');
  const i2Path = path.join(__dirname, '../../data/I2Languages.asset');
  const outputPath = path.join(__dirname, '../../src/i18n/translationLibrary.json');

  try {
    // 1. 提取支持的语言列表
    const languages = extractLanguages(i2Path);
    console.log(`提取到 ${languages.length} 种支持的语言`);

    // 2. 从设置文件中提取术语
    const terms = extractTermsFromSettings(settingsPath);
    console.log(`提取到 ${terms.size} 个术语令牌`);

    // 3. 从 I2Languages.asset 中提取翻译
    const translations = extractTranslationsFromI2(i2Path, languages);
    console.log(`从 I2Languages 中提取到 ${translations.size} 个翻译项`);

    // 4. 生成翻译术语库
    const translationLibrary = generateTranslationLibrary(terms, translations, languages);
    console.log(`生成了 ${Object.keys(translationLibrary.terms).length} 个翻译条目`);

    // 5. 写入文件
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, JSON.stringify(translationLibrary, null, 2), 'utf-8');
    console.log('翻译术语库已成功生成！');
  } catch (error) {
    console.error('生成翻译术语库时发生错误：', error);
  }
} 