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
- ⚙️ Simple configuration: Quick settings edit with `Ctrl+E` or `Cmd+E`
- 🖥️ Cross-platform: Supports macOS and Windows

## 📦 Installation

### Download Installer

Download the appropriate installer for your operating system from [GitHub Releases](https://github.com/sdjnmxd/electron-audiostation/releases).

### Supported Platforms

- **Windows**: Portable version or installer (nsis)
- **macOS**: `.dmg`
- **Linux**: `.rpm`

## 🚀 Quick Start

1. Download and install the application
2. Run the application
3. On first launch, enter your Synology AudioStation URL (e.g., `https://your-nas-address/music`)
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

- Node.js
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
# Build for Windows
npm run electron:windows
# or
yarn electron:windows

# Build for macOS
npm run electron:mac
# or
yarn electron:mac

# Build for Linux
npm run electron:linux
# or
yarn electron:linux
```

## 📝 License

This project is licensed under the [GPL-3.0](LICENSE) License.

**Electron AudioStation is an open-source community project and not an official Synology product. Synology AudioStation Web is a component in the Synology DSM.**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

Author: [milkfish](https://www.milkfish.site) 