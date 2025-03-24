import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    url: '',
    theme: 'system',
    language: 'system',
    closeAction: 'ask',
    startMinimized: false,
    alwaysOnTop: false,
    showMenu: false,
    userAgentType: 'chrome',
    customUserAgent: ''
  }),
  
  actions: {
    async loadSettings() {
      try {
        const settings = await window.electronAPI.getSettings()
        this.$patch(settings)
      } catch (error) {
        console.error('加载设置失败:', error)
      }
    },
    
    async saveSettings() {
      try {
        await window.electronAPI.saveSettings({
          url: this.url,
          theme: this.theme,
          language: this.language,
          closeAction: this.closeAction,
          startMinimized: this.startMinimized,
          alwaysOnTop: this.alwaysOnTop,
          showMenu: this.showMenu,
          userAgentType: this.userAgentType,
          customUserAgent: this.customUserAgent
        })
        return true
      } catch (error) {
        console.error('保存设置失败:', error)
        return false
      }
    },
    
    updateSettings(newSettings) {
      this.$patch(newSettings)
    }
  }
}) 