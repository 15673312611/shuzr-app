// uview-ui 适配器
import { getCurrentInstance } from 'vue'

export default {
  install(app) {
    // 模拟 uView 所需的环境
    if (typeof window !== 'undefined') {
      // 确保 uni 对象存在
      if (!window.uni) {
        window.uni = {
          getStorageSync: (key) => localStorage.getItem(key),
          setStorageSync: (key, value) => localStorage.setItem(key, value),
          removeStorageSync: (key) => localStorage.removeItem(key),
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
            if (window.router) {
              window.router.push(options.url.replace(/^\//, ''))
              if (options.success) options.success()
            }
          },
          navigateBack: (options = {}) => {
            console.log('Navigate back')
            if (window.router) {
              window.router.back()
              if (options.success) options.success()
            }
          },
          reLaunch: (options) => {
            console.log('Relaunch to:', options.url)
            window.location.href = options.url
            if (options.success) options.success()
          }
        }
      }

      // 添加 $u 对象
      if (!window.uni.$u) {
        window.uni.$u = {
          // 基本工具函数
          timeFormat: (timestamp, format) => {
            const date = new Date(timestamp)
            return format.replace('YYYY', date.getFullYear())
              .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
              .replace('DD', String(date.getDate()).padStart(2, '0'))
              .replace('HH', String(date.getHours()).padStart(2, '0'))
              .replace('mm', String(date.getMinutes()).padStart(2, '0'))
              .replace('ss', String(date.getSeconds()).padStart(2, '0'))
          },
          // 其他必要的 $u 方法
          type: ['primary', 'success', 'error', 'warning', 'info'],
          http: {
            get: (url, params) => fetch(url + new URLSearchParams(params)).then(res => res.json()),
            post: (url, data) => fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            }).then(res => res.json())
          }
        }
      }
    }

    // 全局混入
    app.mixin({
      computed: {
        $u() {
          return window.uni?.$u || {}
        }
      }
    })
  }
} 