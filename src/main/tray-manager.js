const { Tray, Menu, app } = require('electron');
const path = require('path');
const i18n = require('../common/i18n');
const { getMainWindow } = require('./window-manager');

// 托盘实例
let tray = null;

/**
 * 设置系统托盘
 */
function setupTray() {
  // 创建托盘图标
  tray = new Tray(path.join(__dirname, '../../assets/icon.png'));
  
  // 设置托盘菜单
  updateTrayMenu();
  
  // 点击托盘图标时显示窗口
  tray.on('click', () => {
    const mainWindow = getMainWindow();
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        mainWindow.focus();
      } else {
        mainWindow.show();
      }
    }
  });
  
  return tray;
}

/**
 * 更新托盘菜单
 */
function updateTrayMenu() {
  if (!tray) return;
  
  const mainWindow = getMainWindow();
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: i18n.t('tray.show'),
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    { type: 'separator' },
    {
      label: i18n.t('tray.playPause'),
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.executeJavaScript('window.electronAPI.playPause()');
        }
      }
    },
    {
      label: i18n.t('tray.previous'),
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.executeJavaScript('window.electronAPI.previous()');
        }
      }
    },
    {
      label: i18n.t('tray.next'),
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.executeJavaScript('window.electronAPI.next()');
        }
      }
    },
    { type: 'separator' },
    {
      label: i18n.t('tray.quit'),
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Electron AudioStation');
}

/**
 * 获取托盘实例
 */
function getTray() {
  return tray;
}

module.exports = {
  setupTray,
  updateTrayMenu,
  getTray
}; 