const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露 IPC 通信接口
contextBridge.exposeInMainWorld('electronAPI', {
  // 获取设置
  getSettings: () => ipcRenderer.invoke('get-settings'),
  
  // 保存设置
  saveSettings: (settings) => {
    console.log('发送保存设置请求:', settings);
    return ipcRenderer.send('save-settings', settings);
  },
  
  // 取消设置
  cancelSettings: () => ipcRenderer.send('cancel-settings'),
  
  // 获取当前语言
  getCurrentLanguage: () => ipcRenderer.invoke('get-current-language'),
  
  // 检查设置是否需要重启应用
  checkIfRestartRequired: (changedSettings) => ipcRenderer.invoke('check-restart-required', changedSettings),
  
  // 保存设置并提示重启
  saveAndPromptRestart: (settings) => ipcRenderer.invoke('save-and-prompt-restart', settings)
});

// 添加调试日志
console.log('设置预加载脚本已加载'); 