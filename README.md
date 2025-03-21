# Electron AudioStation

![GitHub release (latest by date)](https://img.shields.io/github/v/release/sdjnmxd/electron-audiostation)
![GitHub all releases](https://img.shields.io/github/downloads/sdjnmxd/electron-audiostation/total)
![GitHub](https://img.shields.io/github/license/sdjnmxd/electron-audiostation)

一个使用 Electron 构建的 Synology AudioStation 客户端。

[English](README.en.md) | 中文

## 特性

- **双语言支持**: 自动检测系统语言并支持中文和英文界面，可在设置中手动切换
- **系统托盘集成**: 最小化到系统托盘，支持通过托盘菜单控制音乐播放
- **全局快捷键**: 使用键盘快捷键控制音乐播放，无需切换到应用窗口
- **窗口置顶**: 可选择窗口是否始终置顶
- **启动时最小化**: 可设置应用启动时自动最小化到托盘

## 下载

从 [GitHub Releases](https://github.com/sdjnmxd/electron-audiostation/releases) 下载最新版本。

## 安装

下载适合您操作系统的安装包并运行。

- Windows: `.exe` 安装文件
- macOS: `.dmg` 安装文件
- Linux: `.AppImage` 或 `.deb` 安装文件

## 使用方法

1. 首次启动时，您需要配置 Synology AudioStation 的 URL
2. 输入您的 Synology NAS 的 AudioStation URL，例如：`https://your-synology-nas:5001/audio/`
3. 登录到您的 Synology 账户
4. 享受您的音乐！

## 快捷键

- `MediaPlayPause`: 播放/暂停
- `MediaStop`: 停止
- `MediaPreviousTrack`: 上一曲
- `MediaNextTrack`: 下一曲

## 开发

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn
```

### 运行开发版本

```bash
npm start
# 或
yarn start
```

### 构建应用

```bash
npm run make
# 或
yarn make
```

## 贡献

欢迎提交 Pull Request 或创建 Issue！

## 许可证

MIT