const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露 IPC 通信接口
contextBridge.exposeInMainWorld('electronAPI', {
  // 接收来自主进程的消息
  onEditConfig: (callback) => ipcRenderer.on('edit-config', callback),
  onOpenSettings: (callback) => ipcRenderer.on('open-settings', callback),
  
  // 发送消息到主进程
  saveConfig: (url) => ipcRenderer.send('save-config', url),
  cancelConfig: () => ipcRenderer.send('cancel-config'),
  requestEditConfig: () => ipcRenderer.send('edit-config'),
  requestOpenSettings: () => ipcRenderer.send('open-settings'),
  
  // 获取应用信息
  getAppVersion: () => ipcRenderer.invoke('get-app-version')
});

// 注入自定义样式以改善 AudioStation 的桌面体验
window.addEventListener('DOMContentLoaded', () => {
  // 创建样式元素
  const style = document.createElement('style');
  style.textContent = `
    /* 改善滚动条样式 */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.5);
    }
    
    /* 改善焦点样式 */
    :focus {
      outline: 2px solid rgba(0, 120, 212, 0.5) !important;
      outline-offset: -2px;
    }
    
    /* 改善响应式布局 */
    @media (max-width: 768px) {
      .syno-as-responsive-fix {
        flex-direction: column !important;
      }
    }
  `;
  
  // 添加到文档头部
  document.head.appendChild(style);

  // 监听来自主进程的编辑配置消息
  window.electronAPI.onEditConfig(() => {
    console.log('收到编辑配置消息');
    // 直接发送消息到主进程，不依赖于 DOM 事件
    window.electronAPI.requestEditConfig();
  });
}); 