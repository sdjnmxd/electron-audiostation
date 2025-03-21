const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露 IPC 通信接口
contextBridge.exposeInMainWorld('electronAPI', {
  // 获取设置
  getSettings: () => ipcRenderer.invoke('get-settings'),
  
  // 保存设置
  saveSettings: (settings) => ipcRenderer.send('save-settings', settings),
  
  // 取消设置
  cancelSettings: () => ipcRenderer.send('cancel-settings'),
  
  // 获取当前语言
  getCurrentLanguage: () => ipcRenderer.invoke('get-current-language')
}); 