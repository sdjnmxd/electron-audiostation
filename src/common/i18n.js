const { app } = require('electron');

// 简单的国际化支持
const messages = {
  'zh-CN': {
    app_start: '应用启动',
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
    uncaught_exception: '未捕获的异常:'
  },
  'en-US': {
    app_start: 'Application started',
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
    uncaught_exception: 'Uncaught exception:'
  }
};

// 获取当前语言
const currentLocale = app ? app.getLocale() : 'en-US';
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
  currentLocale
}; 