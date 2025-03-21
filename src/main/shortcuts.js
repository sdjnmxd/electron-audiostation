const { globalShortcut } = require('electron');
const log = require('electron-log');
const i18n = require('../common/i18n');

// 注册的快捷键列表，用于后续清理
const registeredShortcuts = [];

/**
 * 注册全局快捷键
 * @param {BrowserWindow} mainWindow - 主窗口实例
 * @param {Object} controlScripts - 控制脚本对象
 */
function registerShortcuts(mainWindow, controlScripts) {
  // 媒体控制快捷键
  const shortcuts = [
    { 
      key: 'MediaPlayPause', 
      action: () => mainWindow.webContents.executeJavaScript(controlScripts.play),
      description: 'Play/Pause'
    },
    { 
      key: 'MediaPreviousTrack', 
      action: () => mainWindow.webContents.executeJavaScript(controlScripts.previous),
      description: 'Previous Track'
    },
    { 
      key: 'MediaNextTrack', 
      action: () => mainWindow.webContents.executeJavaScript(controlScripts.next),
      description: 'Next Track'
    },
    { 
      key: 'MediaStop', 
      action: () => mainWindow.webContents.executeJavaScript(controlScripts.stop),
      description: 'Stop'
    },
    { 
      key: 'CommandOrControl+Up', 
      action: () => mainWindow.webContents.executeJavaScript(controlScripts.volumeUp),
      description: 'Volume Up'
    },
    { 
      key: 'CommandOrControl+Down', 
      action: () => mainWindow.webContents.executeJavaScript(controlScripts.volumeDown),
      description: 'Volume Down'
    },
    { 
      key: 'CommandOrControl+E', 
      action: () => {
        // 直接调用主进程的函数，而不是通过 IPC
        require('./index').editConfig();
      },
      description: 'Edit Configuration'
    }
  ];

  // 注册所有快捷键
  shortcuts.forEach(shortcut => {
    try {
      const success = globalShortcut.register(shortcut.key, shortcut.action);
      
      if (success) {
        registeredShortcuts.push(shortcut.key);
        log.info(i18n.format('shortcut_registered', shortcut.key, shortcut.description));
      } else {
        log.warn(i18n.format('shortcut_failed', shortcut.key, shortcut.description));
      }
    } catch (error) {
      log.error(`Error registering shortcut: ${shortcut.key}`, error);
    }
  });
}

/**
 * 注销所有已注册的快捷键
 */
function unregisterShortcuts() {
  registeredShortcuts.forEach(key => {
    try {
      globalShortcut.unregister(key);
      log.info(i18n.format('shortcut_unregistered', key));
    } catch (error) {
      log.error(i18n.format('shortcut_unregister_error', key), error);
    }
  });
  
  // 清空注册列表
  registeredShortcuts.length = 0;
}

module.exports = {
  registerShortcuts,
  unregisterShortcuts
}; 