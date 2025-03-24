const { Menu, shell, dialog, app } = require('electron');
const path = require('path');
const i18n = require('../common/i18n');
const { getMainWindow } = require('./window-manager');
const { executeAudioStationCommand } = require('./shortcuts');

/**
 * 创建应用菜单
 */
function createMenu() {
  const isMac = process.platform === 'darwin';
  
  const template = [
    // App菜单（仅macOS）
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about', label: i18n.t('menu.appMenu') },
        { type: 'separator' },
        { 
          label: i18n.t('menu.preferences'),
          accelerator: 'CmdOrCtrl+,',
          click: () => openSettings()
        },
        { type: 'separator' },
        { role: 'services', label: i18n.t('menu.services') },
        { type: 'separator' },
        { role: 'hide', label: i18n.t('menu.hide') },
        { role: 'hideOthers', label: i18n.t('menu.hideOthers') },
        { role: 'unhide', label: i18n.t('menu.showAll') },
        { type: 'separator' },
        { role: 'quit', label: i18n.t('menu.quit') }
      ]
    }] : []),
    
    // 文件菜单
    {
      label: i18n.t('menu.file'),
      submenu: [
        {
          label: i18n.t('menu.settings'),
          accelerator: 'CmdOrCtrl+,',
          click: () => openSettings()
        },
        { type: 'separator' },
        ...(isMac ? [] : [
          { role: 'quit', label: i18n.t('menu.exit'), accelerator: 'CmdOrCtrl+Q' }
        ])
      ]
    },
    
    // 编辑菜单
    {
      label: i18n.t('menu.edit'),
      submenu: [
        { role: 'undo', label: i18n.t('menu.undo') },
        { role: 'redo', label: i18n.t('menu.redo') },
        { type: 'separator' },
        { role: 'cut', label: i18n.t('menu.cut') },
        { role: 'copy', label: i18n.t('menu.copy') },
        { role: 'paste', label: i18n.t('menu.paste') },
        { role: 'pasteAndMatchStyle', label: i18n.t('menu.pasteAndMatch') },
        { role: 'delete', label: i18n.t('menu.delete') },
        { type: 'separator' },
        { role: 'selectAll', label: i18n.t('menu.selectAll') }
      ]
    },
    
    // 视图菜单
    {
      label: i18n.t('menu.view'),
      submenu: [
        { role: 'reload', label: i18n.t('menu.reload') },
        { role: 'forceReload', label: i18n.t('menu.forceReload') },
        { role: 'toggleDevTools', label: i18n.t('menu.toggleDevTools') },
        { type: 'separator' },
        { role: 'resetZoom', label: i18n.t('menu.resetZoom') },
        { role: 'zoomIn', label: i18n.t('menu.zoomIn') },
        { role: 'zoomOut', label: i18n.t('menu.zoomOut') },
        { type: 'separator' },
        { role: 'togglefullscreen', label: i18n.t('menu.toggleFullscreen') }
      ]
    },
    
    // 播放控制菜单
    {
      label: i18n.t('menu.playback'),
      submenu: [
        {
          label: i18n.t('menu.play'),
          accelerator: 'Space',
          click: () => executeAudioStationCommand('play')
        },
        {
          label: i18n.t('menu.stop'),
          accelerator: 'Escape',
          click: () => executeAudioStationCommand('stop')
        },
        { type: 'separator' },
        {
          label: i18n.t('menu.previous'),
          accelerator: 'Left',
          click: () => executeAudioStationCommand('previous')
        },
        {
          label: i18n.t('menu.next'),
          accelerator: 'Right',
          click: () => executeAudioStationCommand('next')
        },
        { type: 'separator' },
        {
          label: i18n.t('menu.volumeUp'),
          accelerator: 'Up',
          click: () => executeAudioStationCommand('volumeUp')
        },
        {
          label: i18n.t('menu.volumeDown'),
          accelerator: 'Down',
          click: () => executeAudioStationCommand('volumeDown')
        }
      ]
    },
    
    // 窗口菜单
    {
      label: i18n.t('menu.window'),
      submenu: [
        { role: 'minimize', label: i18n.t('menu.minimize') },
        { role: 'zoom', label: i18n.t('menu.zoom') },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front', label: i18n.t('menu.front') },
        ] : [
          { role: 'close', label: i18n.t('menu.close') }
        ])
      ]
    },
    
    // 帮助菜单
    {
      role: 'help',
      label: i18n.t('menu.help'),
      submenu: [
        {
          label: i18n.t('menu.repository'),
          click: async () => {
            await shell.openExternal('https://github.com/sdjnmxd/electron-audiostation');
          }
        },
        {
          label: i18n.t('menu.issues'),
          click: async () => {
            await shell.openExternal('https://github.com/sdjnmxd/electron-audiostation/issues');
          }
        },
        { type: 'separator' },
        {
          label: i18n.t('menu.about'),
          click: () => showAboutDialog()
        },
        {
          label: i18n.t('menu.logs'),
          click: () => {
            const mainWindow = getMainWindow();
            if (mainWindow) {
              mainWindow.loadURL('app://./logs');
            }
          }
        }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  
  return menu;
}

/**
 * 打开设置窗口
 */
function openSettings() {
  const mainWindow = getMainWindow();
  if (mainWindow) {
    mainWindow.webContents.send('open-settings');
  }
}

/**
 * 显示关于对话框
 */
function showAboutDialog() {
  const mainWindow = getMainWindow();
  if (mainWindow) {
    dialog.showMessageBox(mainWindow, {
      title: i18n.t('menu.aboutTitle'),
      message: 'Electron AudioStation',
      detail: `${i18n.t('menu.version')}: ${app.getVersion()}\n${i18n.t('menu.author')}: milkfish\n\n${i18n.t('menu.description')}`,
      buttons: [i18n.t('menu.ok')],
      icon: path.join(__dirname, '../../assets/icon.png')
    });
  }
}

module.exports = {
  createMenu
}; 