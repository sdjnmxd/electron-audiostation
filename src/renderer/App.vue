<template>
  <div id="app" :class="{ 'dark-theme': isDarkTheme }">
    <router-view />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useSettingsStore } from './store/settings'

export default defineComponent({
  name: 'App',
  
  setup() {
    const settingsStore = useSettingsStore()
    const isDarkTheme = ref(false)
    
    // 监听主题变化
    watch(() => settingsStore.theme, (newTheme) => {
      updateTheme(newTheme)
    })
    
    // 更新主题
    const updateTheme = (theme) => {
      if (theme === 'dark') {
        isDarkTheme.value = true
      } else if (theme === 'light') {
        isDarkTheme.value = false
      } else {
        // 系统主题
        isDarkTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
    }
    
    // 监听系统主题变化
    onMounted(() => {
      // 加载设置
      settingsStore.loadSettings()
      
      // 初始化主题
      updateTheme(settingsStore.theme)
      
      // 监听系统主题变化
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (settingsStore.theme === 'system') {
          isDarkTheme.value = e.matches
        }
      })
      
      // 监听配置变更
      window.electronAPI.onConfigChanged((event, newSettings) => {
        settingsStore.updateSettings(newSettings)
      })
    })
    
    return {
      isDarkTheme
    }
  }
})
</script>

<style>
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --background-color: #f5f5f5;
  --card-background: #ffffff;
  --text-color: #333333;
  --border-color: #dddddd;
}

.dark-theme {
  --primary-color: #0d6efd;
  --secondary-color: #adb5bd;
  --background-color: #121212;
  --card-background: #1e1e1e;
  --text-color: #f0f0f0;
  --border-color: #444444;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

#app {
  width: 100%;
  height: 100vh;
}

/* 滚动条样式 */
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
</style> 