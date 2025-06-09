<template>
  <view class="page-container">
    <!-- 背景元素 -->
    <view class="bg-elements">
      <view class="bg-gradient"></view>
      <view class="bg-grid"></view>
      <view class="bg-circle circle1"></view>
      <view class="bg-circle circle2"></view>
    </view>
    
    <!-- 页面内容 -->
    <view class="content-wrapper">
      <!-- 标签页导航 -->
      <view class="tab-navigation">
        <view 
          class="tab-item" 
          :class="{ 'active': activeTab === 'avatar' }"
          @click="switchTab('avatar')"
        >
          <text>我的数字人</text>
          <view class="tab-indicator" v-if="activeTab === 'avatar'"></view>
        </view>
        <view 
          class="tab-item" 
          :class="{ 'active': activeTab === 'voice' }"
          @click="switchTab('voice')"
        >
          <text>声音克隆</text>
          <view class="tab-indicator" v-if="activeTab === 'voice'"></view>
        </view>
      </view>
      
      <!-- 新建按钮 -->
      <view class="create-button-container">
        <view class="create-button" @click="createNew(activeTab)">
          <view class="button-inner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <text>创建{{ activeTab === 'avatar' ? '数字人' : '声音' }}</text>
          </view>
        </view>
      </view>
      
      <!-- 数字人资产 -->
      <view class="tab-content" v-if="activeTab === 'avatar'">
        <view class="assets-grid">
          <view 
            class="asset-card" 
            v-for="(item, index) in digitalHumans" 
            :key="item.id"
          >
            <view class="card-inner">
              <!-- 数字人预览 -->
              <view class="asset-preview" @click="openVideoModal(item)">
                <img 
                  :src="item.coverUrl || item.previewUrl || '/static/images/avatar-placeholder.png'" 
                  mode="aspectFill" 
                  class="preview-image"
                />
                <view class="preview-glow"></view>
              </view>
              
              <!-- 资产信息 -->
              <view class="asset-info">
                <text class="asset-name">{{ item.name }}</text>
                <view class="generate-btn" @click.stop="goToClone(item)">
                  <text>立即合成</text>
                </view>
              </view>
              
              <!-- 操作菜单 -->
              <view class="action-menu" @click.stop="showDeleteMenu(item.id, 'avatar')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </view>
            </view>
          </view>
          
          <!-- 空状态提示 -->
          <view class="empty-state" v-if="digitalHumans.length === 0 && !loading">
            <view class="empty-illustration">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="80" height="80">
                <defs>
                  <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#43B5FF" />
                    <stop offset="100%" stop-color="#10B981" />
                  </linearGradient>
                </defs>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="url(#avatarGradient)"/>
              </svg>
              <view class="empty-glow"></view>
            </view>
            <text class="empty-message">期待您的第一个数字人</text>
            <text class="empty-hint" @click="createDigitalHuman">点击上方按钮开始创建</text>
          </view>
          
          <!-- 加载状态 -->
          <view class="loading-state" v-if="loading">
            <view class="loading-spinner"></view>
            <text>加载中...</text>
          </view>
        </view>
      </view>
      
      <!-- 声音资产 -->
      <view class="tab-content" v-if="activeTab === 'voice'">
        <view class="voice-list">
          <view 
            class="voice-card" 
            v-for="(voice, index) in voices" 
            :key="voice.id"
          >
            <view class="card-inner">
              <!-- 左侧播放按钮 -->
              <view class="play-button" @click.stop="playVoice(voice)">
                <svg v-if="currentPlayingId !== voice.id" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              </view>
              
              <!-- 中间信息区 -->
              <view class="voice-info">
                <text class="voice-name">{{ voice.name }}</text>
                <view class="voice-meta">
                  <text class="voice-duration">{{ formatDuration(voice.durationSeconds) }}</text>
                </view>
              </view>
              
              <!-- 操作菜单 -->
              <view class="action-menu" @click.stop="showDeleteMenu(voice.id, 'voice')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </view>
            </view>
            <view class="card-glow"></view>
          </view>
          
          <!-- 空状态提示 -->
          <view class="empty-state" v-if="voices.length === 0 && !voiceLoading">
            <view class="empty-illustration">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="80" height="80">
                <defs>
                  <linearGradient id="voiceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6F4CFF" />
                    <stop offset="100%" stop-color="#2F70ED" />
                  </linearGradient>
                </defs>
                <path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm-1.2-9.1c0-.66.54-1.2 1.2-1.2s1.2.54 1.2 1.2l-.01 6.2c0 .66-.53 1.2-1.19 1.2s-1.2-.54-1.2-1.2V5.9zm6.5 6.1c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.41 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" fill="url(#voiceGradient)"/>
              </svg>
              <view class="empty-glow"></view>
            </view>
            <text class="empty-message">尚未创建声音克隆</text>
            <text class="empty-hint" @click="createVoice">点击上方按钮开始创建</text>
          </view>
          
          <!-- 加载状态 -->
          <view class="loading-state" v-if="voiceLoading">
            <view class="loading-spinner"></view>
            <text>加载中...</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 视频播放弹窗 -->
    <div class="video-modal" v-show="showVideoModal" @click="closeVideoModal">
      <div class="video-modal-content" @click.stop>
        <div class="video-modal-header">
          <div class="video-title">{{ currentVideo?.name || '视频预览' }}</div>
          <div class="close-button" @click="closeVideoModal">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </div>
        </div>
        <div class="video-container">
          <video 
            id="videoPlayer"
            controls 
            autoplay
            class="video-player"
            @error="handleVideoError"
          ></video>
        </div>
        <div class="video-modal-footer">
          <div class="generate-button" @click="goToClone(currentVideo)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <div>立即合成</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部操作菜单 -->
    <view class="action-sheet" v-if="showActionSheet" @click.self="hideActionSheet">
      <view class="action-sheet-content">
        <view class="action-sheet-item delete" @click="confirmDelete">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
          <text>删除</text>
        </view>
        <view class="action-sheet-item cancel" @click="hideActionSheet">
          <text>取消</text>
        </view>
      </view>
    </view>
    
    <!-- 加载和提示 -->
    <view class="toast-wrapper" v-if="showToast">
      <view class="toast">{{ toastMessage }}</view>
    </view>
    
    <view class="loading-overlay" v-if="isLoading">
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <text>删除中...</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { avatarApi, voiceApi } from '../../api/services'

const router = useRouter()
const route = useRoute()
const activeTab = ref('avatar')
const currentPlayingId = ref(null)
const audioElement = ref(null)
const loading = ref(false)
const voiceLoading = ref(false)

// 数字人和声音列表
const digitalHumans = ref([])
const voices = ref([])

// 底部操作菜单状态
const showActionSheet = ref(false)
const currentItemId = ref(null)
const currentItemType = ref(null)

// 提示和加载状态
const showToast = ref(false)
const toastMessage = ref('')
const isLoading = ref(false)

// 视频播放弹窗
const showVideoModal = ref(false)
const currentVideo = ref(null)

// 获取数字人列表
const fetchDigitalHumans = async () => {
  loading.value = true
  try {
    const response = await avatarApi.getMyList()
    console.log('数字人列表API返回数据:', response)
    
    // 处理返回数据格式，兼容数组和对象
    if (response) {
      if (Array.isArray(response)) {
        digitalHumans.value = response.map(item => {
          // 确保每个项目都有videoUrl字段
          if (!item.videoUrl && item.id % 2 === 0) {
            item.videoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-a-lighted-path-in-a-dark-forest-4479-large.mp4'
          }
          return item
        })
      } else if (response.data && Array.isArray(response.data)) {
        digitalHumans.value = response.data.map(item => {
          // 确保每个项目都有videoUrl字段
          if (!item.videoUrl && item.id % 2 === 0) {
            item.videoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-a-lighted-path-in-a-dark-forest-4479-large.mp4'
          }
          return item
        })
      } else {
        digitalHumans.value = []
      }
    } else {
      digitalHumans.value = []
    }
    console.log('处理后的数字人列表:', digitalHumans.value)
  } catch (error) {
    console.error('获取数字人列表失败:', error)
    uni.showToast({
      title: '获取数字人列表失败',
      icon: 'none'
    })
    digitalHumans.value = []
  } finally {
    loading.value = false
  }
}

// 获取声音列表
const fetchVoices = async () => {
  voiceLoading.value = true
  try {
    const response = await voiceApi.getMyVoiceList()
    console.log('声音列表API返回数据:', response)
    
    // 处理返回数据格式，兼容数组和对象
    if (response) {
      if (Array.isArray(response)) {
        voices.value = response
      } else if (response.data && Array.isArray(response.data)) {
        voices.value = response.data
      } else {
        voices.value = []
      }
    } else {
      voices.value = []
    }
  } catch (error) {
    console.error('获取声音列表失败:', error)
    uni.showToast({
      title: '获取声音列表失败',
      icon: 'none'
    })
    voices.value = []
  } finally {
    voiceLoading.value = false
  }
}

// 切换标签页并加载相应数据
const switchTab = (tab) => {
  activeTab.value = tab
  
  // 更新URL参数，但不触发完整路由导航
  router.replace({
    path: route.path,
    query: { tab }
  }, () => {}, { shallow: true })
  
  if (tab === 'avatar') {
    fetchDigitalHumans()
  } else {
    fetchVoices()
  }
  // 切换标签页时停止播放
  stopAudioPlayback()
}

// 监听路由变化
watch(() => route.query.tab, (newTab) => {
  if (newTab && (newTab === 'avatar' || newTab === 'voice')) {
    activeTab.value = newTab
    if (newTab === 'avatar') {
      fetchDigitalHumans()
    } else {
      fetchVoices()
    }
  } else {
    // 如果没有tab参数或参数无效，默认加载avatar内容
    activeTab.value = 'avatar'
    fetchDigitalHumans()
  }
}, { immediate: true })

onMounted(() => {
  // 确保用户已登录
  ensureLogin()
  
  // 如果URL没有tab参数，添加默认参数
  if (!route.query.tab) {
    router.replace({
      path: route.path,
      query: { tab: 'avatar' }
    }, () => {}, { shallow: true })
  }
  
  // 添加favicon以防止404请求
  const favicon = document.createElement('link')
  favicon.rel = 'icon'
  favicon.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎬</text></svg>'
  document.head.appendChild(favicon)
  
  // 监听路由变化，停止音频播放
  router.beforeEach((to, from, next) => {
    stopAudioPlayback()
    next()
  })
})

onBeforeUnmount(() => {
  // 组件卸载前停止音频播放
  stopAudioPlayback()
})

// 停止音频播放的函数
const stopAudioPlayback = () => {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.currentTime = 0
    audioElement.value = null
  }
  currentPlayingId.value = null
}

// 确保用户已登录
const ensureLogin = () => {
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  
  if (!userId || !token) {
    console.log('用户未登录，设置默认userId=1')
    localStorage.setItem('userId', '1')
    localStorage.setItem('token', 'temp-token')
  }
}

// 创建新数字人
const createDigitalHuman = () => {
  router.push('/pages/avatar/upload')
}

// 创建新声音
const createVoice = () => {
  router.push('/pages/voice/upload')
}

// 打开视频弹窗
const openVideoModal = (item) => {
  console.log('打开视频弹窗:', item)
  if (item.videoUrl) {
    currentVideo.value = item
    showVideoModal.value = true
    
    // 设置视频源
    setTimeout(() => {
      const videoPlayer = document.getElementById('videoPlayer')
      if (videoPlayer) {
        // 先添加错误处理函数，然后再设置src
        videoPlayer.onerror = null  // 清除之前的错误处理
        videoPlayer.src = item.videoUrl
        videoPlayer.load()
        videoPlayer.play().catch(err => {
          console.error('视频播放失败:', err)
        })
      }
    }, 100)
  } else {
    // 如果没有视频，跳转到详情页
    router.push({
      path: '/pages/avatar/detail',
      query: { id: item.id }
    })
  }
}

// 关闭视频弹窗
const closeVideoModal = () => {
  try {
    const videoPlayer = document.getElementById('videoPlayer')
    if (videoPlayer) {
      // 先移除错误事件，防止关闭时触发错误
      videoPlayer.onerror = null
      videoPlayer.onabort = null
      videoPlayer.removeAttribute('src')
      videoPlayer.load()
      
      // 直接关闭弹窗，不设置新的视频源
      showVideoModal.value = false
    } else {
      showVideoModal.value = false
    }
  } catch (error) {
    console.error('关闭视频时出错:', error)
    showVideoModal.value = false
  }
}

// 使用声音
const useVoice = (voice) => {
  router.push({
    path: '/pages/voice/use',
    query: { id: voice.id, name: voice.name }
  })
}

// 播放声音
const playVoice = async (item) => {
  if (currentPlayingId.value === item.id && audioElement.value) {
    // 如果当前已经在播放这个声音，则停止播放
    audioElement.value.pause()
    audioElement.value.currentTime = 0
    currentPlayingId.value = null
    return
  }

  try {
    // 停止当前播放的声音
    if (audioElement.value) {
      audioElement.value.pause()
      audioElement.value.currentTime = 0
    }

    // 检查是否有voiceUrl
    if (!item.voiceUrl) {
      console.error('没有找到声音URL:', item);
      uni.showToast({
        title: '声音文件不可用',
        icon: 'none'
      });
      return;
    }

    console.log('正在播放声音:', item.voiceUrl);
    
    // 创建新的音频元素
    audioElement.value = new Audio(item.voiceUrl);
    currentPlayingId.value = item.id;
    
    // 播放声音
    await audioElement.value.play();
    
    // 播放完成后重置
    audioElement.value.onended = () => {
      currentPlayingId.value = null;
    };
    
    // 处理播放错误
    audioElement.value.onerror = (error) => {
      console.error('声音播放失败:', error);
      uni.showToast({
        title: '声音播放失败',
        icon: 'none'
      });
      currentPlayingId.value = null;
    };
  } catch (error) {
    console.error('播放声音失败:', error)
    uni.showToast({
      title: '播放声音失败',
      icon: 'none'
    })
    currentPlayingId.value = null
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 格式化时长
const formatDuration = (seconds) => {
  if (!seconds) return '00:00'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

// 创建新资产
const createNew = (type) => {
  if (type === 'avatar') {
    router.push('/pages/avatar/upload')
  } else {
    router.push('/pages/voice/create')
  }
}

// 显示底部删除菜单
const showDeleteMenu = (id, type) => {
  currentItemId.value = id
  currentItemType.value = type
  showActionSheet.value = true
}

// 隐藏底部菜单
const hideActionSheet = () => {
  showActionSheet.value = false
}

// 确认删除
const confirmDelete = async () => {
  hideActionSheet()
  isLoading.value = true
  
  try {
    if (currentItemType.value === 'avatar') {
      await avatarApi.deleteAvatar(currentItemId.value)
      fetchDigitalHumans()
    } else {
      await voiceApi.deleteVoice(currentItemId.value)
      fetchVoices()
    }
    
    isLoading.value = false
    toastMessage.value = '删除成功'
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 2000)
  } catch (error) {
    console.error(`删除${currentItemType.value === 'avatar' ? '数字人' : '声音'}失败:`, error)
    isLoading.value = false
    toastMessage.value = '删除失败'
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 2000)
  }
}

// 视频错误处理
const handleVideoError = (e) => {
  // 如果弹窗已关闭，不显示错误
  if (!showVideoModal.value) return
  
  console.error('视频加载失败:', e)
  uni.showToast({
    title: '视频加载失败',
    icon: 'none'
  })
}

// 跳转到一键分身页面
const goToClone = (item) => {
  if (!item) return
  
  router.push({
    path: '/pages/avatar/clone',
    query: { 
      videoUrl: item.videoUrl,
      avatarId: item.id,
      avatarName: item.name
    }
  })
}
</script>

<style lang="scss" scoped>
/* 页面容器 */
.page-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #111827;
  color: #fff;
  font-family: 'PingFang SC', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  overflow: hidden;
}

/* 背景元素 */
.bg-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  
  .bg-gradient {
    position: absolute;
    top: -20%;
    right: -10%;
    width: 80%;
    height: 70%;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(67, 181, 255, 0.06) 50%, transparent 70%);
    filter: blur(60px);
  }
  
  .bg-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(16, 185, 129, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(16, 185, 129, 0.04) 1px, transparent 1px);
    background-size: 26px 26px;
    opacity: 0.3;
  }
  
  .bg-circle {
    position: absolute;
    border-radius: 50%;
    
    &.circle1 {
      top: 10%;
      left: -10%;
      width: 40%;
      height: 40%;
      background: radial-gradient(circle, rgba(67, 181, 255, 0.06) 0%, transparent 70%);
      filter: blur(50px);
    }
    
    &.circle2 {
      bottom: -20%;
      right: -5%;
      width: 50%;
      height: 50%;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%);
      filter: blur(60px);
    }
  }
}

/* 内容区域 */
.content-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  padding: 20px 15px;
  padding-top: calc(20px + env(safe-area-inset-top, 0));
  padding-bottom: calc(80px + env(safe-area-inset-bottom, 0));
  max-width: 100%;
  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

/* 标签页导航 */
.tab-navigation {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  margin-top: 10px;
  
  .tab-item {
    flex: 1;
    text-align: center;
    padding: 12px 0;
    position: relative;
    
    text {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
      transition: color 0.3s ease;
    }
    
    &.active {
      text {
        color: #fff;
        font-weight: 600;
      }
    }
    
    .tab-indicator {
      position: absolute;
      bottom: 0;
      left: 25%;
      width: 50%;
      height: 3px;
      background: linear-gradient(to right, #6f4cff, #2f70ed);
      border-radius: 3px;
      transition: all 0.3s ease;
    }
  }
}

/* 新建按钮容器 */
.create-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

/* 创建按钮 */
.create-button {
  background: linear-gradient(135deg, #6f4cff, #2f70ed);
  border-radius: 12px;
  padding: 2px;
  box-shadow: 0 4px 12px rgba(111, 76, 255, 0.25);
  width: 80%;
  max-width: 300px;
  
  .button-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    
    svg {
      margin-right: 8px;
      fill: #fff;
    }
    
    text {
      color: #fff;
      font-size: 15px;
      font-weight: 500;
    }
  }
  
  &:active {
    opacity: 0.8;
  }
}

/* 资产网格 */
.assets-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin: 0 auto;
  max-width: 100%;
  padding: 0 5px;
  
  .asset-card {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    transition: all 0.3s ease;
    
    .card-inner {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      border-radius: 16px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      
      .asset-preview {
        width: 100%;
        aspect-ratio: 1;
        position: relative;
        overflow: hidden;
        
        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .preview-glow {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 30%;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
          z-index: 1;
        }
      }
      
      .asset-info {
        padding: 10px 12px;
        display: flex;
        flex-direction: column;
        
        .asset-name {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          margin-bottom: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .generate-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 0;
          width: 100%;
          background: linear-gradient(135deg, rgba(0, 255, 170, 0.9), rgba(0, 210, 255, 0.9));
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 255, 170, 0.3);
          transition: transform 0.2s ease, opacity 0.2s ease;
          
          text {
            font-size: 13px;
            font-weight: 600;
            color: #000;
          }
          
          &:active {
            transform: scale(0.95);
            opacity: 0.9;
          }
        }
      }
      
      .action-menu {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        backdrop-filter: blur(5px);
        opacity: 0.8;
        transition: all 0.25s ease;
        
        &:active {
          opacity: 1;
          transform: scale(0.95);
        }
      }
    }
  }
  
  .empty-state {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 50vh;
    
    .empty-illustration {
      position: relative;
      margin-bottom: 24px;
      display: flex;
      justify-content: center;
      
      svg {
        position: relative;
        z-index: 1;
        opacity: 0.9;
      }
      
      .empty-glow {
        position: absolute;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: rgba(67, 181, 255, 0.2);
        filter: blur(25px);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 0;
      }
    }
    
    .empty-message {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 10px;
      font-weight: 500;
      text-align: center;
      background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0.7));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .empty-hint {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
      text-align: center;
      line-height: 1.5;
      max-width: 240px;
      position: relative;
      
      &::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3) 50%, transparent);
      }
      
      &:active {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}

/* 声音列表 */
.voice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .voice-card {
    position: relative;
    
    .card-inner {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 14px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }
    
    .play-button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #43b5ff, #10b981);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 14px;
      box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);
      flex-shrink: 0;
      color: #fff;
      
      &:active {
        transform: scale(0.95);
        box-shadow: 0 2px 5px rgba(16, 185, 129, 0.2);
      }
    }
    
    .voice-info {
      flex: 1;
      min-width: 0;
      
      .voice-name {
        font-size: 15px;
        font-weight: 500;
        color: #fff;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .voice-meta {
        display: flex;
        align-items: center;
        
        .voice-duration {
          font-size: 11px;
          color: #43b5ff;
        }
      }
    }
    
    .action-menu {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.7);
      margin-left: 10px;
      
      &:active {
        background: rgba(255, 255, 255, 0.2);
      }
    }
    
    .card-glow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 12px;
      z-index: -1;
      background: linear-gradient(135deg, rgba(67, 181, 255, 0.3), rgba(16, 185, 129, 0.3));
      opacity: 0;
      filter: blur(12px);
      transition: opacity 0.3s ease;
    }
    
    &:hover, &:active {
      .card-glow {
        opacity: 0.6;
      }
    }
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 50vh;
    
    .empty-illustration {
      position: relative;
      margin-bottom: 24px;
      display: flex;
      justify-content: center;
      
      svg {
        position: relative;
        z-index: 1;
        opacity: 0.9;
      }
      
      .empty-glow {
        position: absolute;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: rgba(67, 181, 255, 0.2);
        filter: blur(25px);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 0;
      }
    }
    
    .empty-message {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 10px;
      font-weight: 500;
      text-align: center;
      background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0.7));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .empty-hint {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
      text-align: center;
      line-height: 1.5;
      max-width: 240px;
      position: relative;
      
      &::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3) 50%, transparent);
      }
      
      &:active {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}

@keyframes shine {
  0% {
    left: -100%;
  }
  20% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}

/* 视频播放弹窗 */
.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  
  .video-modal-content {
    width: 95%;
    max-height: 95vh;
    background: #111827;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    
    .video-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      .video-title {
        font-size: 18px;
        font-weight: 600;
        color: #fff;
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .close-button {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        
        svg {
          width: 24px;
          height: 24px;
          fill: #fff;
        }
        
        &:active {
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
    
    .video-container {
      width: 100%;
      margin-bottom: 16px;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      padding-top: 66.67%; /* 3:2 宽高比，更大的视频区域 */
      
      .video-player {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #000;
      }
    }
    
    .video-modal-footer {
      display: flex;
      justify-content: center;
      margin-top: 16px;
      
      .generate-button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 14px 28px; /* 增大按钮尺寸 */
        background: linear-gradient(135deg, #6f4cff, #2f70ed);
        border-radius: 30px;
        box-shadow: 0 4px 12px rgba(111, 76, 255, 0.25);
        color: #fff;
        font-size: 17px; /* 增大字体尺寸 */
        font-weight: 600;
        width: 85%;
        max-width: 280px;
        transition: all 0.3s ease;
        
        &:active {
          transform: translateY(2px);
          box-shadow: 0 2px 6px rgba(111, 76, 255, 0.2);
        }
        
        svg {
          margin-right: 8px;
          width: 22px; /* 增大图标尺寸 */
          height: 22px;
        }
      }
    }
  }
}

/* 底部操作菜单 */
.action-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  animation: fadeIn 0.2s ease;
}

.action-sheet-content {
  background-color: #1f2937;
  border-radius: 16px 16px 0 0;
  padding: 16px 16px calc(16px + env(safe-area-inset-bottom, 16px) + 60px);
  transform: translateY(0);
  animation: slideUp 0.3s ease;
  position: relative;
  z-index: 10001;
}

.action-sheet-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 10px;
  
  text {
    font-size: 16px;
    font-weight: 500;
  }
  
  svg {
    margin-right: 10px;
  }
  
  &.delete {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    
    svg {
      fill: #ef4444;
    }
  }
  
  &.cancel {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    margin-bottom: 0;
  }
  
  &:active {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

/* 提示和加载 */
.toast-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1100;
  
  .toast {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 14px;
    animation: fadeIn 0.2s ease;
  }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
  
  .loading-content {
    background: rgba(0, 0, 0, 0.7);
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(67, 181, 255, 0.1);
      border-top-color: rgba(67, 181, 255, 0.8);
      border-radius: 50%;
      margin-bottom: 10px;
      animation: spin 1s linear infinite;
    }
    
    text {
      color: #fff;
      font-size: 14px;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 添加设备适配的媒体查询 */
// 小屏幕设备适配 (iPhone SE 等)
@media screen and (max-width: 375px) {
  .content-wrapper {
    padding: 12px;
    padding-top: calc(12px + env(safe-area-inset-top, 0));
    padding-bottom: calc(60px + env(safe-area-inset-bottom, 0));
  }
  
  .tab-navigation {
    margin-bottom: 14px;
    
    .tab-item {
      font-size: 15px;
      padding: 10px 0;
    }
  }
  
  .create-button-container {
    margin-bottom: 16px;
    
    .create-button {
      height: 40px;
      
      .button-inner {
        font-size: 14px;
        
        svg {
          width: 16px;
          height: 16px;
          margin-right: 6px;
        }
      }
    }
  }
  
  .assets-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    
    .asset-card {
      .asset-preview {
        height: 120px;
      }
      
      .asset-info {
        padding: 8px;
        
        .asset-name {
          font-size: 13px;
          margin-bottom: 6px;
        }
        
        .generate-btn {
          height: 28px;
          font-size: 12px;
        }
      }
      
      .action-menu {
        width: 28px;
        height: 28px;
        top: 5px;
        right: 5px;
        
        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
  
  .voice-list {
    gap: 10px;
    
    .voice-card {
      .card-inner {
        padding: 10px;
      }
      
      .play-button {
        width: 36px;
        height: 36px;
        margin-right: 10px;
      }
      
      .voice-info {
        .voice-name {
          font-size: 14px;
        }
      }
      
      .action-menu {
        width: 28px;
        height: 28px;
      }
    }
  }
  
  .empty-state {
    .empty-message {
      font-size: 16px;
    }
    
    .empty-hint {
      font-size: 13px;
    }
  }
  
  .video-modal {
    .video-modal-content {
      padding: 12px;
      
      .video-modal-header {
        margin-bottom: 12px;
        
        .video-title {
          font-size: 16px;
        }
        
        .close-button {
          width: 32px;
          height: 32px;
        }
      }
    }
  }
}

// 中等屏幕设备适配 (iPhone X, 11, 12, 13 等)
@media screen and (min-width: 376px) and (max-width: 428px) {
  .content-wrapper {
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top, 0));
    padding-bottom: calc(70px + env(safe-area-inset-bottom, 0));
  }
  
  .assets-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    
    .asset-card {
      .asset-preview {
        height: 140px;
      }
    }
  }
}

// 大屏幕设备适配 (iPhone 14 Pro Max 等)
@media screen and (min-width: 429px) {
  .content-wrapper {
    max-width: 480px;
    margin: 0 auto;
  }
  
  .assets-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    
    .asset-card {
      .asset-preview {
        height: 160px;
      }
    }
  }
}
</style> 