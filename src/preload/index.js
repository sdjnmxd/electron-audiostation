const { contextBridge, ipcRenderer } = require('electron')

// 安全地暴露 IPC 通信接口 - 合并了所有预加载脚本的功能
contextBridge.exposeInMainWorld('electronAPI', {
  // 设置相关
  getSettings: () => ipcRenderer.invoke('get-settings'),
  
  // 保存设置
  saveSettings: (settings) => ipcRenderer.send('save-settings', settings),
  
  // 取消设置
  cancelSettings: () => ipcRenderer.send('cancel-settings'),
  
  // 语言相关
  getCurrentLanguage: () => ipcRenderer.invoke('get-current-language'),
  
  // 日志相关
  readLog: () => ipcRenderer.invoke('read-log'),
  
  // 导航相关
  requestOpenSettings: () => ipcRenderer.send('open-settings'),
  
  // 应用控制
  restartApp: () => ipcRenderer.send('restart-app'),
  
  // 检查设置是否需要重启
  checkIfRestartRequired: (changedSettings) => ipcRenderer.invoke('check-restart-required', changedSettings),
  
  // 应用无需重启的设置
  applyConfigWithoutRestart: () => ipcRenderer.invoke('apply-config-without-restart'),
  
  // 事件监听
  onConfigChanged: (callback) => {
    ipcRenderer.on('config-changed', (event, settings) => callback(settings))
    return () => ipcRenderer.removeListener('config-changed', callback)
  },
  
  onSettingsCanceled: (callback) => {
    ipcRenderer.on('settings-canceled', callback)
    return () => ipcRenderer.removeListener('settings-canceled', callback)
  },
  
  onOpenSettings: (callback) => {
    ipcRenderer.on('open-settings', callback)
    return () => ipcRenderer.removeListener('open-settings', callback)
  }
}) 