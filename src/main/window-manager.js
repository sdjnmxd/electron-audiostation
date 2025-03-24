const { BrowserWindow, session } = require('electron');
const path = require('path');
const Store = require('electron-store');
const log = require('../common/logger');
const { getUserAgent } = require('./user-agent');
const { handleWindowClose } = require('./window-utils');

// 初始化存储
const store = new Store();

// 主窗口引用
let mainWindow = null;

/**
 * 创建主窗口
 */
function createWindow() {
  const { width, height } = store.get('windowBounds', { width: 1000, height: 700 });
  
  mainWindow = new BrowserWindow({
    width,
    height,
    title: 'Electron AudioStation',
    icon: path.join(__dirname, '../../assets/icon.png'),
    autoHideMenuBar: !store.get('showMenu', false),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false
    }
  });
  
  // 设置User-Agent
  const userAgent = getUserAgent();
  if (userAgent) {
    mainWindow.webContents.userAgent = userAgent;
    mainWindow.webContents.session.setUserAgent(userAgent);
  }
  
  // 加载URL或欢迎页面
  const url = store.get('url');
  if (url) {
    mainWindow.loadURL(url);
  } else {
    // 如果没有配置URL，加载欢迎页面
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
  
  // 保存窗口大小
  mainWindow.on('resize', () => {
    if (!mainWindow.isMaximized()) {
      const { width, height } = mainWindow.getBounds();
      store.set('windowBounds', { width, height });
    }
  });
  
  // 窗口移动时保存位置
  mainWindow.on('move', () => {
    if (!mainWindow.isMaximized()) {
      const { width, height } = mainWindow.getBounds();
      store.set('windowBounds', { width, height });
    }
  });
  
  // 窗口关闭处理
  mainWindow.on('close', handleWindowClose);
  
  return mainWindow;
}

/**
 * 获取主窗口
 */
function getMainWindow() {
  return mainWindow;
}

module.exports = {
  createWindow,
  getMainWindow
}; 