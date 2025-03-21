const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露 IPC 通信接口
contextBridge.exposeInMainWorld('electronAPI', {
  // 接收日志内容
  onLogContent: (callback) => ipcRenderer.on('log-content', (event, content) => callback(content)),
  onLogError: (callback) => ipcRenderer.on('log-error', (event, error) => callback(error))
}); 