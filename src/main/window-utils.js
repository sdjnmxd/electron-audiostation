const { dialog, app } = require('electron');
const Store = require('electron-store');
const i18n = require('../common/i18n');

// 初始化存储
const store = new Store();

// 是否正在退出
let isQuitting = false;

/**
 * 处理窗口关闭事件
 */
function handleWindowClose(event) {
  const closeAction = store.get('closeAction', 'ask');
  
  // 如果应用正在退出，允许关闭
  if (isQuitting) {
    return;
  }
  
  // 根据关闭行为处理
  if (closeAction === 'minimize') {
    event.preventDefault();
    this.hide();
  } else if (closeAction === 'ask') {
    event.preventDefault();
    dialog.showMessageBox(this, {
      type: 'question',
      buttons: [
        i18n.t('dialog.closeConfirm.minimize'),
        i18n.t('dialog.closeConfirm.exit'),
        i18n.t('dialog.closeConfirm.cancel')
      ],
      defaultId: 0,
      title: i18n.t('dialog.closeConfirm.title'),
      message: i18n.t('dialog.closeConfirm.message'),
      cancelId: 2
    }).then(({ response }) => {
      if (response === 0) {
        this.hide();
      } else if (response === 1) {
        isQuitting = true;
        app.quit();
      }
    });
  }
}

/**
 * 设置退出状态
 */
function setQuitting(value) {
  isQuitting = value;
}

module.exports = {
  handleWindowClose,
  setQuitting
}; 