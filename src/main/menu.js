const { Menu, shell, dialog } = require('electron');
const { app } = require('electron');
const path = require('path');

/**
 * 创建应用菜单
 * @param {BrowserWindow} mainWindow - 主窗口实例
 * @param {Store} store - 配置存储实例
 */
function createMenu(mainWindow, store) {
  const isMac = process.platform === 'darwin';
  
  const template = [
    // App 菜单 (仅 macOS)
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about', label: '关于 Electron AudioStation' },
        { type: 'separator' },
        { 
          label: '偏好设置',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            // 打开设置窗口
            mainWindow.webContents.send('open-settings');
          }
        },
        { type: 'separator' },
        { role: 'services', label: '服务' },
        { type: 'separator' },
        { role: 'hide', label: '隐藏 Electron AudioStation' },
        { role: 'hideOthers', label: '隐藏其他应用' },
        { role: 'unhide', label: '显示全部' },
        { type: 'separator' },
        { role: 'quit', label: '退出 Electron AudioStation' }
      ]
    }] : []),
    
    // 文件菜单
    {
      label: '文件',
      submenu: [
        {
          label: '编辑配置',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            require('./index').editConfig();
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close', label: '关闭窗口' } : { role: 'quit', label: '退出' }
      ]
    },
    
    // 编辑菜单
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle', label: '粘贴并匹配样式' },
          { role: 'delete', label: '删除' },
          { role: 'selectAll', label: '全选' },
        ] : [
          { role: 'delete', label: '删除' },
          { type: 'separator' },
          { role: 'selectAll', label: '全选' }
        ])
      ]
    },
    
    // 视图菜单
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forceReload', label: '强制重新加载' },
        { type: 'separator' },
        { role: 'resetZoom', label: '重置缩放' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { 
          label: '始终置顶',
          type: 'checkbox',
          checked: store.get('alwaysOnTop'),
          click: () => {
            const newValue = !store.get('alwaysOnTop');
            store.set('alwaysOnTop', newValue);
            mainWindow.setAlwaysOnTop(newValue);
          }
        },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '切换全屏' }
      ]
    },
    
    // 播放控制菜单
    {
      label: '播放控制',
      submenu: [
        {
          label: '播放/暂停',
          accelerator: 'Space',
          click: () => {
            mainWindow.webContents.executeJavaScript(
              'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.doPlay()'
            );
          }
        },
        {
          label: '停止',
          click: () => {
            mainWindow.webContents.executeJavaScript(
              'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.doStop()'
            );
          }
        },
        {
          label: '上一曲',
          accelerator: 'Left',
          click: () => {
            mainWindow.webContents.executeJavaScript(
              'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.doPrevious()'
            );
          }
        },
        {
          label: '下一曲',
          accelerator: 'Right',
          click: () => {
            mainWindow.webContents.executeJavaScript(
              'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.doNext()'
            );
          }
        },
        { type: 'separator' },
        {
          label: '增加音量',
          accelerator: 'Up',
          click: () => {
            mainWindow.webContents.executeJavaScript(
              'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.setVolume(Math.min(100, SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.getVolume() + 5))'
            );
          }
        },
        {
          label: '减小音量',
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
      label: '窗口',
      submenu: [
        { role: 'minimize', label: '最小化' },
        { role: 'zoom', label: '缩放' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front', label: '前置所有窗口' },
        ] : [
          { role: 'close', label: '关闭' }
        ])
      ]
    },
    
    // 帮助菜单
    {
      role: 'help',
      label: '帮助',
      submenu: [
        {
          label: '访问 GitHub 仓库',
          click: async () => {
            await shell.openExternal('https://github.com/sdjnmxd/electron-audiostation');
          }
        },
        {
          label: '报告问题',
          click: async () => {
            await shell.openExternal('https://github.com/sdjnmxd/electron-audiostation/issues');
          }
        },
        { type: 'separator' },
        {
          label: '关于',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              title: '关于 Electron AudioStation',
              message: 'Electron AudioStation',
              detail: `版本: ${app.getVersion()}\n作者: milkfish\n\n一个使用 Electron 构建的 Synology AudioStation 客户端。`,
              buttons: ['确定'],
              icon: path.join(__dirname, '../../assets/icon.png')
            });
          }
        },
        {
          label: '查看日志',
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