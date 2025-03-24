<template>
  <div class="settings-container">
    <div class="settings-card">
      <h1>{{ $t('settings.title') }}</h1>
      
      <div class="section">
        <h2>{{ $t('settings.basicSettings') }}</h2>
        
        <div class="form-group">
          <label for="language">{{ $t('settings.language') }}</label>
          <select id="language" v-model="settings.language">
            <option value="system">{{ $t('settings.systemLanguage') }}</option>
            <option value="zh-CN">中文</option>
            <option value="en-US">English</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="url">{{ $t('settings.url') }}</label>
          <input 
            type="text" 
            id="url" 
            v-model="settings.url" 
            :placeholder="$t('settings.urlPlaceholder')"
          >
          <small class="help-text">{{ $t('settings.urlHelp') }}</small>
        </div>
        
        <div class="form-group">
          <label for="theme">{{ $t('settings.theme') }}</label>
          <select id="theme" v-model="settings.theme">
            <option value="system">{{ $t('settings.systemTheme') }}</option>
            <option value="light">{{ $t('settings.lightTheme') }}</option>
            <option value="dark">{{ $t('settings.darkTheme') }}</option>
          </select>
        </div>
      </div>
      
      <div class="section">
        <h2>{{ $t('settings.windowBehavior') }}</h2>
        
        <div class="form-group">
          <label for="closeAction">{{ $t('settings.closeAction') }}</label>
          <select id="closeAction" v-model="settings.closeAction">
            <option value="ask">{{ $t('settings.askEveryTime') }}</option>
            <option value="minimize">{{ $t('settings.minimizeToTray') }}</option>
            <option value="exit">{{ $t('settings.exitApp') }}</option>
          </select>
        </div>
        
        <div class="checkbox-group">
          <input type="checkbox" id="startMinimized" v-model="settings.startMinimized">
          <label for="startMinimized">{{ $t('settings.startMinimized') }}</label>
        </div>
        
        <div class="checkbox-group">
          <input type="checkbox" id="alwaysOnTop" v-model="settings.alwaysOnTop">
          <label for="alwaysOnTop">{{ $t('settings.alwaysOnTop') }}</label>
        </div>
        
        <div class="checkbox-group">
          <input type="checkbox" id="showMenu" v-model="settings.showMenu">
          <label for="showMenu">{{ $t('settings.showMenu') }}</label>
        </div>
      </div>
      
      <div class="section">
        <h2>{{ $t('settings.advancedSettings') }}</h2>
        
        <div class="form-group">
          <label for="userAgentType">{{ $t('settings.userAgentType') }}</label>
          <select id="userAgentType" v-model="settings.userAgentType">
            <option value="chrome">Chrome</option>
            <option value="firefox">Firefox</option>
            <option value="safari">Safari</option>
            <option value="edge">Microsoft Edge</option>
            <option value="default">{{ $t('settings.electronDefault') }}</option>
            <option value="custom">{{ $t('settings.custom') }}</option>
          </select>
        </div>
        
        <div class="form-group" v-if="settings.userAgentType === 'custom'">
          <label for="customUserAgent">{{ $t('settings.customUserAgent') }}</label>
          <input type="text" id="customUserAgent" v-model="settings.customUserAgent">
          <small class="help-text">{{ $t('settings.customUserAgentHelp') }}</small>
        </div>
      </div>
      
      <div class="button-group">
        <button class="secondary-button" @click="cancel">
          {{ $t('settings.cancel') }}
        </button>
        <button class="primary-button" @click="save">
          {{ $t('settings.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '../store/settings'

export default defineComponent({
  name: 'SettingsPage',
  
  setup() {
    const router = useRouter()
    const settingsStore = useSettingsStore()
    
    // 创建本地设置对象
    const settings = reactive({
      url: '',
      theme: 'system',
      language: 'system',
      closeAction: 'ask',
      startMinimized: false,
      alwaysOnTop: false,
      showMenu: false,
      userAgentType: 'chrome',
      customUserAgent: ''
    })
    
    // 加载设置
    onMounted(async () => {
      try {
        await settingsStore.loadSettings()
        
        // 复制设置到本地对象
        Object.assign(settings, {
          url: settingsStore.url,
          theme: settingsStore.theme,
          language: settingsStore.language,
          closeAction: settingsStore.closeAction,
          startMinimized: settingsStore.startMinimized,
          alwaysOnTop: settingsStore.alwaysOnTop,
          showMenu: settingsStore.showMenu,
          userAgentType: settingsStore.userAgentType,
          customUserAgent: settingsStore.customUserAgent
        })
      } catch (error) {
        console.error('加载设置失败:', error)
      }
    })
    
    // 保存设置
    const save = async () => {
      try {
        // 更新存储中的设置
        Object.assign(settingsStore, settings)
        
        // 保存设置
        await settingsStore.saveSettings()
      } catch (error) {
        console.error('保存设置失败:', error)
      }
    }
    
    // 取消
    const cancel = () => {
      window.electronAPI.cancelSettings()
    }
    
    return {
      settings,
      save,
      cancel
    }
  }
})
</script>

<style scoped>
.settings-container {
  padding: 20px;
  max-height: 100vh;
  overflow-y: auto;
}

.settings-card {
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  max-width: 700px;
  margin: 0 auto;
}

h1 {
  margin-top: 0;
  font-size: 24px;
  color: var(--text-color);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

h2 {
  font-size: 18px;
  margin-top: 25px;
  margin-bottom: 15px;
  color: var(--text-color);
}

.section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: var(--text-color);
}

select, input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  background-color: var(--card-background);
  color: var(--text-color);
}

select:focus, input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.checkbox-group input {
  width: auto;
  margin-right: 10px;
}

.checkbox-group label {
  margin-bottom: 0;
  font-weight: normal;
}

.help-text {
  font-size: 0.85em;
  color: var(--secondary-color);
  margin-top: 5px;
  display: block;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.2s;
}

.primary-button {
  background-color: var(--primary-color);
  color: white;
}

.primary-button:hover {
  opacity: 0.9;
}

.secondary-button {
  background-color: var(--secondary-color);
  color: white;
}

.secondary-button:hover {
  opacity: 0.9;
}
</style> 