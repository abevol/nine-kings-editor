# 九王 9 Kings 存档编辑器

这是一个用于编辑《九王 9 Kings》游戏存档的工具，提供了直观的图形界面来修改游戏设置。

## 功能特点

- 🎮 调整游戏玩法设置
- 👑 调整国王属性和天赋点数
- 🎯 调整难度设置
- 🌍 多语言支持（英语、简体中文、繁体中文、日语）

## 安装说明

1. 确保你的系统已安装 [Node.js](https://nodejs.org/) (推荐版本 16.x 或更高)
2. 克隆此仓库到本地：
   ```bash
   git clone https://github.com/你的用户名/nine-kings-editor.git
   cd nine-kings-editor
   ```
3. 安装依赖：
   ```bash
   npm install
   ```
4. 启动应用：
   ```bash
   npm start
   ```
5. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 使用方法

1. 启动编辑器后，点击"打开配置"按钮
2. 选择你的游戏存档文件 `9KingsSettings.json`
   - 存档文件通常位于该目录 `%USERPROFILE%\AppData\LocalLow\SadSocket\9Kings\`
3. 在编辑器中修改需要调整的设置
4. 点击"下载配置"保存修改后的文件
5. 将下载的文件替换原始存档文件
   - 替换前请先备份原始存档文件
   - 替换时请确保游戏已关闭

## 注意事项

- ⚠️ 在替换存档文件之前，请务必备份原始文件
- 🎮 修改存档文件时，游戏必须处于关闭状态
- 💾 建议在替换存档文件之前先测试游戏是否正常运行
- 🔄 如果游戏更新后存档格式发生变化，可能需要更新编辑器

## 开发说明

- 本项目使用 React + TypeScript 开发
- 使用 Material-UI 组件库构建界面
- 支持 i18n 国际化

如果你想参与开发，欢迎提交 Pull Request。在提交之前，请确保：
1. 代码已经过格式化
2. 所有的 TypeScript 类型检查都已通过
3. 没有编译警告
4. 更新了相应的文档

## 许可证

本项目采用 GPL - 3.0 许可证。详见 [LICENSE](LICENSE) 文件。
