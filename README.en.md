# Electron AudioStation

![GitHub release (latest by date)](https://img.shields.io/github/v/release/sdjnmxd/electron-audiostation)
![GitHub all releases](https://img.shields.io/github/downloads/sdjnmxd/electron-audiostation/total)
![GitHub](https://img.shields.io/github/license/sdjnmxd/electron-audiostation)

An Electron-based client for Synology AudioStation.

English | [中文](README.md)

## Features

- **Bilingual Support**: Automatically detects system language and supports both English and Chinese interfaces, manually switchable in settings
- **System Tray Integration**: Minimize to system tray with playback controls in the tray menu
- **Global Shortcuts**: Control music playback using keyboard shortcuts without switching to the application window
- **Always on Top**: Option to keep the window always on top
- **Start Minimized**: Option to start the application minimized to tray

## Download

Download the latest version from [GitHub Releases](https://github.com/sdjnmxd/electron-audiostation/releases).

## Installation

Download the appropriate package for your operating system and run it.

- Windows: `.exe` installer
- macOS: `.dmg` installer
- Linux: `.AppImage` or `.deb` package

## Usage

1. On first launch, you'll need to configure your Synology AudioStation URL
2. Enter your Synology NAS AudioStation URL, e.g., `https://your-synology-nas:5001/audio/`
3. Log in to your Synology account
4. Enjoy your music!

## Keyboard Shortcuts

- `MediaPlayPause`: Play/Pause
- `MediaStop`: Stop
- `MediaPreviousTrack`: Previous Track
- `MediaNextTrack`: Next Track

## Development

### Requirements

- Node.js 16+
- npm or yarn

### Install Dependencies

```bash
npm install
# or
yarn
```

### Run Development Version

```bash
npm start
# or
yarn start
```

### Build Application

```bash
npm run make
# or
yarn make
```

## Contributing

Pull requests and issues are welcome!

## License

MIT 