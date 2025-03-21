const log = require('electron-log');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

// 配置日志
log.transports.file.level = 'info';
log.transports.console.level = 'debug';

// 设置日志文件编码和格式
log.transports.file.format = '{y}-{m}-{d} {h}:{i}:{s}.{ms} [{level}] {text}';
log.transports.file.encoding = 'utf8';

// 确保日志目录存在
const ensureLogDir = () => {
  const logDir = path.dirname(log.transports.file.getFile().path);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
};

// 包装日志函数，确保正确处理编码
const logger = {
  info: (message, ...args) => {
    ensureLogDir();
    // 尝试使用 Buffer 来处理编码
    if (typeof message === 'string' && /[\u4e00-\u9fa5]/.test(message)) {
      // 包含中文字符，使用 ASCII 转义
      message = message.replace(/[\u4e00-\u9fa5]/g, char => {
        return '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0');
      });
    }
    log.info(message, ...args);
  },
  
  error: (message, ...args) => {
    ensureLogDir();
    if (typeof message === 'string' && /[\u4e00-\u9fa5]/.test(message)) {
      message = message.replace(/[\u4e00-\u9fa5]/g, char => {
        return '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0');
      });
    }
    log.error(message, ...args);
  },
  
  warn: (message, ...args) => {
    ensureLogDir();
    if (typeof message === 'string' && /[\u4e00-\u9fa5]/.test(message)) {
      message = message.replace(/[\u4e00-\u9fa5]/g, char => {
        return '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0');
      });
    }
    log.warn(message, ...args);
  },
  
  debug: (message, ...args) => {
    ensureLogDir();
    if (typeof message === 'string' && /[\u4e00-\u9fa5]/.test(message)) {
      message = message.replace(/[\u4e00-\u9fa5]/g, char => {
        return '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0');
      });
    }
    log.debug(message, ...args);
  },
  
  // 获取日志文件路径
  getLogFilePath: () => {
    return log.transports.file.getFile().path;
  },
  
  // 读取日志文件内容
  readLogFile: () => {
    const logPath = log.transports.file.getFile().path;
    try {
      return fs.readFileSync(logPath, 'utf8');
    } catch (error) {
      logger.error('Failed to read log file:', error);
      return `Error reading log file: ${error.message}`;
    }
  }
};

module.exports = logger; 