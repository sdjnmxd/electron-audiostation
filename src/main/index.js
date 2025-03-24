const { app } = require('electron');
const log = require('../common/logger');
const i18n = require('../common/i18n');
const { setupAutoUpdater } = require('./updater');
const { createWindow, getMainWindow } = require('./window-manager');
const { setupTray } = require('./tray-manager');
const { setupIpcHandlers } = require('./ipc-handlers');
const { registerShortcuts, unregisterShortcuts } = require('./shortcuts');
const { setupUserAgent } = require('./user-agent');
const { createMenu } = require('./menu');
const { setQuitting } = require('./window-utils');

// 确保应用只有一个实例
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  log.info('Another instance is already running. Quitting...');
  app.quit();
} else {
  // 监听第二个实例的启动
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    log.info('Second instance detected. Focusing the main window...');
    const mainWindow = getMainWindow();
    
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.show();
      mainWindow.focus();
    }
  });
  
  // 设置全局User-Agent
  setupUserAgent();
  
  // 应用准备就绪
  app.whenReady().then(() => {
    log.info('Application is ready');
    
    // 创建窗口
    createWindow();
    
    // 设置菜单
    createMenu();
    
    // 设置托盘
    setupTray();
    
    // 设置IPC处理程序
    setupIpcHandlers();
    
    // 注册快捷键
    registerShortcuts();
    
    // 设置自动更新
    setupAutoUpdater();
    
    // macOS特定处理
    app.on('activate', () => {
      if (getMainWindow() === null) {
        createWindow();
      }
    });
  });
  
  // 应用退出前
  app.on('before-quit', () => {
    log.info(i18n.t('app.quitting'));
    setQuitting(true);
    unregisterShortcuts();
  });
  
  // 所有窗口关闭时
  app.on('window-all-closed', () => {
    log.info(i18n.t('app.allWindowsClosed'));
    
    // 在macOS上，除非用户使用Cmd + Q明确退出，否则保持应用活跃状态
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
} 