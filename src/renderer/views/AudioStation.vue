<template>
  <div class="audiostation-container">
    <webview
      ref="webview"
      :src="url"
      class="audiostation-webview"
      :preload="preloadPath"
      allowpopups
    ></webview>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useSettingsStore } from '../store/settings'
import path from 'path'

export default defineComponent({
  name: 'AudioStationPage',
  
  setup() {
    const webview = ref(null)
    const settingsStore = useSettingsStore()
    
    // 计算URL
    const url = computed(() => {
      return settingsStore.url || 'about:blank'
    })
    
    // 预加载脚本路径
    const preloadPath = path.join(__dirname, '../preload/webview-preload.js')
    
    // 挂载后初始化
    onMounted(() => {
      if (!webview.value) return
      
      // 加载设置
      settingsStore.loadSettings()
      
      // 监听webview事件
      webview.value.addEventListener('dom-ready', () => {
        // 注入自定义CSS
        webview.value.insertCSS(`
          /* 改善滚动条样式 */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.5);
          }
        `)
      })
      
      // 处理导航错误
      webview.value.addEventListener('did-fail-load', (event) => {
        if (event.errorCode !== -3) { // 忽略中止的加载
          console.error('加载失败:', event.errorDescription)
          
          // 显示错误页面
          webview.value.loadURL(`data:text/html,
            <html>
              <head>
                <style>
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f5f5f5;
                    color: #333;
                    text-align: center;
                    padding: 0 20px;
                  }
                  h1 { margin-bottom: 10px; }
                  p { margin-bottom: 20px; }
                  button {
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                  }
                </style>
              </head>
              <body>
                <h1>连接错误</h1>
                <p>无法连接到 AudioStation。请检查您的URL和网络连接。</p>
                <p>错误: ${event.errorDescription}</p>
                <button onclick="window.location.reload()">重试</button>
                <button onclick="window.electronAPI.requestOpenSettings()">打开设置</button>
              </body>
            </html>
          `)
        }
      })
    })
    
    return {
      webview,
      url,
      preloadPath
    }
  }
})
</script>

<style scoped>
.audiostation-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.audiostation-webview {
  width: 100%;
  height: 100%;
  border: none;
}
</style> 