const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露 IPC 通信接口
contextBridge.exposeInMainWorld('electronAPI', {
  // 发送消息到主进程
  saveConfig: (url) => ipcRenderer.send('save-config', url),
  cancelConfig: () => ipcRenderer.send('cancel-config'),
  
  // 获取当前配置
  getCurrentUrl: () => ipcRenderer.invoke('get-current-url')
});

// 添加调试日志
console.log('配置预加载脚本已加载'); 