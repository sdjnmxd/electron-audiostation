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
    extraResource: [
      './assets'
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
          categories: ['Audio', 'Music', 'AudioVideo', 'Player'],
          section: 'sound'
        }
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          icon: path.join(__dirname, 'assets', 'icon.png'),
          categories: ['Audio', 'Music', 'AudioVideo', 'Player'],
          section: 'sound'
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
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './public/index.html',
              js: './src/renderer/main.js',
              name: 'main_window',
              preload: {
                js: './src/preload/index.js'
              }
            }
          ]
        }
      }
    }
  ]
}; 