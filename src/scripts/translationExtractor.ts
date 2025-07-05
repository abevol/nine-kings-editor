import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Language {
  code: string;
  name: string;
}

interface TranslationLibrary {
  supportedLanguages: { [code: string]: string };
  terms: { [term: string]: { [lang: string]: string } };
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

// 从 I2Languages.asset 文件中提取指定前缀的术语及其翻译
function extractTermsAndTranslationsFromI2(i2Path: string, languages: Language[]): { [term: string]: { [lang: string]: string } } {
  const i2Content = fs.readFileSync(i2Path, 'utf-8');
  const lines = i2Content.split('\n');
  let isInTerms = false;
  let currentTerm: string | null = null;
  let isInLanguages = false;
  let languageIndex = 0;
  const result: { [term: string]: { [lang: string]: string } } = {};
  const validPrefixes = ['Difficulty_', 'King_', 'Perk_'];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === 'mTerms:') {
      isInTerms = true;
      continue;
    }
    if (isInTerms) {
      if (line.startsWith('- Term:')) {
        currentTerm = line.split(':')[1].trim();
        isInLanguages = false;
        languageIndex = 0;
      } else if (line === 'Languages:' && currentTerm) {
        // 检查前缀
        if (validPrefixes.some(prefix => currentTerm!.startsWith(prefix))) {
          isInLanguages = true;
          result[currentTerm] = {};
          languageIndex = 0;
        } else {
          isInLanguages = false;
        }
        continue;
      } else if (isInLanguages && line.startsWith('- ') && currentTerm) {
        const value = line.substring(2).trim();
        if (languageIndex < languages.length) {
          result[currentTerm][languages[languageIndex].code] = value;
        }
        languageIndex++;
      } else if (line.startsWith('Flags:')) {
        isInLanguages = false;
      }
    }
  }
  return result;
}

// 生成翻译术语库
function generateTranslationLibrary(
  termsAndTranslations: { [term: string]: { [lang: string]: string } },
  languages: Language[]
): TranslationLibrary {
  const supportedLanguages: { [code: string]: string } = {};
  languages.forEach(lang => {
    supportedLanguages[lang.code] = lang.name;
  });
  return {
    supportedLanguages,
    terms: termsAndTranslations
  };
}

// 主函数
export function extractTranslations() {
  const i2Path = path.join(__dirname, '../data/I2Languages.asset');
  const outputPath = path.join(__dirname, '../i18n/locales/translationLibrary.json');
  try {
    // 1. 提取支持的语言列表
    const languages = extractLanguages(i2Path);
    console.log(`提取到 ${languages.length} 种支持的语言`);
    // 2. 从 I2Languages.asset 提取术语和翻译
    const termsAndTranslations = extractTermsAndTranslationsFromI2(i2Path, languages);
    console.log(`提取到 ${Object.keys(termsAndTranslations).length} 个术语及翻译`);
    // 3. 生成翻译术语库
    const translationLibrary = generateTranslationLibrary(termsAndTranslations, languages);
    // 4. 写入文件
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