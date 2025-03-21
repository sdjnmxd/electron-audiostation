<p align="right">
  English | <a href="README.md">中文</a>
</p>

<p align="center">
  <img src="assets/icon.png" alt="logo" height="180" />
</p>

<h1 align="center">Electron AudioStation</h1>

<p align="center">
  A lightweight Synology AudioStation client for macOS and Windows. Built with Electron.
</p>

![preview](https://user-images.githubusercontent.com/6388562/64693419-d34c0380-d4c9-11e9-90e8-1fdc0d778c36.png)

## ✨ Features

- 🎵 Wraps Synology AudioStation web into a native desktop application
- 🎮 Media control shortcuts: Play/Pause, Next Track, Previous Track, Stop
- 🔊 Volume control: Volume Up, Volume Down
- 🌐 Multi-language support: English and Chinese interfaces
- ⚙️ Simple configuration: Quick settings edit for all options
- 🖥️ Cross-platform: Supports macOS and Windows

## 📦 Installation

### Download Installer

Download the appropriate installer for your operating system from [GitHub Releases](https://github.com/sdjnmxd/electron-audiostation/releases).

### Supported Platforms

- **Windows**: Portable version and installer (nsis)
- **macOS**: `.dmg` (Universal Binary, supports both Intel and Apple Silicon)
- **Linux**: `.deb`, and `.rpm`

## 🚀 Quick Start

1. Download and install the application
2. Run the application
3. On first launch, enter your Synology AudioStation URL (e.g., `https://your-nas-address/audio/`)
4. Enjoy your music!

## ⌨️ Shortcuts

| Shortcut | Function |
|----------|----------|
| `Media Play/Pause` | Play or pause the current song |
| `Media Next Track` | Play the next song |
| `Media Previous Track` | Play the previous song |
| `Media Stop` | Stop playback |
| `Ctrl+E` / `Cmd+E` | Edit configuration |

**Note**: On macOS 10.14 Mojave and later, you may need to authorize the app as a [trusted accessibility client](https://developer.apple.com/library/archive/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html) to use media control shortcuts.

## 🛠️ Development

### Requirements

- Node.js 16+
- npm or yarn

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/sdjnmxd/electron-audiostation.git
cd electron-audiostation

# Install dependencies
npm install
# or
yarn

# Start application
npm start
# or
yarn start
```

### Build Application

```bash
# Build for all platforms
npm run make
# or
yarn make

# Build for Windows only
npm run make -- --platform=win32
# or
yarn make -- --platform=win32

# Build for macOS only
npm run make -- --platform=darwin
# or
yarn make -- --platform=darwin

# Build for Linux only
npm run make -- --platform=linux
# or
yarn make -- --platform=linux
```

## 📝 License

This project is licensed under the [GPL-3.0](LICENSE) License.

**Electron AudioStation is an open-source community project and not an official Synology product. Synology AudioStation Web is a component in the Synology DSM.**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

Author: [milkfish](https://www.milkfish.site) 