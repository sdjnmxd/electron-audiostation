const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  
  // 输出目录
  outputDir: 'dist_electron',
  
  // 静态资源目录
  assetsDir: 'assets',
  
  // 开发服务器配置
  devServer: {
    port: 9080
  },
  
  // 禁用生产环境的source map
  productionSourceMap: false,
  
  // 配置Electron
  pluginOptions: {
    electronBuilder: {
      // 主进程入口
      mainProcessFile: 'src/main/index.js',
      
      // 预加载脚本
      preload: 'src/preload/index.js',
      
      // 渲染进程入口
      rendererProcessFile: 'src/renderer/main.js',
      
      // 构建配置
      builderOptions: {
        appId: 'moe.mxd.electron-audiostation',
        productName: 'Electron AudioStation',
        copyright: 'Copyright © 2023 milkfish',
        
        // macOS配置
        mac: {
          category: 'public.app-category.music',
          icon: 'build/icons/icon.icns',
          darkModeSupport: true
        },
        
        // Windows配置
        win: {
          icon: 'build/icons/icon.ico',
          target: [
            {
              target: 'nsis',
              arch: ['x64', 'arm64']
            }
          ]
        },
        
        // Linux配置
        linux: {
          icon: 'build/icons',
          category: 'Audio;Music;Player',
          target: [
            'deb',
            'rpm',
            'AppImage'
          ]
        }
      }
    }
  }
}) 