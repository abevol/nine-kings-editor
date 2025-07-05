// 版本相关配置
export interface VersionConfig {
  compatibleVersion: string;
  editorVersion: string;
}

// 文件路径配置
export interface PathConfig {
  defaultSavePath: string;
  defaultSaveDir: string;
  defaultSaveFile: string;
}

// 应用全局配置
export interface AppConfig {
  version: VersionConfig;
  paths: PathConfig;
  // 未来可能的其他配置项
  // theme?: ThemeConfig;
  // api?: ApiConfig;
  // features?: FeatureConfig;
}

// 版本配置
const versionConfig: VersionConfig = {
  compatibleVersion: '9Kings 0.7.95',
  editorVersion: '1.0.0',
};

// 文件路径配置
const pathConfig: PathConfig = {
  defaultSaveDir: '%USERPROFILE%\\AppData\\LocalLow\\SadSocket\\9Kings',
  defaultSaveFile: '9KingsSettings.json',
  // 完整路径，方便直接使用
  defaultSavePath: '%USERPROFILE%\\AppData\\LocalLow\\SadSocket\\9Kings\\9KingsSettings.json',
};

// 导出应用配置
export const appConfig: AppConfig = {
  version: versionConfig,
  paths: pathConfig,
}; 