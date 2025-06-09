<template>
  <div class="container">
    <router-view></router-view>
    <TabBar v-if="showTabBar"></TabBar>
  </div>
</template>

<script setup>
import TabBar from './components/TabBar.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

// 判断当前路由是否需要显示TabBar
const showTabBar = computed(() => {
  // 需要隐藏TabBar的页面路径
  const hideTabBarPages = [
    '/pages/avatar/clone',
    '/pages/login',
    '/pages/login/index',
    '/pages/register',
    '/pages/register/index',
    '/pages/video/synthesis',
    '/pages/market/index',
    '/pages/ai-writing/index',
    '/pages/voice/upload'
  ]
  
  return !hideTabBarPages.includes(route.path)
})

// 处理URL查询参数，尤其是邀请码
onMounted(() => {
  // 获取URL中的查询参数
  const urlParams = new URLSearchParams(window.location.search)
  const inviteCode = urlParams.get('inviteCode')
  
  // 如果存在邀请码参数
  if (inviteCode) {
    console.log('检测到邀请码:', inviteCode)
    
    // 如果用户未登录，则跳转到注册页面，并传递邀请码
    const token = localStorage.getItem('token')
    if (!token) {
      // 保存邀请码到本地存储，以便在注册过程中使用
      localStorage.setItem('inviteCode', inviteCode)
      // 跳转到注册页面
      router.push('/pages/register/index')
    }
  }
})
</script>

<style>
/* 全局样式 */
page {
  font-family: 'PingFang SC', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  color: #fff;
  font-size: 14px;
  line-height: 1.5;
  background-color: #111827;
  height: 100%;
  width: 100%;
}

.container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #111827;
}

/* 隐藏滚动条但允许滚动 */
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}

/* 设置根元素背景色 */
#app {
  background-color: #111827;
}

/* 确保body和html也是深色背景 */
html, body {
  background-color: #111827;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style> 