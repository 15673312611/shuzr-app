<template>
  <view class="tab-bar-wrapper">
    <view class="tab-bar">
      <view 
        v-for="(item, index) in tabList.slice(0, 2)" 
        :key="index" 
        class="tab-item" 
        :class="{ active: currentPath === item.pagePath }"
        @click="switchTab(item.pagePath)"
      >
        <view class="icon-box">
          <view class="tab-icon">
            <template v-if="item.icon === 'home'">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="currentPath === item.pagePath ? '#35c8a9' : '#8A8F98'" width="24" height="24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/>
              </svg>
            </template>
            <template v-else-if="item.icon === 'asset'">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="currentPath === item.pagePath ? '#35c8a9' : '#8A8F98'" width="24" height="24">
                <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
              </svg>
            </template>
          </view>
        </view>
        <text class="tab-text" :class="{ active: currentPath === item.pagePath }">{{ item.text }}</text>
      </view>

      <!-- 中间的加号按钮 -->
      <view class="tab-item tab-item-center" @click="goToAvatarClone">
        <view class="plus-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF" width="24" height="24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </view>
      </view>

      <view 
        v-for="(item, index) in tabList.slice(2)" 
        :key="index + 2" 
        class="tab-item" 
        :class="{ active: currentPath === item.pagePath }"
        @click="switchTab(item.pagePath)"
      >
        <view class="icon-box">
          <view class="tab-icon">
            <template v-if="item.icon === 'works'">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="currentPath === item.pagePath ? '#35c8a9' : '#8A8F98'" width="24" height="24">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
              </svg>
            </template>
            <template v-else-if="item.icon === 'my'">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="currentPath === item.pagePath ? '#35c8a9' : '#8A8F98'" width="24" height="24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </template>
          </view>
        </view>
        <text class="tab-text" :class="{ active: currentPath === item.pagePath }">{{ item.text }}</text>
      </view>
    </view>
    
    <!-- 创建选项菜单 -->
    <view class="create-menu-overlay" v-if="showMenu" @click="hideCreateMenu">
      <view class="create-menu" @click.stop>
        <view class="menu-title">选择创建类型</view>
        <view class="menu-options">
          <view class="menu-item" @click="goToAvatarClone">
            <view class="menu-icon avatar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </view>
            <view class="menu-text">
              <text class="menu-item-title">形象克隆</text>
              <text class="menu-item-desc">上传视频克隆您的形象</text>
            </view>
            <view class="menu-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </view>
          </view>
          
          <view class="menu-divider"></view>
          
          <view class="menu-item" @click="goToVideoSynthesis">
            <view class="menu-icon video-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            </view>
            <view class="menu-text">
              <text class="menu-item-title">视频合成</text>
              <text class="menu-item-desc">输入文本合成说话视频</text>
            </view>
            <view class="menu-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </view>
          </view>
        </view>
        <view class="menu-cancel" @click="hideCreateMenu">取消</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const currentPath = ref('')
const showMenu = ref(false)

const tabList = [
  {
    pagePath: '/pages/index/index',
    icon: 'home',
    text: '首页'
  },
  {
    pagePath: '/pages/asset/index',
    icon: 'asset',
    text: '资产'
  },
  {
    pagePath: '/pages/works/index',
    icon: 'works',
    text: '作品'
  },
  {
    pagePath: '/pages/my/index',
    icon: 'my',
    text: '我的'
  }
]

const switchTab = (path) => {
  if (currentPath.value !== path) {
    router.push(path)
  }
}

// 显示创建菜单
const showCreateMenu = () => {
  showMenu.value = true
}

// 隐藏创建菜单
const hideCreateMenu = () => {
  showMenu.value = false
}

// 跳转到形象克隆页面
const goToAvatarClone = () => {
  router.push('/pages/avatar/clone')
}

// 跳转到视频合成页面
const goToVideoSynthesis = () => {
  hideCreateMenu()
  router.push('/pages/video/synthesis?fromHome=true')
}

const updateCurrentPath = () => {
  // 获取当前路由路径
  const path = route.path
  
  // 查找匹配的标签页
  const matchedTab = tabList.find(tab => tab.pagePath === path)
  
  if (matchedTab) {
    currentPath.value = matchedTab.pagePath
  } else {
    // 如果没有精确匹配，检查是否为子路径
    const parentPath = tabList.find(tab => path.startsWith(tab.pagePath))
    if (parentPath) {
      currentPath.value = parentPath.pagePath
    }
  }
}

watch(() => route.path, () => {
  updateCurrentPath()
})

onMounted(() => {
  updateCurrentPath()
})
</script>

<style lang="scss" scoped>
.tab-bar-wrapper {
  width: 100%;
  height: calc(56px + env(safe-area-inset-bottom, 0px));
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: #111827;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.3);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.tab-bar {
  display: flex;
  height: 56px;
  width: 100%;
  justify-content: space-around;
  align-items: center;
}

.tab-item {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &.active {
    .tab-icon {
      transform: translateY(-3px);
      transition: transform 0.3s ease;
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      width: 20px;
      height: 3px;
      background: linear-gradient(90deg, #35c8a9, #2fa8e0);
      border-radius: 3px 3px 0 0;
    }
  }
}

.tab-item-center {
  position: relative;
  transform: translateY(-14px);
  
  &::after {
    display: none;
  }
}

.plus-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #35c8a9, #2fa8e0);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(53, 200, 169, 0.3);
  transition: transform 0.2s ease;
  
  &:active {
    transform: scale(0.9);
  }
  
  svg {
    width: 28px;
    height: 28px;
  }
}

.icon-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4px;
}

.tab-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  transition: all 0.3s ease;
}

.tab-text {
  font-size: 12px;
  color: #8A8F98;
  transition: color 0.3s ease;
  
  &.active {
    color: #35c8a9;
    font-weight: 500;
  }
}

/* 创建选项菜单 */
.create-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  animation: fade-in 0.2s ease;
}

.create-menu {
  width: 100%;
  background-color: #1c2536;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  animation: slide-up 0.3s ease;
  transform: translateZ(0);
}

.menu-title {
  padding: 16px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-options {
  padding: 8px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  position: relative;
  
  &:active {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

.menu-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 0 16px;
}

.menu-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  
  svg {
    width: 24px;
    height: 24px;
  }
  
  &.avatar-icon {
    background: rgba(111, 76, 255, 0.15);
    
    svg {
      fill: #6f4cff;
    }
  }
  
  &.video-icon {
    background: rgba(53, 200, 169, 0.15);
    
    svg {
      fill: #35c8a9;
    }
  }
}

.menu-text {
  flex: 1;
}

.menu-item-title {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 4px;
}

.menu-item-desc {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.menu-arrow {
  width: 20px;
  height: 20px;
  
  svg {
    fill: rgba(255, 255, 255, 0.5);
  }
}

.menu-cancel {
  padding: 16px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #35c8a9;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 8px;
  
  &:active {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style> 