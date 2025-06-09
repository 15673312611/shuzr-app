// uview-ui 包装器，处理 Vue 3 兼容性问题
import uviewUI from 'uview-ui'
import { getCurrentInstance } from 'vue'

// 获取 uView 的 $u 对象
let $u = null
if (typeof window !== 'undefined' && window.uni && window.uni.$u) {
  $u = window.uni.$u
}

export default {
  install(app) {
    // 创建 Vue 3 兼容的过滤器
    app.config.globalProperties.$filters = {
      timeFormat: (timestamp, format) => {
        if ($u && $u.timeFormat) {
          return $u.timeFormat(timestamp, format)
        }
        // 简单的时间格式化实现
        const date = new Date(timestamp)
        return format.replace('YYYY', date.getFullYear())
          .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
          .replace('DD', String(date.getDate()).padStart(2, '0'))
          .replace('HH', String(date.getHours()).padStart(2, '0'))
          .replace('mm', String(date.getMinutes()).padStart(2, '0'))
          .replace('ss', String(date.getSeconds()).padStart(2, '0'))
      },
      date: (timestamp, format) => {
        if ($u && $u.timeFormat) {
          return $u.timeFormat(timestamp, format)
        }
        const date = new Date(timestamp)
        return format.replace('YYYY', date.getFullYear())
          .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
          .replace('DD', String(date.getDate()).padStart(2, '0'))
      },
      timeFrom: (timestamp, format) => {
        if ($u && $u.timeFrom) {
          return $u.timeFrom(timestamp, format)
        }
        return '刚刚'
      }
    }
    
    // 自定义 install 方法，替代 uview-ui 的原始 install
    const customInstall = (app) => {
      // 将 $u 挂载到 Vue 实例上
      app.config.globalProperties.$u = $u || {}
      
      // 注册 uview-ui 组件
      const components = uviewUI.component
      if (components) {
        Object.keys(components).forEach(name => {
          app.component(name, components[name])
        })
      }
    }
    
    // 执行自定义安装
    customInstall(app)
  }
} 