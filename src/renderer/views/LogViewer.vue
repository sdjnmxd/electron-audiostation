<template>
  <div class="log-viewer-container">
    <div class="log-viewer-header">
      <h1>{{ $t('logViewer.title') }}</h1>
      <div class="log-actions">
        <button class="secondary-button" @click="refreshLog">
          {{ $t('logViewer.refresh') }}
        </button>
        <button class="secondary-button" @click="clearLog">
          {{ $t('logViewer.clear') }}
        </button>
        <button class="secondary-button" @click="copyLog">
          {{ $t('logViewer.copy') }}
        </button>
      </div>
    </div>
    
    <div class="error-container" v-if="error">
      {{ error }}
    </div>
    
    <pre class="log-content" v-else>{{ logContent }}</pre>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'LogViewer',
  
  setup() {
    const logContent = ref('');
    const error = ref('');
    
    // 加载日志内容
    const loadLog = async () => {
      try {
        const content = await window.electronAPI.readLog();
        logContent.value = content;
        error.value = '';
      } catch (err) {
        error.value = err.message || 'Failed to load log';
        logContent.value = '';
      }
    };
    
    // 刷新日志
    const refreshLog = () => {
      loadLog();
    };
    
    // 清除日志
    const clearLog = async () => {
      try {
        await window.electronAPI.clearLog();
        loadLog();
      } catch (err) {
        error.value = err.message || 'Failed to clear log';
      }
    };
    
    // 复制日志到剪贴板
    const copyLog = () => {
      if (logContent.value) {
        navigator.clipboard.writeText(logContent.value)
          .then(() => {
            // 可以添加一个临时提示
            const originalContent = logContent.value;
            logContent.value = '日志已复制到剪贴板';
            setTimeout(() => {
              logContent.value = originalContent;
            }, 1000);
          })
          .catch(err => {
            error.value = err.message || 'Failed to copy log';
          });
      }
    };
    
    // 组件挂载时加载日志
    onMounted(() => {
      loadLog();
    });
    
    return {
      logContent,
      error,
      refreshLog,
      clearLog,
      copyLog
    };
  }
});
</script>

<style scoped>
.log-viewer-container {
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
}

.log-viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
  color: var(--text-color);
}

.log-actions {
  display: flex;
  gap: 10px;
}

.error-container {
  padding: 15px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-bottom: 20px;
}

.log-content {
  flex: 1;
  overflow: auto;
  background-color: var(--card-background);
  color: var(--text-color);
  padding: 15px;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
  font-size: 12px;
  line-height: 1.5;
  border: 1px solid var(--border-color);
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.secondary-button {
  background-color: var(--secondary-color);
  color: white;
}

.secondary-button:hover {
  opacity: 0.9;
}
</style> 