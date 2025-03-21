const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: path.join(__dirname, 'assets', 'icon'),
    appBundleId: 'moe.mxd.Electron-AudioStation',
    appCopyright: 'milkfish',
    appCategoryType: 'public.app-category.music',
    osxSign: {},
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
        iconUrl: 'https://raw.githubusercontent.com/sdjnmxd/electron-audiostation/main/assets/icon.ico',
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
        prerelease: false
      }
    }
  ]
}; 