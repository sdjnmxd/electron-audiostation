const log = require('electron-log');

// 配置日志
log.transports.file.level = 'info';
log.transports.console.level = 'debug';

// 设置日志文件编码
log.transports.file.format = '{y}-{m}-{d} {h}:{i}:{s}.{ms} [{level}] {text}';
log.transports.file.encoding = 'utf8';

module.exports = log; 