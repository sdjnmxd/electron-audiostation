const Store = require('electron-store');
const { getMainWindow } = require('./window-manager');

// 初始化存储
const store = new Store();

/**
 * 应用无需重启的设置
 */
async function applySettingsWithoutRestart() {
  const mainWindow = getMainWindow();
  if (!mainWindow) return false;
  
  // 应用窗口置顶设置
  const alwaysOnTop = store.get('alwaysOnTop', false);
  mainWindow.setAlwaysOnTop(alwaysOnTop);
  
  // 应用菜单栏显示设置
  const showMenu = store.get('showMenu', false);
  mainWindow.setAutoHideMenuBar(!showMenu);
  
  return true;
}

module.exports = {
  applySettingsWithoutRestart
}; 