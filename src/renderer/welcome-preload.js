const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  requestOpenSettings: () => ipcRenderer.send('open-settings'),
  getCurrentLanguage: () => ipcRenderer.invoke('get-current-language')
}); 