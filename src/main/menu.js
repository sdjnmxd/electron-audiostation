const { Menu, shell, dialog } = require('electron');
const { app } = require('electron');
const path = require('path');
const i18n = require('../common/i18n');

/**
 * 创建应用菜单
 * @param {BrowserWindow} mainWindow - 主窗口实例
 * @param {Store} store - 配置存储实例
 */
function createMenu(mainWindow, store) {
  const isMac = process.platform === 'darwin';
  
  // 获取当前语言
  const detectedLocale = i18n.detectLanguage();
  const isZhCN = detectedLocale.startsWith('zh');
  
  // 菜单文本
  const menuTexts = isZhCN ? {
    // 中文菜单文本
    about: '关于 Electron AudioStation',
    preferences: '偏好设置',
    services: '服务',
    hide: '隐藏 Electron AudioStation',
    hideOthers: '隐藏其他应用',
    showAll: '显示全部',
    quit: '退出 Electron AudioStation',
    file: '文件',
    editConfig: '编辑配置',
    settings: '设置',
    close: '关闭窗口',
    exit: '退出',
    edit: '编辑',
    undo: '撤销',
    redo: '重做',
    cut: '剪切',
    copy: '复制',
    paste: '粘贴',
    pasteAndMatch: '粘贴并匹配样式',
    delete: '删除',
    selectAll: '全选',
    view: '视图',
    reload: '重新加载',
    forceReload: '强制重新加载',
    toggleDevTools: '切换开发者工具',
    resetZoom: '重置缩放',
    zoomIn: '放大',
    zoomOut: '缩小',
    toggleFullscreen: '切换全屏',
    playback: '播放控制',
    play: '播放/暂停',
    stop: '停止',
    previous: '上一曲',
    next: '下一曲',
    volumeUp: '增大音量',
    volumeDown: '减小音量',
    window: '窗口',
    minimize: '最小化',
    zoom: '缩放',
    front: '前置所有窗口',
    help: '帮助',
    repository: '访问 GitHub 仓库',
    issues: '报告问题',
    about2: '关于',
    logs: '查看日志',
    ok: '确定',
    version: '版本',
    author: '作者',
    description: '一个使用 Electron 构建的 Synology AudioStation 客户端。'
  } : {
    // 英文菜单文本
    about: 'About Electron AudioStation',
    preferences: 'Preferences',
    services: 'Services',
    hide: 'Hide Electron AudioStation',
    hideOthers: 'Hide Others',
    showAll: 'Show All',
    quit: 'Quit Electron AudioStation',
    file: 'File',
    editConfig: 'Edit Configuration',
    settings: 'Settings',
    close: 'Close Window',
    exit: 'Exit',
    edit: 'Edit',
    undo: 'Undo',
    redo: 'Redo',
    cut: 'Cut',
    copy: 'Copy',
    paste: 'Paste',
    pasteAndMatch: 'Paste and Match Style',
    delete: 'Delete',
    selectAll: 'Select All',
    view: 'View',
    reload: 'Reload',
    forceReload: 'Force Reload',
    toggleDevTools: 'Toggle Developer Tools',
    resetZoom: 'Reset Zoom',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    toggleFullscreen: 'Toggle Fullscreen',
    playback: 'Playback',
    play: 'Play/Pause',
    stop: 'Stop',
    previous: 'Previous',
    next: 'Next',
    volumeUp: 'Volume Up',
    volumeDown: 'Volume Down',
    window: 'Window',
    minimize: 'Minimize',
    zoom: 'Zoom',
    front: 'Bring All to Front',
    help: 'Help',
    repository: 'Visit GitHub Repository',
    issues: 'Report Issues',
    about2: 'About',
    logs: 'View Logs',
    ok: 'OK',
    version: 'Version',
    author: 'Author',
    description: 'A Synology AudioStation client built with Electron.'
  };
  
  const template = [
    // App 菜单 (仅 macOS)
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about', label: menuTexts.about },
        { type: 'separator' },
        { 
          label: menuTexts.preferences,
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            // 打开设置窗口
            mainWindow.webContents.send('open-settings');
          }
        },
        { type: 'separator' },
        { role: 'services', label: menuTexts.services },
        { type: 'separator' },
        { role: 'hide', label: menuTexts.hide },
        { role: 'hideOthers', label: menuTexts.hideOthers },
        { role: 'unhide', label: menuTexts.showAll },
        { type: 'separator' },
        { role: 'quit', label: menuTexts.quit }
      ]
    }] : []),
    
    // 文件菜单
    {
      label: menuTexts.file,
      submenu: [
        { 
          label: menuTexts.settings,
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            require('./index').showSettings();
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close', label: menuTexts.close } : { role: 'quit', label: menuTexts.exit }
      ]
    },
    
    // 编辑菜单
    {
      label: menuTexts.edit,
      submenu: [
        { role: 'undo', label: menuTexts.undo },
        { role: 'redo', label: menuTexts.redo },
        { type: 'separator' },
        { role: 'cut', label: menuTexts.cut },
        { role: 'copy', label: menuTexts.copy },
        { role: 'paste', label: menuTexts.paste },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle', label: menuTexts.pasteAndMatch },
          { role: 'delete', label: menuTexts.delete },
          { role: 'selectAll', label: menuTexts.selectAll },
        ] : [
          { role: 'delete', label: menuTexts.delete },
          { type: 'separator' },
          { role: 'selectAll', label: menuTexts.selectAll }
        ])
      ]
    },
    
    // 视图菜单
    {
      label: menuTexts.view,
      submenu: [
        { role: 'reload', label: menuTexts.reload },
        { role: 'forceReload', label: menuTexts.forceReload },
        { role: 'toggleDevTools', label: menuTexts.toggleDevTools },
        { type: 'separator' },
        { role: 'resetZoom', label: menuTexts.resetZoom },
        { role: 'zoomIn', label: menuTexts.zoomIn },
        { role: 'zoomOut', label: menuTexts.zoomOut },
        { type: 'separator' },
        { role: 'togglefullscreen', label: menuTexts.toggleFullscreen }
      ]
    },
    
    // 播放控制菜单
    {
      label: menuTexts.playback,
      submenu: [
        {
          label: menuTexts.play,
          accelerator: 'Space',
          click: () => {
            mainWindow.webContents.executeJavaScript(
              'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.doPlay()'
            );
          }
        },
        {
          label: menuTexts.stop,
          accelerator: 'Escape',
          click: () => {
            mainWindow.webContents.executeJavaScript(
              'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.doStop()'
            );
          }
        },
        { type: 'separator' },
        {
          label: menuTexts.previous,
          accelerator: 'Left',
          click: () => {
            mainWindow.webContents.executeJavaScript(
              'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.doPrevious()'
            );
          }
        },
        {
          label: menuTexts.next,
          accelerator: 'Right',
          click: () => {
            mainWindow.webContents.executeJavaScript(
              'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.doNext()'
            );
          }
        },
        { type: 'separator' },
        {
          label: menuTexts.volumeUp,
          accelerator: 'Up',
          click: () => {
            mainWindow.webContents.executeJavaScript(
              'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.setVolume(Math.min(100, SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.getVolume() + 5))'
            );
          }
        },
        {
          label: menuTexts.volumeDown,
          accelerator: 'Down',
          click: () => {
            mainWindow.webContents.executeJavaScript(
              'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.setVolume(Math.max(0, SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.getVolume() - 5))'
            );
          }
        }
      ]
    },
    
    // 窗口菜单
    {
      label: menuTexts.window,
      submenu: [
        { role: 'minimize', label: menuTexts.minimize },
        { role: 'zoom', label: menuTexts.zoom },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front', label: menuTexts.front },
        ] : [
          { role: 'close', label: menuTexts.close }
        ])
      ]
    },
    
    // 帮助菜单
    {
      role: 'help',
      label: menuTexts.help,
      submenu: [
        {
          label: menuTexts.repository,
          click: async () => {
            await shell.openExternal('https://github.com/sdjnmxd/electron-audiostation');
          }
        },
        {
          label: menuTexts.issues,
          click: async () => {
            await shell.openExternal('https://github.com/sdjnmxd/electron-audiostation/issues');
          }
        },
        { type: 'separator' },
        {
          label: menuTexts.about2,
          click: () => {
            dialog.showMessageBox(mainWindow, {
              title: menuTexts.about,
              message: 'Electron AudioStation',
              detail: `${menuTexts.version}: ${app.getVersion()}\n${menuTexts.author}: milkfish\n\n${menuTexts.description}`,
              buttons: [menuTexts.ok],
              icon: path.join(__dirname, '../../assets/icon.png')
            });
          }
        },
        {
          label: menuTexts.logs,
          click: () => {
            require('./index').openLogViewer();
          }
        }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = {
  createMenu
}; 