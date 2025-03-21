const { app } = require('electron');
const logger = require('./logger');
const Store = require('electron-store');

// 获取存储的语言设置
let userLanguage = 'system';
try {
  const store = new Store();
  userLanguage = store.get('language', 'system');
} catch (error) {
  logger.error('Failed to get language setting:', error);
}

// 简单的国际化支持
const messages = {
  'zh-CN': {
    app_start: '应用启动',
    app_quitting: '应用正在退出',
    shortcut_registered: '快捷键注册成功: {0} ({1})',
    shortcut_failed: '快捷键注册失败: {0} ({1})',
    shortcut_unregistered: '快捷键注销成功: {0}',
    shortcut_unregister_error: '快捷键注销错误: {0}',
    tray_icon_missing: '托盘图标文件不存在，使用主图标代替',
    tray_icon_error: '创建托盘图标失败:',
    config_window_open: '打开配置窗口',
    config_window_loading: '加载配置文件:',
    config_window_shown: '配置窗口已显示',
    config_saved: '保存配置:',
    config_canceled: '取消配置',
    config_window_closed: '配置窗口已关闭',
    config_window_error: '打开配置窗口失败:',
    uncaught_exception: '未捕获的异常:',
    edit_config_request: '收到编辑配置请求',
    edit_config_menu: '从菜单调用编辑配置',
    existing_config_window: '使用已存在的配置窗口',
    close_confirmation_title: '关闭确认',
    close_confirmation_message: '您想要将应用最小化到托盘还是退出应用？',
    close_minimize: '最小化到托盘',
    close_exit: '退出应用',
    close_cancel: '取消',
    close_remember: '记住我的选择',
    settings_close_action: '关闭窗口行为',
    settings_close_action_ask: '每次询问',
    settings_close_action_minimize: '最小化到托盘',
    settings_close_action_exit: '退出应用'
  },
  'en-US': {
    app_start: 'Application started',
    app_quitting: 'Application is quitting',
    shortcut_registered: 'Shortcut registered: {0} ({1})',
    shortcut_failed: 'Failed to register shortcut: {0} ({1})',
    shortcut_unregistered: 'Shortcut unregistered: {0}',
    shortcut_unregister_error: 'Error unregistering shortcut: {0}',
    tray_icon_missing: 'Tray icon file not found, using main icon instead',
    tray_icon_error: 'Failed to create tray icon:',
    config_window_open: 'Opening configuration window',
    config_window_loading: 'Loading configuration file:',
    config_window_shown: 'Configuration window shown',
    config_saved: 'Configuration saved:',
    config_canceled: 'Configuration canceled',
    config_window_closed: 'Configuration window closed',
    config_window_error: 'Failed to open configuration window:',
    uncaught_exception: 'Uncaught exception:',
    edit_config_request: 'Edit config request received',
    edit_config_menu: 'Edit config called from menu',
    existing_config_window: 'Using existing config window',
    close_confirmation_title: 'Close Confirmation',
    close_confirmation_message: 'Do you want to minimize to tray or exit the application?',
    close_minimize: 'Minimize to Tray',
    close_exit: 'Exit Application',
    close_cancel: 'Cancel',
    close_remember: 'Remember my choice',
    settings_close_action: 'Window Close Behavior',
    settings_close_action_ask: 'Ask every time',
    settings_close_action_minimize: 'Minimize to tray',
    settings_close_action_exit: 'Exit application'
  }
};

// 获取当前语言
let currentLocale;
if (userLanguage && userLanguage !== 'system') {
  // 用户手动设置了语言
  currentLocale = userLanguage;
  logger.info('Using user-selected language: ' + currentLocale);
} else {
  // 自动检测语言
  // 尝试多种方式获取系统语言
  currentLocale = app ? app.getLocale() : 'en-US';
  
  // 检查环境变量
  const envLang = process.env.LANG || process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANGUAGE;
  if (envLang && !currentLocale.startsWith('zh')) {
    // 如果环境变量指示中文，但 app.getLocale() 没有返回中文
    if (envLang.startsWith('zh')) {
      currentLocale = 'zh-CN';
      logger.info('Language detected from environment variables: ' + envLang);
    }
  }
  
  logger.info('Auto-detected language: ' + currentLocale);
}

// 确保我们有这种语言的消息
if (!messages[currentLocale]) {
  // 如果没有完全匹配，尝试匹配语言前缀
  const prefix = currentLocale.split('-')[0];
  const matchingLocale = Object.keys(messages).find(locale => locale.startsWith(prefix));
  
  if (matchingLocale) {
    currentLocale = matchingLocale;
    logger.info('Using matching language: ' + currentLocale);
  } else {
    // 如果没有匹配，使用默认语言
    currentLocale = 'en-US';
    logger.info('No matching language found, using default: ' + currentLocale);
  }
}

const strings = messages[currentLocale] || messages['en-US'];

// 格式化字符串
function format(key, ...args) {
  let message = strings[key] || key;
  
  args.forEach((arg, index) => {
    message = message.replace(`{${index}}`, arg);
  });
  
  return message;
}

module.exports = {
  format,
  currentLocale,
  // 导出检测语言的函数，用于动态检测
  detectLanguage: () => {
    if (userLanguage && userLanguage !== 'system') {
      return userLanguage;
    }
    
    // 自动检测逻辑
    let detectedLocale = app ? app.getLocale() : 'en-US';
    const envLang = process.env.LANG || process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANGUAGE;
    
    if (envLang && !detectedLocale.startsWith('zh')) {
      if (envLang.startsWith('zh')) {
        detectedLocale = 'zh-CN';
      }
    }
    
    return detectedLocale;
  }
}; 