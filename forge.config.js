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
    icon: path.join(__dirname, 'assets', 'icon'),
    appBundleId: 'moe.mxd.Electron-AudioStation',
    appCopyright: 'milkfish',
    appCategoryType: 'public.app-category.music',
    osxSign: {},
    // 使用动态配置的架构
    arch: archConfig.arch,
    universal: archConfig.universal,
    protocols: [
      {
        name: 'Electron AudioStation',
        schemes: ['electron-audiostation']
      }
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
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
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
        icon: path.join(__dirname, 'assets', 'icon.icns'),
        background: path.join(__dirname, 'assets', 'dmg-background.png'),
        window: {
          width: 540,
          height: 380
        },
        contents: [
          {
            x: 400,
            y: 180,
            type: 'link',
            path: '/Applications'
          },
          {
            x: 140,
            y: 180,
            type: 'file',
            path: ''
          }
        ]
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