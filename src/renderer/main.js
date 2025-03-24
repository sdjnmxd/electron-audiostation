import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import messages from '../common/i18n-messages'

// 获取当前语言
const currentLanguage = window.electronAPI.getCurrentLanguage() || 'en-US'

// 创建i18n实例
const i18n = createI18n({
  locale: currentLanguage,
  fallbackLocale: 'en-US',
  messages
})

// 创建Vue应用
const app = createApp(App)

// 使用插件
app.use(createPinia())
app.use(router)
app.use(i18n)

// 挂载应用
app.mount('#app') 