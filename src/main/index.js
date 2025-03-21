const { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, dialog } = require('electron');
const path = require('path');
const log = require('electron-log');
const Store = require('electron-store');
const { autoUpdater } = require('electron-updater');
const { createMenu } = require('./menu');
const { registerShortcuts, unregisterShortcuts } = require('./shortcuts');
const i18n = require('../common/i18n');

// 配置日志
log.transports.file.level = 'info';
log.transports.console.level = 'debug';

// 设置日志文件编码和格式
log.transports.file.format = '{y}-{m}-{d} {h}:{i}:{s}.{ms} [{level}] {text}';
log.transports.file.encoding = 'utf8';

// 使用英文日志消息以避免编码问题
log.info(i18n.format('app_start'));

// 初始化存储
const store = new Store({
  defaults: {
    url: '',
    windowBounds: { width: 1000, height: 700 },
    startMinimized: false,
    autoLaunch: false,
    alwaysOnTop: false,
    theme: 'system' // system, light, dark
  }
});

// 控制脚本
const SynologyAudioStationControlScript = {
  play: 'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.doPlay()',
  stop: 'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.doStop()',
  previous: 'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.doPrevious()',
  next: 'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.doNext()',
  volumeUp: 'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.setVolume(Math.min(100, SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.getVolume() + 5))',
  volumeDown: 'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.setVolume(Math.max(0, SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.getVolume() - 5))'
};

// 全局变量
let mainWindow;
let tray;
let isQuitting = false;

// 创建窗口
function createWindow() {
  const { width, height } = store.get('windowBounds');
  
  mainWindow = new BrowserWindow({
    width,
    height,
    title: 'Electron AudioStation',
    icon: path.join(__dirname, '../../assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false
    }
  });

  // 加载URL
  const url = store.get('url');
  if (url) {
    mainWindow.loadURL(url);
  } else {
    showConfigPrompt();
  }

  // 保存窗口大小
  mainWindow.on('resize', () => {
    if (!mainWindow.isMaximized()) {
      const { width, height } = mainWindow.getBounds();
      store.set('windowBounds', { width, height });
    }
  });

  // 窗口关闭处理
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
  });

  // 创建菜单
  createMenu(mainWindow, store);
  
  // 注册快捷键
  registerShortcuts(mainWindow, SynologyAudioStationControlScript);
  
  // 创建系统托盘
  createTray();
  
  // 检查更新
  autoUpdater.checkForUpdatesAndNotify();
}

// 创建系统托盘
function createTray() {
  try {

    tray = new Tray(path.join(__dirname, '../../assets/icon.png'));
    
    const contextMenu = Menu.buildFromTemplate([
      { 
        label: '显示/隐藏窗口', 
        click: () => {
          if (mainWindow.isVisible()) {
            mainWindow.hide();
          } else {
            mainWindow.show();
          }
        }
      },
      { type: 'separator' },
      { 
        label: '播放/暂停', 
        click: () => {
          mainWindow.webContents.executeJavaScript(SynologyAudioStationControlScript.play);
        }
      },
      { 
        label: '上一曲', 
        click: () => {
          mainWindow.webContents.executeJavaScript(SynologyAudioStationControlScript.previous);
        }
      },
      { 
        label: '下一曲', 
        click: () => {
          mainWindow.webContents.executeJavaScript(SynologyAudioStationControlScript.next);
        }
      },
      { 
        label: '停止', 
        click: () => {
          mainWindow.webContents.executeJavaScript(SynologyAudioStationControlScript.stop);
        }
      },
      { type: 'separator' },
      { 
        label: '编辑配置', 
        click: showConfigPrompt 
      },
      { type: 'separator' },
      { 
        label: '退出', 
        click: () => {
          isQuitting = true;
          app.quit();
        }
      }
    ]);
    
    tray.setToolTip('Electron AudioStation');
    tray.setContextMenu(contextMenu);
    
    tray.on('click', () => {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    });
  } catch (error) {
    log.error(i18n.format('tray_icon_error'), error);
    // 继续执行，不让托盘错误影响主程序
  }
}

// 配置提示
function showConfigPrompt() {
  try {
    log.info(i18n.format('config_window_open'));
    
    // 检查是否已经存在配置窗口
    const existingConfigWindow = BrowserWindow.getAllWindows().find(win => 
      win.getTitle() === '配置 Electron AudioStation');
    
    if (existingConfigWindow) {
      // 如果已存在，则聚焦它
      if (existingConfigWindow.isMinimized()) {
        existingConfigWindow.restore();
      }
      existingConfigWindow.focus();
      log.info(i18n.format('existing_config_window'));
      return;
    }
    
    // 创建配置窗口
    const configWindow = new BrowserWindow({
      width: 500,
      height: 400, // 增加高度以适应内容
      title: '配置 Electron AudioStation',
      parent: mainWindow,
      modal: false, // 改为非模态窗口
      show: false,
      webPreferences: {
        preload: path.join(__dirname, '../renderer/config-preload.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    });
    
    // 加载配置HTML文件
    const configPath = path.join(__dirname, '../renderer/config.html');
    log.info(i18n.format('config_window_loading'), configPath);
    
    configWindow.loadFile(configPath);
    
    configWindow.once('ready-to-show', () => {
      configWindow.show();
      configWindow.focus(); // 确保窗口获得焦点
      log.info(i18n.format('config_window_shown'));
    });
    
    // 处理配置保存
    ipcMain.once('save-config', (event, url) => {
      log.info(i18n.format('config_saved'), url);
      store.set('url', url);
      configWindow.close();
      
      if (mainWindow) {
        mainWindow.loadURL(url);
      } else {
        createWindow();
      }
    });
    
    // 处理取消
    ipcMain.once('cancel-config', () => {
      log.info(i18n.format('config_canceled'));
      configWindow.close();
      
      if (!store.get('url') && mainWindow) {
        mainWindow.close();
      }
    });
    
    // 处理窗口关闭
    configWindow.on('closed', () => {
      log.info(i18n.format('config_window_closed'));
      // 移除所有相关的一次性事件监听器
      ipcMain.removeAllListeners('save-config');
      ipcMain.removeAllListeners('cancel-config');
    });
  } catch (error) {
    log.error(i18n.format('config_window_error'), error);
    dialog.showErrorBox('配置错误', `无法打开配置窗口: ${error.message}`);
  }
}

// 修改 edit-config 事件处理
ipcMain.on('edit-config', () => {
  log.info(i18n.format('edit_config_request'));
  showConfigPrompt();
});

// 修改 editConfig 函数
function editConfig() {
  log.info(i18n.format('edit_config_menu'));
  showConfigPrompt();
}

// 在主进程中处理 edit-config 消息
ipcMain.handle('get-current-url', () => {
  return store.get('url', '');
});

// 应用准备就绪
app.whenReady().then(() => {
  createWindow();
  
  // macOS 激活处理
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow.show();
    }
  });
});

// 所有窗口关闭时退出应用（Windows/Linux）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 应用退出前清理
app.on('before-quit', () => {
  isQuitting = true;
  unregisterShortcuts();
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  log.error(i18n.format('uncaught_exception'), error);
});

function openLogViewer() {
  const logViewerWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Log Viewer',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '../renderer/log-preload.js')
    }
  });
  
  logViewerWindow.loadFile(path.join(__dirname, '../renderer/log-viewer.html'));
  
  // 发送日志内容到窗口
  logViewerWindow.webContents.once('did-finish-load', () => {
    const logFilePath = log.transports.file.getFile().path;
    const fs = require('fs');
    
    try {
      const logContent = fs.readFileSync(logFilePath, 'utf8');
      logViewerWindow.webContents.send('log-content', logContent);
    } catch (error) {
      logViewerWindow.webContents.send('log-error', error.message);
    }
  });
}

// 导出函数
module.exports = {
  openLogViewer,
  editConfig
}; 