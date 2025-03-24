const log = require('electron-log');

// 配置日志
log.transports.file.level = 'info';
log.transports.console.level = 'debug';

// 设置日志文件编码
log.transports.file.encoding = 'utf8';

// 直接导出electron-log的实例，添加一些辅助方法
module.exports = {
  // 直接使用electron-log的日志方法
  info: log.info,
  warn: log.warn,
  error: log.error,
  debug: log.debug,
  
  // 获取日志路径
  getLogPath: () => log.transports.file.getFile().path,
  
  // 读取日志内容 - 为LogViewer组件提供支持
  readLog: () => {
    try {
      const fs = require('fs');
      return fs.readFileSync(log.transports.file.getFile().path, 'utf8');
    } catch (error) {
      log.error('Failed to read log file:', error);
      return `Error reading log file: ${error.message}`;
    }
  },
  
  // 清除日志 - 为LogViewer组件提供支持
  clearLog: () => {
    try {
      const fs = require('fs');
      fs.writeFileSync(log.transports.file.getFile().path, '', 'utf8');
      return true;
    } catch (error) {
      log.error('Failed to clear log file:', error);
      return false;
    }
  }
}; 