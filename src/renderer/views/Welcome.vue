<template>
  <div class="welcome-container">
    <div class="welcome-card">
      <img src="/assets/icon.png" alt="Electron AudioStation Logo" class="logo">
      <h1>{{ $t('welcome.title') }}</h1>
      <p>{{ $t('welcome.message') }}</p>
      <button class="primary-button" @click="openSettings">
        {{ $t('welcome.openSettings') }}
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'WelcomePage',
  
  setup() {
    const router = useRouter()
    
    const openSettings = () => {
      router.push('/settings')
    }
    
    return {
      openSettings
    }
  }
})
</script>

<style scoped>
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
}

.welcome-card {
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.logo {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

h1 {
  margin-top: 0;
  font-size: 24px;
  color: var(--text-color);
}

p {
  margin-bottom: 20px;
  line-height: 1.5;
  color: var(--text-color);
}

.primary-button {
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-button:hover {
  opacity: 0.9;
}
</style> 