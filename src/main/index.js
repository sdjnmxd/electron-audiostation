const { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, dialog, shell, session } = require('electron');
const path = require('path');
const log = require('../common/logger');
const Store = require('electron-store');
const { autoUpdater } = require('electron-updater');
const { createMenu } = require('./menu');
const { registerShortcuts, unregisterShortcuts } = require('./shortcuts');
const i18n = require('../common/i18n');

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
    theme: 'system', // system, light, dark
    closeAction: 'ask', // ask, minimize, exit
    language: 'system', // system, zh-CN, en-US
    showMenu: false, // 默认不显示菜单
    userAgentType: 'chrome', // 默认使用 Chrome UA
    customUserAgent: '' // 自定义 UA 存储
  }
});

// 预设的 User-Agent 字符串
const USER_AGENT_STRINGS = {
  chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
  safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
};

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

// 确保应用只有一个实例
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // 如果无法获取锁，说明已经有一个实例在运行，退出当前实例
  log.info('Another instance is already running. Quitting...');
  app.quit();
} else {
  // 监听第二个实例的启动
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    log.info('Second instance detected. Focusing the main window...');
    
    // 如果主窗口存在，则聚焦它
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.show();
      mainWindow.focus();
      
      // 检查命令行参数，可以用于处理从外部打开的URL等
      const url = commandLine.find(arg => arg.startsWith('audiostation://'));
      if (url) {
        // 处理自定义协议URL
        log.info('Custom protocol URL detected:', url);
        // 在这里添加处理自定义协议的代码
      }
    }
  });
  
  // 在应用启动时设置全局 User-Agent
  const userAgentType = store.get('userAgentType', 'chrome');
  const customUserAgent = store.get('customUserAgent', '');

  // 确定要使用的 User-Agent
  let userAgent;
  if (userAgentType === 'custom' && customUserAgent) {
    userAgent = customUserAgent;
  } else if (userAgentType === 'default') {
    userAgent = undefined; // 使用 Electron 默认值
  } else {
    userAgent = USER_AGENT_STRINGS[userAgentType] || USER_AGENT_STRINGS.chrome;
  }

  // 设置全局 User-Agent
  if (userAgent) {
    app.userAgentFallback = userAgent;
    log.info('设置应用级 User-Agent: ' + userAgent);
  }

  // 应用准备就绪
  app.whenReady().then(() => {
    // 预热国际化模块
    log.info('App language: ' + i18n.currentLocale);
    
    // 设置默认 session 的 User-Agent
    if (userAgent) {
      session.defaultSession.setUserAgent(userAgent);
      log.info('设置默认 session User-Agent: ' + userAgent);
    }
    
    createWindow();
    
    // 只有在设置为显示菜单时才创建菜单
    if (store.get('showMenu', false)) {
      createMenu(mainWindow, store);
    }
    
    // 注册快捷键
    registerShortcuts(mainWindow, SynologyAudioStationControlScript);
    
    // 如果设置了启动时最小化，则隐藏窗口
    if (store.get('startMinimized')) {
      mainWindow.hide();
    }
    
    // 设置窗口置顶
    mainWindow.setAlwaysOnTop(store.get('alwaysOnTop', false));
    
    // 在macOS上，当点击dock图标且没有其他窗口打开时，重新创建一个窗口
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      } else {
        // 如果窗口已存在但被隐藏，则显示它
        if (mainWindow && !mainWindow.isVisible()) {
          mainWindow.show();
        }
      }
    });
  });
  
  // 应用退出前
  app.on('before-quit', () => {
    log.info(i18n.format('app_quitting'));
    isQuitting = true;
    
    // 注销快捷键
    unregisterShortcuts();
  });
  
  // 所有窗口关闭时
  app.on('window-all-closed', () => {
    log.info(i18n.format('all_windows_closed'));
    
    // 在macOS上，除非用户使用Cmd + Q明确退出，否则保持应用活跃状态
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

// 创建窗口
function createWindow() {
  const { width, height } = store.get('windowBounds');
  
  // 获取用户代理设置
  const userAgentType = store.get('userAgentType', 'chrome');
  const customUserAgent = store.get('customUserAgent', '');
  
  // 确定要使用的 User-Agent
  let userAgent;
  if (userAgentType === 'custom' && customUserAgent) {
    userAgent = customUserAgent;
  } else if (userAgentType === 'default') {
    userAgent = undefined; // 使用 Electron 默认值
  } else {
    userAgent = USER_AGENT_STRINGS[userAgentType] || USER_AGENT_STRINGS.chrome;
  }
  
  // 在创建窗口前设置默认 session 的 User-Agent
  if (userAgent) {
    app.userAgentFallback = userAgent;
    session.defaultSession.setUserAgent(userAgent);
    log.info('设置全局 User-Agent: ' + userAgent);
  }
  
  mainWindow = new BrowserWindow({
    width,
    height,
    title: 'Electron AudioStation',
    icon: path.join(__dirname, '../../assets/icon.png'),
    autoHideMenuBar: !store.get('showMenu', false),
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false
    }
  });

  // 确保窗口的 webContents 也使用正确的 User-Agent
  if (userAgent) {
    mainWindow.webContents.userAgent = userAgent;
    mainWindow.webContents.session.setUserAgent(userAgent);
  }

  // 加载URL
  const url = store.get('url');
  if (url) {
    mainWindow.loadURL(url);
  } else {
    // 如果没有配置 URL，直接打开设置窗口
    mainWindow.loadFile(path.join(__dirname, '../renderer/welcome.html'));
    // 在欢迎页面中添加打开设置的按钮
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
    if (isQuitting) {
      return; // 如果是应用退出，则不阻止关闭
    }
    
    const closeAction = store.get('closeAction', 'ask');
    
    if (closeAction === 'minimize') {
      // 直接最小化到托盘
      event.preventDefault();
      mainWindow.hide();
      return false;
    } else if (closeAction === 'exit') {
      // 直接退出
      isQuitting = true;
      return true;
    } else {
      // 询问用户
      event.preventDefault();
      
      // 动态检测当前语言
      const detectedLocale = i18n.detectLanguage();
      const isZhCN = detectedLocale.startsWith('zh');
      
      log.info('Dialog language detection: ' + detectedLocale + ' (isZhCN: ' + isZhCN + ')');
      
      // 根据检测到的语言选择文本
      const dialogTexts = isZhCN ? {
        title: '关闭确认',
        message: '您想要将应用最小化到托盘还是退出应用？',
        minimize: '最小化到托盘',
        exit: '退出应用',
        cancel: '取消',
        remember: '记住我的选择'
      } : {
        title: 'Close Confirmation',
        message: 'Do you want to minimize to tray or exit the application?',
        minimize: 'Minimize to Tray',
        exit: 'Exit Application',
        cancel: 'Cancel',
        remember: 'Remember my choice'
      };
      
      const options = {
        type: 'question',
        buttons: [
          dialogTexts.minimize,
          dialogTexts.exit,
          dialogTexts.cancel
        ],
        defaultId: 0,
        title: dialogTexts.title,
        message: dialogTexts.message,
        checkboxLabel: dialogTexts.remember,
        checkboxChecked: false,
        // 设置固定宽度，确保布局一致
        width: 400,
        // 确保按钮宽度一致
        normalizeAccessKeys: true
      };
      
      dialog.showMessageBox(mainWindow, options).then((result) => {
        if (result.response === 0) {
          // 最小化到托盘
          mainWindow.hide();
          
          // 如果勾选了"记住我的选择"
          if (result.checkboxChecked) {
            store.set('closeAction', 'minimize');
          }
        } else if (result.response === 1) {
          // 退出应用
          if (result.checkboxChecked) {
            store.set('closeAction', 'exit');
          }
          
          isQuitting = true;
          app.quit();
        }
        // 如果是"取消"，什么都不做
      });
      
      return false;
    }
  });

  // 如果设置为不显示菜单，则完全移除菜单
  if (!store.get('showMenu', false)) {
    mainWindow.setMenu(null);
  } else {
    // 创建菜单
    createMenu(mainWindow, store);
  }
  
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
    
    // 获取当前语言
    const detectedLocale = i18n.detectLanguage();
    const isZhCN = detectedLocale.startsWith('zh');
    
    // 托盘菜单文本
    const trayTexts = isZhCN ? {
      toggleWindow: '显示/隐藏窗口',
      play: '播放/暂停',
      stop: '停止',
      previous: '上一曲',
      next: '下一曲',
      volumeUp: '增大音量',
      volumeDown: '减小音量',
      settings: '设置',
      help: '帮助',
      repository: '访问 GitHub 仓库',
      issues: '报告问题',
      about: '关于',
      logs: '查看日志',
      quit: '退出'
    } : {
      toggleWindow: 'Show/Hide Window',
      play: 'Play/Pause',
      stop: 'Stop',
      previous: 'Previous',
      next: 'Next',
      volumeUp: 'Volume Up',
      volumeDown: 'Volume Down',
      settings: 'Settings',
      help: 'Help',
      repository: 'Visit GitHub Repository',
      issues: 'Report Issues',
      about: 'About',
      logs: 'View Logs',
      quit: 'Exit'
    };
    
    const contextMenu = Menu.buildFromTemplate([
      { 
        label: trayTexts.toggleWindow, 
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
        label: trayTexts.play, 
        click: () => {
          mainWindow.webContents.executeJavaScript(SynologyAudioStationControlScript.play);
        }
      },
      { 
        label: trayTexts.stop, 
        click: () => {
          mainWindow.webContents.executeJavaScript(SynologyAudioStationControlScript.stop);
        }
      },
      { 
        label: trayTexts.previous, 
        click: () => {
          mainWindow.webContents.executeJavaScript(SynologyAudioStationControlScript.previous);
        }
      },
      { 
        label: trayTexts.next, 
        click: () => {
          mainWindow.webContents.executeJavaScript(SynologyAudioStationControlScript.next);
        }
      },
      { 
        label: trayTexts.volumeUp, 
        click: () => {
          mainWindow.webContents.executeJavaScript(SynologyAudioStationControlScript.volumeUp);
        }
      },
      { 
        label: trayTexts.volumeDown, 
        click: () => {
          mainWindow.webContents.executeJavaScript(SynologyAudioStationControlScript.volumeDown);
        }
      },
      { type: 'separator' },
      { 
        label: trayTexts.settings, 
        click: showSettings 
      },
      { type: 'separator' },
      {
        label: trayTexts.help,
        submenu: [
          {
            label: trayTexts.repository,
            click: async () => {
              await shell.openExternal('https://github.com/sdjnmxd/electron-audiostation');
            }
          },
          {
            label: trayTexts.issues,
            click: async () => {
              await shell.openExternal('https://github.com/sdjnmxd/electron-audiostation/issues');
            }
          },
          { type: 'separator' },
          {
            label: trayTexts.about,
            click: () => {
              // 获取当前语言
              const detectedLocale = i18n.detectLanguage();
              const isZhCN = detectedLocale.startsWith('zh');
              
              // 关于对话框文本
              const aboutTexts = isZhCN ? {
                title: '关于 Electron AudioStation',
                version: '版本',
                author: '作者',
                description: '一个使用 Electron 构建的 Synology AudioStation 客户端。',
                ok: '确定'
              } : {
                title: 'About Electron AudioStation',
                version: 'Version',
                author: 'Author',
                description: 'An Electron-based client for Synology AudioStation.',
                ok: 'OK'
              };
              
              dialog.showMessageBox(mainWindow, {
                title: aboutTexts.title,
                message: 'Electron AudioStation',
                detail: `${aboutTexts.version}: ${app.getVersion()}\n${aboutTexts.author}: milkfish\n\n${aboutTexts.description}`,
                buttons: [aboutTexts.ok],
                icon: path.join(__dirname, '../../assets/icon.png'),
                // 设置固定宽度，确保布局一致
                width: 400
              });
            }
          },
          {
            label: trayTexts.logs,
            click: () => {
              openLogViewer();
            }
          }
        ]
      },
      { type: 'separator' },
      { 
        label: trayTexts.quit, 
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

// 打开日志查看器
function openLogViewer() {
  try {
    // 获取当前语言
    const detectedLocale = i18n.detectLanguage();
    const isZhCN = detectedLocale.startsWith('zh');
    
    // 日志查看器窗口标题
    const logViewerTitle = isZhCN ? '日志查看器' : 'Log Viewer';
    
    // 检查是否已经存在日志查看器窗口
    const existingLogViewer = BrowserWindow.getAllWindows().find(win => 
      win.getTitle() === logViewerTitle);
    
    if (existingLogViewer) {
      // 如果已存在，则聚焦它
      if (existingLogViewer.isMinimized()) {
        existingLogViewer.restore();
      }
      existingLogViewer.focus();
      return;
    }
    
    // 创建日志查看器窗口
    const logViewerWindow = new BrowserWindow({
      width: 800,
      height: 600,
      title: logViewerTitle,
      parent: mainWindow,
      modal: false,
      show: false,
      autoHideMenuBar: true, // 自动隐藏菜单栏
      webPreferences: {
        preload: path.join(__dirname, '../renderer/log-viewer-preload.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    });
    
    // 完全移除菜单栏
    logViewerWindow.setMenu(null);
    
    // 发送日志内容到窗口
    logViewerWindow.webContents.once('did-finish-load', () => {
      try {
        // 使用新的日志模块读取日志
        const logContent = log.readLogFile();
        logViewerWindow.webContents.send('log-content', logContent);
      } catch (error) {
        logViewerWindow.webContents.send('log-error', error.message);
      }
    });
  } catch (error) {
    log.error('打开日志查看器失败:', error);
    dialog.showErrorBox('日志查看器错误', `无法打开日志查看器: ${error.message}`);
  }
}

// 显示设置窗口
function showSettings() {
  try {
    // 获取当前语言
    const detectedLocale = i18n.detectLanguage();
    const isZhCN = detectedLocale.startsWith('zh');
    
    // 设置窗口标题
    const settingsTitle = isZhCN ? '设置' : 'Settings';
    
    // 检查是否已经存在设置窗口
    const existingSettingsWindow = BrowserWindow.getAllWindows().find(win => 
      win.getTitle() === settingsTitle);
    
    if (existingSettingsWindow) {
      // 如果已存在，则聚焦它
      if (existingSettingsWindow.isMinimized()) {
        existingSettingsWindow.restore();
      }
      existingSettingsWindow.focus();
      return;
    }
    
    // 创建设置窗口
    const settingsWindow = new BrowserWindow({
      width: 750,  // 增加宽度
      height: 650, // 增加高度
      title: settingsTitle,
      parent: mainWindow,
      modal: false,
      show: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, '../renderer/settings-preload.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    });
    
    // 或者完全移除菜单栏
    settingsWindow.setMenu(null);
    
    // 加载设置HTML文件
    const settingsPath = path.join(__dirname, '../renderer/settings.html');
    settingsWindow.loadFile(settingsPath);
    
    settingsWindow.once('ready-to-show', () => {
      settingsWindow.show();
      settingsWindow.focus();
    });
    
    // 处理获取设置
    ipcMain.handle('get-settings', () => {
      return {
        url: store.get('url', ''),
        closeAction: store.get('closeAction'),
        startMinimized: store.get('startMinimized'),
        alwaysOnTop: store.get('alwaysOnTop'),
        theme: store.get('theme'),
        language: store.get('language'),
        showMenu: store.get('showMenu'),
        userAgentType: store.get('userAgentType', 'chrome'),
        customUserAgent: store.get('customUserAgent', '')
      };
    });
    
    // 处理保存设置
    ipcMain.once('save-settings', (event, settings) => {
      // 获取旧设置
      const oldLanguage = store.get('language', 'system');
      const oldUrl = store.get('url', '');
      const oldShowMenu = store.get('showMenu', false);
      const oldUserAgentType = store.get('userAgentType', 'chrome');
      const oldCustomUserAgent = store.get('customUserAgent', '');
      
      // 保存设置
      store.set('url', settings.url);
      store.set('closeAction', settings.closeAction);
      store.set('startMinimized', settings.startMinimized);
      store.set('alwaysOnTop', settings.alwaysOnTop);
      store.set('theme', settings.theme);
      store.set('language', settings.language);
      store.set('showMenu', settings.showMenu);
      store.set('userAgentType', settings.userAgentType);
      store.set('customUserAgent', settings.customUserAgent);
      
      // 应用设置
      mainWindow.setAlwaysOnTop(settings.alwaysOnTop);
      
      // 如果菜单显示设置已更改
      if (settings.showMenu !== oldShowMenu) {
        if (settings.showMenu) {
          // 创建菜单
          createMenu(mainWindow, store);
          mainWindow.setAutoHideMenuBar(false);
        } else {
          // 移除菜单
          mainWindow.setMenu(null);
          mainWindow.setAutoHideMenuBar(true);
        }
      }
      
      // 如果 URL 已更改，重新加载页面
      let needReload = false;
      if (settings.url !== oldUrl && settings.url) {
        needReload = true;
      }
      
      // 如果语言设置已更改
      if (settings.language !== oldLanguage) {
        // 重新创建菜单
        createMenu(mainWindow, store);
        
        // 重新创建托盘菜单
        if (tray) {
          tray.destroy();
          tray = null;
          createTray();
        }
        
        // 检测当前实际语言
        const currentDetectedLanguage = i18n.detectLanguage();
        const willChangeLanguage = 
          (settings.language !== 'system' && settings.language !== currentDetectedLanguage) ||
          (settings.language === 'system' && oldLanguage !== 'system');
        
        if (willChangeLanguage) {
          // 根据当前语言选择提示文本
          const isCurrentZhCN = currentDetectedLanguage.startsWith('zh');
          
          // 关闭设置窗口
          settingsWindow.close();
          
          // 显示重启提示
          dialog.showMessageBox({
            type: 'info',
            title: isCurrentZhCN ? '语言设置已更改' : 'Language Setting Changed',
            message: isCurrentZhCN ? 
              '语言设置已更改，某些界面元素可能需要重启应用才能完全应用新的语言设置。是否现在重启应用？' : 
              'Language setting has been changed. Some UI elements may require restarting the application to fully apply the new language setting. Would you like to restart now?',
            buttons: isCurrentZhCN ? 
              ['立即重启', '稍后重启'] : 
              ['Restart Now', 'Restart Later'],
            defaultId: 0,
            // 设置固定宽度，确保布局一致
            width: 500,
            // 确保按钮宽度一致
            normalizeAccessKeys: true
          }).then(result => {
            if (result.response === 0) {
              // 用户选择立即重启
              app.relaunch();
              isQuitting = true;
              app.quit();
            } else if (needReload) {
              // 如果需要重新加载页面
              mainWindow.loadURL(settings.url);
            }
          });
          
          return; // 提前返回，避免执行下面的代码
        }
      }
      
      // 检查 UA 是否已更改
      const uaChanged = settings.userAgentType !== oldUserAgentType || 
                        (settings.userAgentType === 'custom' && settings.customUserAgent !== oldCustomUserAgent);
      
      // 如果 UA 已更改，需要重启应用
      if (uaChanged) {
        // 获取当前检测到的语言
        const currentDetectedLanguage = i18n.detectLanguage();
        const isCurrentZhCN = currentDetectedLanguage.startsWith('zh');
        
        // 关闭设置窗口
        settingsWindow.close();
        
        // 显示重启提示
        dialog.showMessageBox({
          type: 'info',
          title: isCurrentZhCN ? 'User-Agent 设置已更改' : 'User-Agent Setting Changed',
          message: isCurrentZhCN ? 
            'User-Agent 设置已更改，需要重启应用才能应用新的设置。是否现在重启应用？' : 
            'User-Agent setting has been changed. The application needs to restart to apply the new setting. Would you like to restart now?',
          buttons: isCurrentZhCN ? 
            ['立即重启', '稍后重启'] : 
            ['Restart Now', 'Restart Later'],
          defaultId: 0,
          width: 500,
          normalizeAccessKeys: true
        }).then(result => {
          if (result.response === 0) {
            // 用户选择立即重启
            // 清除 session 数据以确保新的 UA 设置生效
            mainWindow.webContents.session.clearStorageData({
              storages: ['cookies', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'],
            }).then(() => {
              app.relaunch();
              isQuitting = true;
              app.quit();
            });
          } else if (needReload) {
            // 如果需要重新加载页面
            mainWindow.loadURL(settings.url);
          }
        });
        
        return; // 提前返回，避免执行下面的代码
      }
      
      // 关闭设置窗口
      settingsWindow.close();
      
      // 如果需要重新加载页面
      if (needReload) {
        mainWindow.loadURL(settings.url);
      }
      
      // 移除所有相关的一次性事件监听器
      ipcMain.removeHandler('get-settings');
      ipcMain.removeAllListeners('save-settings');
      ipcMain.removeAllListeners('cancel-settings');
    });
    
    // 处理取消
    ipcMain.once('cancel-settings', () => {
      settingsWindow.close();
    });
    
    // 处理窗口关闭
    settingsWindow.on('closed', () => {
      // 移除所有相关的一次性事件监听器
      ipcMain.removeHandler('get-settings');
      ipcMain.removeAllListeners('save-settings');
      ipcMain.removeAllListeners('cancel-settings');
    });
  } catch (error) {
    log.error('打开设置窗口失败:', error);
    dialog.showErrorBox('设置错误', `无法打开设置窗口: ${error.message}`);
  }
}

// 处理打开设置消息
ipcMain.on('open-settings', () => {
  showSettings();
});

// 处理获取当前语言
ipcMain.handle('get-current-language', () => {
  return i18n.detectLanguage();
});

// 导出函数
module.exports = {
  openLogViewer,
  showSettings
}; 