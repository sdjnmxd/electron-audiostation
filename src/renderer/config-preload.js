const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露 IPC 通信接口
contextBridge.exposeInMainWorld('electronAPI', {
  // 发送消息到主进程
  saveConfig: (url) => ipcRenderer.send('save-config', url),
  cancelConfig: () => ipcRenderer.send('cancel-config'),
  
  // 获取当前配置
  getCurrentUrl: () => ipcRenderer.invoke('get-current-url'),
  
  // 添加监听配置变更的方法
  onConfigChanged: (callback) => ipcRenderer.on('config-changed', callback),
  
  // 添加应用设置而不重启的方法
  applyConfigWithoutRestart: () => ipcRenderer.invoke('apply-config-without-restart'),
  
  // 检查设置是否需要重启应用
  checkIfRestartRequired: (changedSettings) => ipcRenderer.invoke('check-restart-required', changedSettings),
  
  // 保存设置并提示重启
  saveAndPromptRestart: (settings) => ipcRenderer.invoke('save-and-prompt-restart', settings),
  
  // 重启应用
  restartApp: () => ipcRenderer.send('restart-app')
});

// 添加调试日志
console.log('配置预加载脚本已加载'); 