const { app } = require('electron');
const Store = require('electron-store');
const log = require('./logger');

// 加载翻译文件
const messages = {
  'en-US': require('./i18n-messages-main.en.js'),
  'zh-CN': require('./i18n-messages-main.zh.js')
};

// 获取当前语言设置
function getCurrentLanguage() {
  try {
    const store = new Store();
    const setting = store.get('language', 'system');
    
    if (setting !== 'system') {
      return setting;
    }
    
    // 检测系统语言
    const locale = app.getLocale();
    return locale.startsWith('zh') ? 'zh-CN' : 'en-US';
  } catch (error) {
    log.error('Failed to detect language:', error);
    return 'en-US'; // 默认使用英语
  }
}

// 简化的i18n模块
module.exports = {
  // 获取翻译文本
  t(key, params = {}) {
    const lang = getCurrentLanguage();
    const langMessages = messages[lang] || messages['en-US'];
    
    let text = key.split('.').reduce((obj, k) => obj && obj[k], langMessages) || key;
    
    // 简单的参数替换
    if (params) {
      Object.keys(params).forEach(param => {
        text = text.replace(new RegExp(`{${param}}`, 'g'), params[param]);
      });
    }
    
    return text;
  },
  
  // 获取当前语言
  getCurrentLanguage
}; 