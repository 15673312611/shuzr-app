import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: to => {
      // 检查是否已登录
      const token = localStorage.getItem('token')
      return token ? '/pages/index/index' : '/pages/login/index'
    }
  },
  {
    path: '/pages/login/index',
    component: () => import('./pages/login/index.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/pages/register/index',
    component: () => import('./pages/register/index.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/pages/index/index',
    component: () => import('./pages/index/index.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/pages/asset/index',
    component: () => import('./pages/asset/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/works/index',
    component: () => import('./pages/works/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/my/index',
    component: () => import('./pages/my/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/avatar/index',
    component: () => import('./pages/avatar/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/avatar/create',
    component: () => import('./pages/avatar/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/avatar/detail',
    component: () => import('./pages/avatar/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/avatar/edit',
    component: () => import('./pages/avatar/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/avatar/clone',
    component: () => import('./pages/avatar/clone.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/avatar/upload',
    component: () => import('./pages/avatar/upload.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/avatar/use',
    component: () => import('./pages/avatar/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/voice/index',
    component: () => import('./pages/voice/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/voice/create',
    component: () => import('./pages/voice/upload.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/voice/edit',
    component: () => import('./pages/voice/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/voice/upload',
    component: () => import('./pages/voice/upload.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/voice/use',
    component: () => import('./pages/voice/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/market/index',
    component: () => import('./pages/market/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/market/detail',
    component: () => import('./pages/market/detail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/ai-writing/index',
    component: () => import('./pages/ai-writing/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/video/synthesis',
    component: () => import('./pages/video/synthesis.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/video-packaging/index',
    component: () => import('./pages/video-packaging/index.vue'),
    meta: { requiresAuth: false }  // 暂时设为不需要认证，方便测试
  },
  {
    path: '/pages/my/about',
    component: () => import('./pages/my/about.vue'),
    meta: { requiresAuth: false }  // 关于我们页面不需要认证
  },
  {
    path: '/pages/my/tutorial',
    component: () => import('./pages/my/tutorial.vue'),
    meta: { requiresAuth: false }  // 新手教程页面不需要认证
  },
  {
    path: '/pages/my/invite',
    component: () => import('./pages/my/invite.vue'),
    meta: { requiresAuth: true }  // 邀请有礼页面需要认证
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  console.log('路由跳转:', from.path, '->', to.path, '是否需要认证:', to.meta.requiresAuth)
  
  // 检查页面是否需要认证
  if (to.meta.requiresAuth !== false) {
    // 获取token
    const token = localStorage.getItem('token')
    
    if (!token) {
      console.log('未登录，重定向到登录页面')
      
      // 显示提示信息
      if (typeof uni !== 'undefined') {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 1500
        })
      }
      
      // 记住用户想要访问的页面
      localStorage.setItem('redirectUrl', to.fullPath)
      
      // 跳转到登录页
      next('/pages/login/index')
      return
    }
  }
  
  // 如果是登录页面且已经登录，则跳转到首页
  if ((to.path === '/pages/login/index' || to.path === '/pages/register/index') && localStorage.getItem('token')) {
    next('/pages/index/index')
    return
  }
  
  next()
})

export default router 