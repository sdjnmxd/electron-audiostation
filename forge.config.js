const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: path.join(__dirname, 'assets', 'icon'),
    appBundleId: 'moe.mxd.Electron-AudioStation',
    appCopyright: 'milkfish',
    appCategoryType: 'public.app-category.music',
    osxSign: {},
    arch: ['x64', 'arm64'],
    universal: true,
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
      name: '@electron-forge/maker-appimage',
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
        icon: path.join(__dirname, 'assets', 'icon.icns'),
        background: path.join(__dirname, 'assets', 'dmg-background.png'),
        format: 'ULFO',
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
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'sdjnmxd',
          name: 'electron-audiostation'
        },
        prerelease: false,
        draft: false
      }
    }
  ]
}; 