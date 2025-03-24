import { createRouter, createWebHashHistory } from 'vue-router'
import Welcome from '../views/Welcome.vue'
import Settings from '../views/Settings.vue'
import AudioStation from '../views/AudioStation.vue'
import LogViewer from '../views/LogViewer.vue'

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/app',
    name: 'AudioStation',
    component: AudioStation
  },
  {
    path: '/logs',
    name: 'LogViewer',
    component: LogViewer
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router 