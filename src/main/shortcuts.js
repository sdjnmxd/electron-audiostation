const { globalShortcut } = require('electron');
const log = require('../common/logger');
const { getMainWindow } = require('./window-manager');

// 控制脚本
const SynologyAudioStationControlScript = {
  play: 'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.doPlay()',
  stop: 'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.doStop()',
  previous: 'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.doPrevious()',
  next: 'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.doNext()',
  volumeUp: 'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.setVolume(Math.min(100, SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.getVolume() + 5))',
  volumeDown: 'SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.setVolume(Math.max(0, SYNO.SDS.AudioStation.Window.getPanelScope("SYNO.SDS.AudioStation.Main").audioPlayer.getVolume() - 5))'
};

/**
 * 注册全局快捷键
 */
function registerShortcuts() {
  // 媒体播放控制
  globalShortcut.register('MediaPlayPause', () => {
    executeAudioStationCommand('play');
  });
  
  globalShortcut.register('MediaStop', () => {
    executeAudioStationCommand('stop');
  });
  
  globalShortcut.register('MediaPreviousTrack', () => {
    executeAudioStationCommand('previous');
  });
  
  globalShortcut.register('MediaNextTrack', () => {
    executeAudioStationCommand('next');
  });
  
  log.info('Global shortcuts registered');
}

/**
 * 注销全局快捷键
 */
function unregisterShortcuts() {
  globalShortcut.unregisterAll();
  log.info('Global shortcuts unregistered');
}

/**
 * 执行AudioStation命令
 */
function executeAudioStationCommand(command) {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;
  
  const script = SynologyAudioStationControlScript[command];
  if (script) {
    mainWindow.webContents.executeJavaScript(script).catch(error => {
      log.error(`Failed to execute ${command} command:`, error);
    });
  }
}

module.exports = {
  registerShortcuts,
  unregisterShortcuts,
  executeAudioStationCommand
}; 