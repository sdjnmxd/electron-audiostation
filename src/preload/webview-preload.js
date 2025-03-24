const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露 IPC 通信接口
contextBridge.exposeInMainWorld('electronAPI', {
  // 打开设置
  requestOpenSettings: () => ipcRenderer.send('open-settings'),
  
  // 媒体控制
  playPause: () => ipcRenderer.send('media-play-pause'),
  stop: () => ipcRenderer.send('media-stop'),
  previous: () => ipcRenderer.send('media-previous'),
  next: () => ipcRenderer.send('media-next'),
  volumeUp: () => ipcRenderer.send('media-volume-up'),
  volumeDown: () => ipcRenderer.send('media-volume-down'),
  
  // 获取当前播放状态
  getPlaybackState: () => ipcRenderer.invoke('get-playback-state')
});

// 注入AudioStation控制脚本
window.addEventListener('DOMContentLoaded', () => {
  // 检测AudioStation界面是否加载完成
  const checkAudioStationLoaded = setInterval(() => {
    if (window.SYNO && window.SYNO.SDS && window.SYNO.SDS.AudioStation) {
      clearInterval(checkAudioStationLoaded);
      console.log('AudioStation detected, injecting control scripts');
      
      // 向主进程发送AudioStation已加载消息
      ipcRenderer.send('audiostation-loaded');
      
      // 监听播放状态变化
      const audioPlayer = SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer;
      
      // 定期检查播放状态并发送到主进程
      setInterval(() => {
        try {
          const state = {
            isPlaying: audioPlayer.isPlaying(),
            currentTrack: audioPlayer.getCurrentTrack(),
            volume: audioPlayer.getVolume()
          };
          ipcRenderer.send('playback-state-update', state);
        } catch (error) {
          console.error('Error getting playback state:', error);
        }
      }, 1000);
    }
  }, 500);
}); 