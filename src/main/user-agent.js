const { app, session } = require('electron');
const Store = require('electron-store');
const log = require('../common/logger');

// 初始化存储
const store = new Store();

// 预设的 User-Agent 字符串
const USER_AGENT_STRINGS = {
  chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
  safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
};

/**
 * 设置全局User-Agent
 */
function setupUserAgent() {
  const userAgent = getUserAgent();
  
  if (userAgent) {
    app.userAgentFallback = userAgent;
    log.info('Setting app-level User-Agent: ' + userAgent);
    
    // 也设置默认会话的User-Agent
    app.whenReady().then(() => {
      session.defaultSession.setUserAgent(userAgent);
    });
  }
}

/**
 * 获取应该使用的User-Agent
 */
function getUserAgent() {
  const userAgentType = store.get('userAgentType', 'chrome');
  const customUserAgent = store.get('customUserAgent', '');
  
  // 确定要使用的 User-Agent
  if (userAgentType === 'custom' && customUserAgent) {
    return customUserAgent;
  } else if (userAgentType === 'default') {
    return undefined; // 使用 Electron 默认值
  } else {
    return USER_AGENT_STRINGS[userAgentType] || USER_AGENT_STRINGS.chrome;
  }
}

module.exports = {
  setupUserAgent,
  getUserAgent
}; 