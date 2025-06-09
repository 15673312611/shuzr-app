// 首先定义 uni 对象
window.uni = {
  getStorageSync: (key) => {
    return localStorage.getItem(key)
  },
  setStorageSync: (key, value) => {
    localStorage.setItem(key, value)
  },
  removeStorageSync: (key) => {
    localStorage.removeItem(key)
  },
  showToast: (options) => {
    console.log('Toast:', options.title)
    const toast = document.createElement('div')
    toast.style.position = 'fixed'
    toast.style.top = '50%'
    toast.style.left = '50%'
    toast.style.transform = 'translate(-50%, -50%)'
    toast.style.padding = '10px 20px'
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
    toast.style.color = '#fff'
    toast.style.borderRadius = '5px'
    toast.style.zIndex = '9999'
    toast.textContent = options.title
    document.body.appendChild(toast)
    setTimeout(() => {
      document.body.removeChild(toast)
      if (options.success) options.success()
    }, options.duration || 1500)
  },
  navigateTo: (options) => {
    console.log('Navigate to:', options.url)
    const router = window.router
    if (router) {
      router.push(options.url.replace(/^\//, ''))
      if (options.success) options.success()
    }
  },
  navigateBack: (options = {}) => {
    console.log('Navigate back')
    const router = window.router
    if (router) {
      router.back()
      if (options.success) options.success()
    }
  },
  reLaunch: (options) => {
    console.log('Relaunch to:', options.url)
    window.location.href = options.url
    if (options.success) options.success()
  }
}

import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router.js'
import uViewAdapter from './plugins/uview-adapter'
// 使用我们的自定义包装器代替直接导入 uview-ui
import uViewWrapper from './plugins/uview-wrapper'

// 保存 router 到全局，以便 uni.navigateTo 使用
window.router = router

const app = createSSRApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
// 先使用适配器
app.use(uViewAdapter)
// 然后使用我们的包装器代替 uView
app.use(uViewWrapper)

app.mount('#app') 