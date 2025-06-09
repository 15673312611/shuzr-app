import axios from 'axios'

// 获取API基础URL
const getBaseUrl = () => {
  // 优先使用Vite环境变量
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_APP_BASE_API || '/tms';
  }
  // 兼容Vue CLI环境变量
  if (typeof process !== 'undefined' && process.env) {
    return process.env.VUE_APP_BASE_API || '/tms';
  }
  // 默认值
  return '/tms';
};

// 创建需要登录的接口白名单
const whiteList = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/check'
]

// 授权秘钥，部署前需要替换为实际的授权秘钥
const LICENSE_KEY = 'YOUR_PRODUCTION_SECRET_KEY';

// 创建一个安全的 uni 访问方法
const getUni = () => {
  if (typeof window !== 'undefined' && window.uni) {
    return window.uni;
  }
  
  // 如果 uni 不存在，提供一个模拟实现
  return {
    getStorageSync: (key) => {
      return localStorage.getItem(key);
    },
    setStorageSync: (key, value) => {
      localStorage.setItem(key, value);
    },
    removeStorageSync: (key) => {
      localStorage.removeItem(key);
    },
    showToast: (options) => {
      console.log('Toast:', options.title);
    },
    reLaunch: (options) => {
      console.log('Relaunch to:', options.url);
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = options.url;
      }
    },
    navigateTo: (options) => {
      console.log('Navigate to:', options.url);
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = options.url;
      }
    }
  };
};

const service = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
  withCredentials: true
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const { url, method } = config
    console.log(`[Request] ${method?.toUpperCase()} ${url}`)
    
    // 检查是否是白名单接口
    const isWhitelisted = whiteList.some(path => url?.includes(path))
    
    // 从storage获取token
    const uni = getUni();
    const token = uni.getStorageSync('token')
    
    // 添加授权秘钥头部
    config.headers['X-License-Key'] = LICENSE_KEY;
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
      console.log('Token added to request headers:', token)
      return config
    }
    
    // 如果没有token且不在白名单中，跳转到登录页
    if (!isWhitelisted) {
      console.log('Request requires authentication')
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      })
      
      // 延迟导航以确保Toast显示
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/login/index'
        })
      }, 1500)
      
      return Promise.reject(new Error('请先登录'))
    }
    
    return config
  },
  error => {
    console.error('[Request Error]', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const uni = getUni();
    const { status, config: { url }, data } = response
    console.log(`[Response] ${status} ${url}`, data)
    
    // 如果响应中包含新的token，更新本地存储
    if (data?.token) {
      try {
        uni.setStorageSync('token', data.token)
        console.log('Token updated from response data')
      } catch (error) {
        console.error('Error updating token:', error)
      }
    }
    
    // 如果响应码为403且包含授权相关信息，显示授权错误信息
    if (status === 403 && data && data.message && data.message.includes('授权验证失败')) {
      console.error('授权验证失败，请联系管理员获取有效的授权');
      uni.showToast({
        title: '授权验证失败，请联系管理员',
        icon: 'none',
        duration: 3000
      })
    }
    
    // 处理标准API响应格式
    if (data.code !== undefined) {
      if (data.code !== 0) {
        uni.showToast({
          title: data.message || '请求失败',
          icon: 'none'
        })
        
        // token过期
        if (data.code === 401) {
          uni.removeStorageSync('token')
          uni.reLaunch({
            url: '/pages/login/index'
          })
        }
        return Promise.reject(new Error(data.message || '请求失败'))
      }
      return data.data
    }
    
    return data
  },
  error => {
    const uni = getUni();
    console.error('[Response Error]', error)
    
    const status = error.response?.status
    const message = error.response?.data?.message || '请求失败，请重试'
    
    // 如果是授权错误
    if (status === 403 && error.response && error.response.data && error.response.data.message && 
        error.response.data.message.includes('授权验证失败')) {
      console.error('授权验证失败，请联系管理员获取有效的授权');
      uni.showToast({
        title: '授权验证失败，请联系管理员',
        icon: 'none',
        duration: 3000
      })
    }
    
    // 处理401和403状态码
    if (status === 401 || status === 403) {
      console.log(`Received ${status} response, handling auth error`)
      uni.removeStorageSync('token')
      uni.navigateTo({
        url: '/pages/login/index'
      })
      return Promise.reject(new Error(message))
    }
    
    // 其他错误
    console.error(`Error ${status}:`, message)
    uni.showToast({
      title: message || '请求失败',
      icon: 'none'
    })
    return Promise.reject(new Error(message))
  }
)

export default service 