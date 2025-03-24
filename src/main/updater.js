const { autoUpdater } = require('electron-updater');
const log = require('../common/logger');
const { getMainWindow } = require('./window-manager');

/**
 * 设置自动更新
 */
function setupAutoUpdater() {
  // 配置日志
  autoUpdater.logger = log;
  
  // 检查更新错误
  autoUpdater.on('error', (error) => {
    log.error('Auto updater error:', error);
  });
  
  // 发现可用更新
  autoUpdater.on('update-available', (info) => {
    log.info('Update available:', info);
  });
  
  // 更新已下载
  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded:', info);
    
    // 通知渲染进程
    const mainWindow = getMainWindow();
    if (mainWindow) {
      mainWindow.webContents.send('update-downloaded', info);
    }
  });
  
  // 检查更新
  autoUpdater.checkForUpdatesAndNotify().catch(error => {
    log.error('Failed to check for updates:', error);
  });
}

module.exports = {
  setupAutoUpdater
}; 