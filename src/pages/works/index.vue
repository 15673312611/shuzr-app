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
          <text>视频</text>
          <view class="tab-indicator" v-if="activeTab === 'avatar'"></view>
        </view>
        <view 
          class="tab-item" 
          :class="{ 'active': activeTab === 'voice' }"
          @click="switchTab('voice')"
        >
          <text>声音</text>
          <view class="tab-indicator" v-if="activeTab === 'voice'"></view>
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
              <view class="asset-preview" @click="item.resultUrl ? openVideoModal(item) : null">
                <img 
                  v-if="item.resultUrl || item.videoUrl"
                  :src="getVideoThumbnail(item.resultUrl || item.videoUrl)" 
                  class="preview-image"
                  loading="lazy"
                  @error="handleImageError($event)"
                />
                <img 
                  v-else
                  :src="item.coverUrl || item.previewUrl || '/static/images/avatar-placeholder.png'" 
                  class="preview-image"
                />
                <view class="preview-glow"></view>
                <view v-if="item.resultUrl" class="play-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </view>
                <view class="status-badge" :class="getStatusClass(item.status)">
                  {{ getStatusText(item.status) }}
                </view>
              </view>
              
              <!-- 资产信息 - 直接放在底部 -->
              <text class="asset-name">{{ item.name }}</text>
              
              <!-- 底部操作按钮 - 绝对定位 -->
              <view class="card-actions">
                <view class="action-btn download-btn" v-if="parseInt(item.status) === 3" @click.stop="downloadVideo(item)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                  <text>下载</text>
                </view>
                <view class="action-btn delete-btn" :class="{'full-width': parseInt(item.status) !== 3}" @click.stop="showDeleteMenu(item.id, 'avatar')">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                  <text>删除</text>
                </view>
              </view>
            </view>
          </view>
          
          <!-- 加载更多提示 -->
          <view class="load-more" v-if="loadingMore && activeTab === 'avatar'">
            <view class="loading-spinner small"></view>
            <text>加载更多...</text>
          </view>
          
          <!-- 没有更多数据提示 -->
          <view class="no-more-data" v-if="!hasMore && digitalHumans.length > 0 && activeTab === 'avatar'">
            <text>— 没有更多作品了 —</text>
          </view>
          
          <!-- 空状态提示 -->
          <view class="empty-state" v-if="digitalHumans.length === 0 && !isLoadingInitial && activeTab === 'avatar'">
            <view class="empty-illustration">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="80" height="80">
                <defs>
                  <linearGradient id="videoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6F4CFF" />
                    <stop offset="100%" stop-color="#2F70ED" />
                  </linearGradient>
                </defs>
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" fill="url(#videoGradient)"/>
              </svg>
              <view class="empty-glow"></view>
            </view>
            <text class="empty-message">期待您的第一个视频作品</text>
            <text class="empty-hint" @click="createDigitalHuman">点击上方按钮开始创建</text>
          </view>
          
          <!-- 加载状态 -->
          <view class="loading-state" v-if="isLoadingInitial && activeTab === 'avatar'">
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
                <text class="voice-name">{{ voice.fileName || voice.name }}</text>
                <view class="voice-meta">
                  <text class="voice-duration" v-if="voice.durationSeconds">{{ formatDuration(voice.durationSeconds) }}</text>
                  <text class="voice-status" :class="getStatusClass(voice.status)">{{ getStatusText(voice.status) }}</text>
                </view>
              </view>
              
              <!-- 右侧操作按钮 -->
              <view class="voice-actions">
                <view class="voice-action-btn download-btn" v-if="parseInt(voice.status) === 2" @click.stop="downloadVoice(voice)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                </view>
                <view class="voice-action-btn delete-btn" @click.stop="showDeleteMenu(voice.id, 'voice')">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </view>
              </view>
            </view>
            <view class="card-glow"></view>
          </view>
          
          <!-- 加载更多提示 -->
          <view class="load-more" v-if="loadingMore && activeTab === 'voice'">
            <view class="loading-spinner small"></view>
            <text>加载更多...</text>
          </view>
          
          <!-- 没有更多数据提示 -->
          <view class="no-more-data" v-if="!hasMore && voices.length > 0 && activeTab === 'voice'">
            <text>— 没有更多声音了 —</text>
          </view>
          
          <!-- 空状态提示 -->
          <view class="empty-state" v-if="voices.length === 0 && !isLoadingInitial && activeTab === 'voice'">
            <view class="empty-illustration">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="80" height="80">
                <defs>
                  <linearGradient id="audioGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#43B5FF" />
                    <stop offset="100%" stop-color="#10B981" />
                  </linearGradient>
                </defs>
                <path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm-1.2-9.1c0-.66.54-1.2 1.2-1.2s1.2.54 1.2 1.2l-.01 6.2c0 .66-.53 1.2-1.19 1.2s-1.2-.54-1.2-1.2V5.9zm6.5 6.1c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.41 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" fill="url(#audioGradient)"/>
              </svg>
              <view class="empty-glow"></view>
            </view>
            <text class="empty-message">尚未创建声音作品</text>
            <text class="empty-hint" @click="createVoice">点击上方按钮开始创建</text>
          </view>
          
          <!-- 加载状态 -->
          <view class="loading-state" v-if="isLoadingInitial && activeTab === 'voice'">
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
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { worksApi } from '../../api/services'

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

// 分页相关参数
const pageSize = ref(20)
const currentPage = ref(1)
const hasMore = ref(true)
const loadingMore = ref(false)
const isLoadingInitial = ref(true)

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
const fetchDigitalHumans = async (isInitial = true) => {
  if (isInitial) {
    loading.value = true
    isLoadingInitial.value = true
    currentPage.value = 1
    digitalHumans.value = []
  } else {
    loadingMore.value = true
  }
  
  try {
    const response = await worksApi.getList('video', {
      page: currentPage.value,
      pageSize: pageSize.value
    })
    
    // 正确解析嵌套数据结构
    const newData = response.data?.data || []
    console.log('获取到视频数据:', newData)
    
    if (isInitial) {
      digitalHumans.value = newData
    } else {
      digitalHumans.value = [...digitalHumans.value, ...newData]
    }
    
    // 判断是否还有更多数据，使用total判断
    const total = response.data?.total || 0
    hasMore.value = digitalHumans.value.length < total
    
    // 增加页码，为下一次加载做准备
    if (newData.length > 0) {
      currentPage.value++
    }
  } catch (error) {
    console.error('获取视频列表失败:', error)
    uni.showToast({
      title: '获取视频列表失败',
      icon: 'none'
    })
    if (isInitial) {
      digitalHumans.value = []
    }
  } finally {
    if (isInitial) {
      loading.value = false
      isLoadingInitial.value = false
    } else {
      loadingMore.value = false
    }
  }
}

// 获取声音列表
const fetchVoices = async (isInitial = true) => {
  if (isInitial) {
    voiceLoading.value = true
    isLoadingInitial.value = true
    currentPage.value = 1
    voices.value = []
  } else {
    loadingMore.value = true
  }
  
  try {
    const response = await worksApi.getList('voice', {
      page: currentPage.value,
      pageSize: pageSize.value
    })
    
    const newData = response.data?.data || []
    console.log('获取到声音数据:', newData)
    
    if (isInitial) {
      voices.value = newData
    } else {
      voices.value = [...voices.value, ...newData]
    }
    
    // 判断是否还有更多数据，使用total判断
    const total = response.data?.total || 0
    hasMore.value = voices.value.length < total
    
    // 增加页码，为下一次加载做准备
    if (newData.length > 0) {
      currentPage.value++
    }
  } catch (error) {
    console.error('获取音频列表失败:', error)
    uni.showToast({
      title: '获取音频列表失败',
      icon: 'none'
    })
    if (isInitial) {
      voices.value = []
    }
  } finally {
    if (isInitial) {
      voiceLoading.value = false
      isLoadingInitial.value = false
    } else {
      loadingMore.value = false
    }
  }
}

// 加载更多数据
const loadMore = () => {
  if (loadingMore.value || !hasMore.value) return
  
  if (activeTab.value === 'avatar') {
    fetchDigitalHumans(false)
  } else {
    fetchVoices(false)
  }
}

// 监听滚动事件，实现无限滚动
const handleScroll = (event) => {
  const scrollTop = event.target.scrollTop
  const scrollHeight = event.target.scrollHeight
  const clientHeight = event.target.clientHeight
  
  // 当滚动到距离底部100px时加载更多
  if (scrollHeight - scrollTop - clientHeight < 100 && !loadingMore.value && hasMore.value) {
    loadMore()
  }
}

// 切换标签页并加载相应数据
const switchTab = (tab) => {
  activeTab.value = tab
  currentPage.value = 1
  hasMore.value = true
  
  if (tab === 'avatar') {
    fetchDigitalHumans()
  } else {
    fetchVoices()
  }
  // 切换标签页时停止播放
  currentPlayingId.value = null
}

onMounted(() => {
  // 确保用户已登录
  ensureLogin()
  // 初始加载数字人列表
  fetchDigitalHumans()
  
  // 添加favicon以防止404请求
  const favicon = document.createElement('link')
  favicon.rel = 'icon'
  favicon.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎬</text></svg>'
  document.head.appendChild(favicon)
  
  // 添加滚动监听
  nextTick(() => {
    const contentWrapper = document.querySelector('.content-wrapper')
    if (contentWrapper) {
      contentWrapper.addEventListener('scroll', handleScroll)
    }
  })
})

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
  router.push('/pages/avatar/create')
}

// 创建新声音
const createVoice = () => {
  router.push('/pages/voice/upload')
}

// 打开视频弹窗
const openVideoModal = (item) => {
  console.log('打开视频弹窗:', item)
  if (item.resultUrl) {
    currentVideo.value = item
    showVideoModal.value = true
    
    // 设置视频源
    setTimeout(() => {
      const videoPlayer = document.getElementById('videoPlayer')
      if (videoPlayer) {
        // 先添加错误处理函数，然后再设置src
        videoPlayer.onerror = null  // 清除之前的错误处理
        videoPlayer.src = item.resultUrl
        videoPlayer.load()
        videoPlayer.play().catch(err => {
          console.error('视频播放失败:', err)
        })
      }
    }, 100)
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

    // 创建新的音频元素
    audioElement.value = new Audio(item.voiceUrl)
    currentPlayingId.value = item.id
    
    // 播放声音
    await audioElement.value.play()
    
    // 播放完成后重置
    audioElement.value.onended = () => {
      currentPlayingId.value = null
    }
  } catch (error) {
    console.error('播放声音失败:', error)
    uni.showToast({
      title: '播放声音失败',
      icon: 'none'
    })
    currentPlayingId.value = null
  }
}

// 下载声音
const downloadVoice = (item) => {
  try {
    const loadingToast = document.createElement('div');
    loadingToast.className = 'toast-message';
    loadingToast.textContent = '准备下载...';
    loadingToast.style.position = 'fixed';
    loadingToast.style.top = '50%';
    loadingToast.style.left = '50%';
    loadingToast.style.transform = 'translate(-50%, -50%)';
    loadingToast.style.background = 'rgba(0, 0, 0, 0.7)';
    loadingToast.style.color = 'white';
    loadingToast.style.padding = '10px 20px';
    loadingToast.style.borderRadius = '5px';
    loadingToast.style.zIndex = '9999';
    document.body.appendChild(loadingToast);
    
    // 创建下载链接
    const link = document.createElement('a')
    link.href = item.voiceUrl
    link.download = `${item.fileName || 'voice'}.wav`
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
    
    // 移除加载提示
    document.body.removeChild(loadingToast);
    
    // 显示成功提示
    const successToast = document.createElement('div');
    successToast.className = 'toast-message';
    successToast.textContent = '下载成功';
    successToast.style.position = 'fixed';
    successToast.style.top = '50%';
    successToast.style.left = '50%';
    successToast.style.transform = 'translate(-50%, -50%)';
    successToast.style.background = 'rgba(0, 0, 0, 0.7)';
    successToast.style.color = 'white';
    successToast.style.padding = '10px 20px';
    successToast.style.borderRadius = '5px';
    successToast.style.zIndex = '9999';
    document.body.appendChild(successToast);
    
    // 2秒后移除成功提示
    setTimeout(() => {
      document.body.removeChild(successToast);
    }, 2000);
  } catch (error) {
    console.error('下载声音失败:', error)
    
    // 显示错误提示
    const errorToast = document.createElement('div');
    errorToast.className = 'toast-message';
    errorToast.textContent = '下载失败';
    errorToast.style.position = 'fixed';
    errorToast.style.top = '50%';
    errorToast.style.left = '50%';
    errorToast.style.transform = 'translate(-50%, -50%)';
    errorToast.style.background = 'rgba(0, 0, 0, 0.7)';
    errorToast.style.color = 'white';
    errorToast.style.padding = '10px 20px';
    errorToast.style.borderRadius = '5px';
    errorToast.style.zIndex = '9999';
    document.body.appendChild(errorToast);
    
    // 2秒后移除错误提示
    setTimeout(() => {
      document.body.removeChild(errorToast);
    }, 2000);
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
    router.push('/pages/avatar/create')
  } else {
    router.push('/pages/voice/upload')
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
      await worksApi.deleteWork(currentItemId.value, 'avatar')
      fetchDigitalHumans()
    } else if (currentItemType.value === 'voice') {
      await worksApi.deleteWork(currentItemId.value, 'voice')
      fetchVoices()
    }
    
    isLoading.value = false
    toastMessage.value = '删除成功'
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 2000)
  } catch (error) {
    console.error(`删除${currentItemType.value === 'avatar' ? '视频' : '声音'}失败:`, error)
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

// 跳转到一键分身页面 (保留方法但移除了按钮)
const goToClone = (video) => {
  if (!video) return
  
  router.push({
    path: '/pages/avatar/clone',
    query: { 
      videoUrl: video.videoUrl,
      avatarId: video.id,
      avatarName: video.name
    }
  })
}

// 获取状态类
const getStatusClass = (status) => {
  // 对声音合成记录使用不同的状态映射
  if (activeTab.value === 'voice') {
    switch (parseInt(status)) {
      case 1:
        return 'status-processing'
      case 2:
        return 'status-completed'
      case 3:
        return 'status-failed'
      default:
        return ''
    }
  }
  
  // 视频状态映射保持不变
  switch (parseInt(status)) {
    case 1:
      return 'status-processing'
    case 2:
      return 'status-processing'
    case 3:
      return 'status-completed'
    case 4:
    case 5:
      return 'status-failed'
    default:
      return ''
  }
}

// 获取状态文本
const getStatusText = (status) => {
  // 对声音合成记录使用不同的状态映射
  if (activeTab.value === 'voice') {
    switch (parseInt(status)) {
      case 1:
        return '处理中'
      case 2:
        return '已完成'
      case 3:
        return '失败'
      default:
        return '未知状态'
    }
  }
  
  // 视频状态映射保持不变
  switch (parseInt(status)) {
    case 1:
      return '审核中'
    case 2:
      return '处理中'
    case 3:
      return '已完成'
    case 4:
    case 5:
      return '失败'
    default:
      return '未知状态'
  }
}

// 下载视频
const downloadVideo = (item) => {
  try {
    const loadingToast = document.createElement('div');
    loadingToast.className = 'toast-message';
    loadingToast.textContent = '准备下载...';
    loadingToast.style.position = 'fixed';
    loadingToast.style.top = '50%';
    loadingToast.style.left = '50%';
    loadingToast.style.transform = 'translate(-50%, -50%)';
    loadingToast.style.background = 'rgba(0, 0, 0, 0.7)';
    loadingToast.style.color = 'white';
    loadingToast.style.padding = '10px 20px';
    loadingToast.style.borderRadius = '5px';
    loadingToast.style.zIndex = '9999';
    document.body.appendChild(loadingToast);
    
    // 创建下载链接
    const link = document.createElement('a')
    link.href = item.resultUrl
    link.download = `${item.name || 'video'}.mp4`
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
    
    // 移除加载提示
    document.body.removeChild(loadingToast);
    
    // 显示成功提示
    const successToast = document.createElement('div');
    successToast.className = 'toast-message';
    successToast.textContent = '下载成功';
    successToast.style.position = 'fixed';
    successToast.style.top = '50%';
    successToast.style.left = '50%';
    successToast.style.transform = 'translate(-50%, -50%)';
    successToast.style.background = 'rgba(0, 0, 0, 0.7)';
    successToast.style.color = 'white';
    successToast.style.padding = '10px 20px';
    successToast.style.borderRadius = '5px';
    successToast.style.zIndex = '9999';
    document.body.appendChild(successToast);
    
    // 2秒后移除成功提示
    setTimeout(() => {
      document.body.removeChild(successToast);
    }, 2000);
  } catch (error) {
    console.error('下载视频失败:', error)
    
    // 显示错误提示
    const errorToast = document.createElement('div');
    errorToast.className = 'toast-message';
    errorToast.textContent = '下载失败';
    errorToast.style.position = 'fixed';
    errorToast.style.top = '50%';
    errorToast.style.left = '50%';
    errorToast.style.transform = 'translate(-50%, -50%)';
    errorToast.style.background = 'rgba(0, 0, 0, 0.7)';
    errorToast.style.color = 'white';
    errorToast.style.padding = '10px 20px';
    errorToast.style.borderRadius = '5px';
    errorToast.style.zIndex = '9999';
    document.body.appendChild(errorToast);
    
    // 2秒后移除错误提示
    setTimeout(() => {
      document.body.removeChild(errorToast);
    }, 2000);
  }
}

// 在组件生命周期钩子中添加
onBeforeUnmount(() => {
  // 停止音频播放
  stopAudioPlayback()
})

// 监听路由变化，当路由改变时停止音频播放
watch(() => route.path, (newPath, oldPath) => {
  if (newPath !== oldPath) {
    stopAudioPlayback()
  }
})

// 添加停止音频播放的方法
const stopAudioPlayback = () => {
  if (audioElement.value) {
    console.log('停止音频播放')
    audioElement.value.pause()
    audioElement.value.currentTime = 0
    currentPlayingId.value = null
  }
}

// 获取视频缩略图
const getVideoThumbnail = (videoUrl) => {
  if (!videoUrl) return '/static/images/avatar-placeholder.png'
  try {
    // 移除URL中的查询参数部分
    const baseUrl = videoUrl.split('?')[0]
    // 添加OSS处理参数
    const thumbnailUrl = baseUrl + '?x-oss-process=video/snapshot,t_0'
    return thumbnailUrl
  } catch (error) {
    console.error('生成缩略图URL失败:', error)
    return '/static/images/avatar-placeholder.png'
  }
}

// 图片错误处理
const handleImageError = (e) => {
  // 避免死循环：如果当前图片已经是默认图片，则不再替换
  if (e.target.src.includes('avatar-placeholder.png')) return
  
  console.error('图片加载失败:', e.target.src)
  e.target.src = '/static/images/avatar-placeholder.png'
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
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 12px;
      height: 200px;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 1;
    }
    
    .asset-preview {
      position: relative;
      height: 140px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
      
      .preview-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 12px;
      }
      
      .preview-glow {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(67, 181, 255, 0.1), rgba(16, 185, 129, 0.1));
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .play-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        transition: opacity 0.3s ease;
        
        svg {
          width: 24px;
          height: 24px;
          fill: #fff;
        }
      }
      
      .status-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 4px 8px;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        font-size: 12px;
        font-weight: 500;
        
        &.status-processing {
          background: #ffb700;
        }
        
        &.status-completed {
          background: #10b981;
        }
        
        &.status-failed {
          background: #ef4444;
        }
      }
    }
    
    .asset-name {
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
      position: absolute;
      bottom: 38px;
      left: 12px;
      right: 12px;
    }
    
    /* 卡片操作按钮 */
    .card-actions {
      display: flex;
      gap: 5px;
      padding: 0;
      margin: 0;
      position: absolute;
      bottom: 12px;
      left: 12px;
      right: 12px;
      
      .action-btn {
        flex: 1;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        padding: 0 6px;
        font-size: 12px;
        transition: all 0.3s ease;
        
        svg {
          margin-right: 2px;
          width: 14px;
          height: 14px;
        }
        
        &.download-btn {
          background: rgba(59, 130, 246, 0.2);
          color: #fff;
          border: 1px solid rgba(59, 130, 246, 0.3);
          
          svg {
            fill: #3b82f6;
          }
          
          &:active {
            background: rgba(59, 130, 246, 0.3);
          }
        }
        
        &.delete-btn {
          background: rgba(239, 68, 68, 0.2);
          color: #fff;
          border: 1px solid rgba(239, 68, 68, 0.3);
          
          svg {
            fill: #ef4444;
          }
          
          &:active {
            background: rgba(239, 68, 68, 0.3);
          }
          
          &.full-width {
            flex: 1;
            width: 100%;
          }
        }
      }
    }
    
    &:hover, &:active {
      .card-glow {
        opacity: 0.6;
      }
      
      .play-icon {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.1);
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

/* 声音列表 */
.voice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .voice-card {
    background: linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.9));
    backdrop-filter: blur(10px);
    border-radius: 16px;
    margin-bottom: 16px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
      
      .card-glow {
        opacity: 1;
      }
    }
    
    .card-inner {
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      position: relative;
      z-index: 2;
    }
    
    .play-button {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3B82F6, #8B5CF6);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
      cursor: pointer;
      transition: transform 0.2s ease;
      box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
      
      &:active {
        transform: scale(0.95);
      }
    }
    
    .voice-info {
      flex: 1;
      overflow: hidden;
    }
    
    .voice-name {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .voice-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }
    
    .voice-status {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      
      &.status-processing {
        background-color: rgba(59, 130, 246, 0.15);
        color: #3B82F6;
      }
      
      &.status-completed {
        background-color: rgba(16, 185, 129, 0.15);
        color: #10B981;
      }
      
      &.status-failed {
        background-color: rgba(239, 68, 68, 0.15);
        color: #EF4444;
      }
    }
    
    .voice-actions {
      display: flex;
      gap: 12px;
    }
    
    .voice-action-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, background-color 0.2s ease;
      cursor: pointer;
      
      &.download-btn {
        background: linear-gradient(135deg, #10B981, #059669);
        color: white;
        box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
      }
      
      &.delete-btn {
        background: linear-gradient(135deg, #F87171, #EF4444);
        color: white;
        box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
      }
      
      &:active {
        transform: scale(0.9);
      }
    }
    
    .card-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15), transparent 70%);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1;
      pointer-events: none;
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

/* 加载更多提示 */
.load-more {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  margin: 10px 0;
  
  .loading-spinner.small {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(67, 181, 255, 0.1);
    border-top-color: rgba(67, 181, 255, 0.8);
    border-radius: 50%;
    margin-right: 8px;
    animation: spin 1s linear infinite;
  }
  
  text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }
}

/* 没有更多数据提示 */
.no-more-data {
  grid-column: 1 / -1;
  text-align: center;
  padding: 16px 0;
  margin: 10px 0;
  
  text {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    position: relative;
    display: inline-block;
    
    &:before,
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      width: 30px;
      height: 1px;
      background: rgba(255, 255, 255, 0.2);
    }
    
    &:before {
      left: -40px;
    }
    
    &:after {
      right: -40px;
    }
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
  
  .assets-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 0 2px;
    
    .asset-card {
      .card-inner {
        padding: 8px;
        height: 170px;
      }
      
      .asset-preview {
        height: 110px;
        margin-bottom: 6px;
        
        .play-icon {
          width: 32px;
          height: 32px;
          
          svg {
            width: 20px;
            height: 20px;
          }
        }
        
        .status-badge {
          padding: 2px 6px;
          font-size: 10px;
          top: 6px;
          right: 6px;
        }
      }
      
      .asset-name {
        font-size: 12px;
        bottom: 32px;
        left: 8px;
        right: 8px;
      }
      
      .card-actions {
        bottom: 8px;
        left: 8px;
        right: 8px;
        
        .action-btn {
          height: 20px;
          font-size: 11px;
          
          svg {
            width: 12px;
            height: 12px;
          }
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
        
        svg {
          width: 18px;
          height: 18px;
        }
      }
      
      .voice-info {
        .voice-name {
          font-size: 13px;
        }
        
        .voice-meta {
          .voice-duration, .voice-status {
            font-size: 11px;
          }
        }
      }
      
      .voice-actions {
        .voice-action-btn {
          width: 28px;
          height: 28px;
          
          svg {
            width: 14px;
            height: 14px;
          }
        }
      }
    }
  }
  
  .empty-state {
    .empty-illustration {
      svg {
        width: 70px;
        height: 70px;
      }
    }
    
    .empty-message {
      font-size: 16px;
    }
    
    .empty-hint {
      font-size: 13px;
    }
  }
  
  .loading-state, .load-more {
    .loading-spinner {
      width: 20px;
      height: 20px;
    }
  }
  
  .no-more-data {
    font-size: 12px;
    margin: 15px 0;
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
      .card-inner {
        height: 185px;
      }
      
      .asset-preview {
        height: 125px;
      }
      
      .asset-name {
        font-size: 13px;
      }
    }
  }
  
  .voice-list {
    gap: 12px;
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
  }
}
</style> 