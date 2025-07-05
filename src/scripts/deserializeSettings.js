import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取 __dirname 等价物
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取设置文件
const settingsPath = process.argv[2] || path.join(process.env.USERPROFILE, 'AppData', 'LocalLow', 'SadSocket', '9Kings', '9KingsSettings.json');

try {
    // 读取文件
    const settingsContent = fs.readFileSync(settingsPath, 'utf8');
    const settings = JSON.parse(settingsContent);

    // 转换每个设置项
    for (const key in settings) {
        const setting = settings[key];
        if (setting.SerializedValue) {
            // 解析 SerializedValue 为 JSON 对象
            setting.Value = JSON.parse(setting.SerializedValue);
            // 删除 SerializedValue
            delete setting.SerializedValue;
        }
    }

    // 写入文件
    const outputPath = path.join(__dirname, '../../data/9KingsSettings.json');
    fs.writeFileSync(outputPath, JSON.stringify(settings, null, 2));
    
    console.log('转换完成！');
    console.log(`原始文件: ${settingsPath}`);
    console.log(`输出文件: ${outputPath}`);
} catch (error) {
    console.error('处理文件时出错:', error);
    process.exit(1);
} 