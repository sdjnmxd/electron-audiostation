const path = require('path');

// 获取环境变量中指定的架构，如果没有则使用默认值
const targetArch = process.env.ELECTRON_ARCH || 'all';

// 根据目标架构确定打包配置
const getArchConfig = () => {
  if (targetArch === 'all') {
    return {
      arch: ['x64', 'arm64'],
      universal: true
    };
  }
  
  return {
    arch: [targetArch],
    universal: false
  };
};

const archConfig = getArchConfig();

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './assets/icon',
    appBundleId: 'moe.mxd.Electron-AudioStation',
    appCopyright: 'milkfish',
    appCategoryType: 'public.app-category.music',
    osxSign: {},
    arch: archConfig.arch,
    universal: archConfig.universal,
    protocols: [
      {
        name: 'Electron AudioStation',
        schemes: ['electron-audiostation']
      }
    ],
    ignore: [
      /^\/\.git/,
      /^\/\.github/,
      /^\/node_modules\/(?!.*\.(node|dll)$)/,
      /^\/out/
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'Electron_AudioStation',
        setupIcon: path.join(__dirname, 'assets', 'icon.ico')
      }
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: path.join(__dirname, 'assets', 'icon.png'),
          categories: ['Audio', 'Music']
        }
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          icon: path.join(__dirname, 'assets', 'icon.png'),
          categories: ['Audio', 'Music']
        }
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO',
        icon: './assets/icon.icns',
        background: './assets/dmg-background.png'
      }
    },
    {
      name: '@electron-forge/maker-snap',
      config: {
        useDocker: true,
        features: {
          audio: true,
          mpris: 'com.electron.audiostation'
        },
        summary: 'A modern Synology AudioStation client',
        description: 'A modern Synology AudioStation client for macOS, Windows and Linux.',
        confinement: 'strict',
        grade: 'stable',
        categories: ['Audio', 'Music'],
        plugs: [
          'desktop',
          'desktop-legacy',
          'home',
          'x11',
          'wayland',
          'unity7',
          'browser-support',
          'network',
          'gsettings',
          'audio-playback',
          'pulseaudio',
          'opengl'
        ]
      }
    },
    {
      name: '@electron-forge/maker-flatpak',
      config: {
        options: {
          categories: ['Audio', 'Music'],
          mimeType: ['audio/mpeg', 'audio/flac', 'audio/wav'],
          productName: 'Electron AudioStation',
          id: 'moe.mxd.Electron-AudioStation',
          icon: path.join(__dirname, 'assets', 'icon.png'),
          runtime: 'org.freedesktop.Platform',
          runtimeVersion: '22.08',
          sdk: 'org.freedesktop.Sdk',
          finishArgs: [
            '--socket=wayland',
            '--socket=x11',
            '--share=ipc',
            '--share=network',
            '--device=dri',
            '--socket=pulseaudio'
          ]
        }
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    }
  ]
}; 