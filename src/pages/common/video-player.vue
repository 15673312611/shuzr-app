<template>
  <view class="video-player-container">
    <!-- 返回按钮 -->
    <view class="back-button" @click="goBack">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
    </view>
    
    <!-- 视频标题 -->
    <view class="video-title">{{ title }}</view>
    
    <!-- 视频播放器 -->
    <view class="video-wrapper">
      <video
        :src="videoUrl"
        controls
        autoplay
        class="video-element"
        @error="handleVideoError"
      ></video>
    </view>
    
    <!-- 视频合成按钮 -->
    <view class="action-buttons">
      <view class="generate-button" @click="generateVideo">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
        </svg>
        <text>视频合成</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const videoUrl = ref('')
const title = ref('数字人视频')
const avatarId = ref(null)

onMounted(() => {
  // 获取URL参数
  if (route.query.url) {
    videoUrl.value = decodeURIComponent(route.query.url)
  }
  
  if (route.query.title) {
    title.value = decodeURIComponent(route.query.title)
  }
  
  if (route.query.id) {
    avatarId.value = route.query.id
  }
})

const goBack = () => {
  router.go(-1)
}

const handleVideoError = (e) => {
  console.error('视频播放错误:', e)
  uni.showToast({
    title: '视频加载失败',
    icon: 'none'
  })
}

const generateVideo = () => {
  if (!avatarId.value) {
    uni.showToast({
      title: '无法获取数字人ID',
      icon: 'none'
    })
    return
  }
  
  // 跳转到视频合成页面
  router.push({
    path: '/pages/avatar/use',
    query: { id: avatarId.value }
  })
}
</script>

<style lang="scss" scoped>
.video-player-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  cursor: pointer;
  
  svg {
    fill: #fff;
  }
}

.video-title {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  padding: 20px;
  text-align: center;
}

.video-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

.video-element {
  width: 100%;
  max-width: 100%;
  max-height: 70vh;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.action-buttons {
  display: flex;
  justify-content: center;
  padding: 20px 0 40px;
  
  .generate-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #10b981, #0ea5e9);
    color: white;
    padding: 12px 30px;
    border-radius: 30px;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
    transition: all 0.3s ease;
    
    &:active {
      transform: translateY(2px);
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
    }
    
    svg {
      margin-right: 8px;
    }
    
    text {
      font-size: 16px;
    }
  }
}
</style> 