const { ipcMain, dialog } = require('electron');
const Store = require('electron-store');
const log = require('../common/logger');
const i18n = require('../common/i18n');
const { getMainWindow } = require('./window-manager');
const { applySettingsWithoutRestart } = require('./settings-utils');

// 初始化存储
const store = new Store();

// 定义需要重启的设置列表
const RESTART_REQUIRED_SETTINGS = [
  'userAgentType',
  'customUserAgent',
  'language',
  'showMenu'
];

/**
 * 设置IPC处理程序
 */
function setupIpcHandlers() {
  // 获取设置
  ipcMain.handle('get-settings', () => {
    return store.store;
  });
  
  // 保存设置
  ipcMain.on('save-settings', (event, settings) => {
    log.info('Saving settings');
    
    // 保存设置
    Object.keys(settings).forEach(key => {
      store.set(key, settings[key]);
    });
    
    // 广播设置变更
    broadcastConfigChanged(settings);
  });
  
  // 取消设置
  ipcMain.on('cancel-settings', () => {
    const mainWindow = getMainWindow();
    if (mainWindow) {
      mainWindow.webContents.send('settings-canceled');
    }
  });
  
  // 打开设置
  ipcMain.on('open-settings', () => {
    const mainWindow = getMainWindow();
    if (mainWindow) {
      mainWindow.webContents.send('open-settings');
    }
  });
  
  // 获取当前语言
  ipcMain.handle('get-current-language', () => {
    return i18n.getCurrentLanguage();
  });
  
  // 检查是否需要重启
  ipcMain.handle('check-restart-required', (event, changedSettings) => {
    // 检查是否有任何更改的设置需要重启
    const needsRestart = Object.keys(changedSettings).some(key => 
      RESTART_REQUIRED_SETTINGS.includes(key)
    );
    
    log.info(`Checking if restart required: ${needsRestart ? 'Yes' : 'No'}`);
    return needsRestart;
  });
  
  // 应用无需重启的设置
  ipcMain.handle('apply-config-without-restart', async () => {
    return applySettingsWithoutRestart();
  });
  
  // 重启应用
  ipcMain.on('restart-app', () => {
    log.info('Restarting application');
    const mainWindow = getMainWindow();
    if (mainWindow) {
      mainWindow.webContents.session.clearStorageData().then(() => {
        app.relaunch();
        app.exit(0);
      });
    }
  });
  
  // 读取日志
  ipcMain.handle('read-log', () => {
    return require('../common/logger').readLog();
  });
  
  // 清除日志
  ipcMain.handle('clear-log', () => {
    return require('../common/logger').clearLog();
  });
}

/**
 * 广播配置变更
 */
function broadcastConfigChanged(settings) {
  const mainWindow = getMainWindow();
  if (mainWindow) {
    mainWindow.webContents.send('config-changed', settings);
  }
}

module.exports = {
  setupIpcHandlers,
  broadcastConfigChanged
}; 