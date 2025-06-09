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
      <!-- 顶部导航栏 -->
      <view class="nav-header">
        <view class="header-title">
          <text class="title-text">声音克隆</text>
          <text class="title-sub">管理您的所有声音</text>
        </view>
        <view class="create-button" @click="createNewVoice">
          <view class="button-inner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <text>新建声音</text>
          </view>
        </view>
      </view>
      
      <!-- 有数据时的内容 -->
      <block v-if="voiceList.length > 0">
        <!-- 声音列表 -->
        <view class="voice-list">
          <view 
            class="voice-card" 
            v-for="(voice, index) in voiceList" 
            :key="voice.id"
          >
            <view class="card-inner">
              <view class="voice-content">
                <!-- 左侧内容区 -->
                <view class="voice-content">
                  <!-- 中间信息区 -->
                  <view class="voice-info">
                    <text class="voice-name">{{ voice.name }}</text>
                    <text class="voice-date">创建于 {{ formatDate(voice.createTime) }}</text>
                    <text class="voice-duration">{{ formatDuration(voice.durationSeconds) }}</text>
                  </view>
                  
                  <!-- 右侧操作区 -->
                  <view class="voice-actions">
                    <!-- 播放按钮 -->
                    <view class="play-button" @click.stop="playVoice(voice)">
                      <svg v-if="currentPlayingId !== voice.id" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    </view>
                    
                    <!-- 更多菜单按钮 -->
                    <view class="more-button" @click.stop="showActionSheet(voice)">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                    </view>
                    
                    <!-- 使用按钮 -->
                    <view class="use-button" @click.stop="useVoice(voice)">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                      </svg>
                      <text>使用</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="card-glow"></view>
          </view>
        </view>
      </block>
      
      <!-- 空状态 -->
      <view class="empty-state" v-else>
        <view class="empty-animation">
          <view class="empty-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
            </svg>
            <view class="pulse-circle"></view>
          </view>
        </view>
        <text class="empty-title">开始创建您的声音</text>
        <text class="empty-description">创建您自己的声音克隆，体验AI语音合成</text>
        <view class="empty-action" @click="createNewVoice">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          <text>立即创建</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { voiceApi } from '../../api/services'
import NoData from '../../components/NoData.vue'

const router = useRouter()
const currentPlayingId = ref(null)
const audioElement = ref(null)
const loading = ref(false)
const voiceList = ref([])

// 获取声音列表
const fetchVoiceList = async () => {
  loading.value = true
  try {
    // 获取我的声音列表
    const response = await voiceApi.getMyVoiceList()
    if (response && response.data) {
      voiceList.value = response.data
    } else {
      voiceList.value = []
    }
  } catch (error) {
    console.error('获取声音列表失败:', error)
    uni.showToast({
      title: '获取声音列表失败',
      icon: 'none'
    })
    voiceList.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchVoiceList()
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const formatDuration = (seconds) => {
  if (!seconds) return '00:00'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

const createNewVoice = () => {
  router.push('/pages/voice/upload')
}

const playVoice = async (voice) => {
  if (currentPlayingId.value === voice.id && audioElement.value) {
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
    audioElement.value = new Audio(voice.sampleUrl)
    currentPlayingId.value = voice.id
    
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

const useVoice = (voice) => {
  router.push({
    path: `/pages/voice/use`,
    query: { id: voice.id, name: voice.name }
  })
}

// 删除声音
const deleteVoice = async (id) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这个声音吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({ title: '删除中...' })
          await voiceApi.deleteVoice(id)
          uni.hideLoading()
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          })
          // 刷新列表
          fetchVoiceList()
        } catch (error) {
          console.error('删除声音失败:', error)
          uni.hideLoading()
          uni.showToast({
            title: '删除失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 重命名声音
const renameVoice = (voice) => {
  uni.showModal({
    title: '重命名声音',
    editable: true,
    placeholderText: '请输入新名称',
    content: voice.name,
    success: async (res) => {
      if (res.confirm && res.content.trim()) {
        try {
          await voiceApi.renameVoice(voice.id, res.content.trim())
          uni.showToast({
            title: '重命名成功',
            icon: 'success'
          })
          // 重新获取列表
          fetchVoiceList()
        } catch (error) {
          console.error('重命名失败:', error)
          uni.showToast({
            title: '重命名失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 显示操作菜单
const showActionSheet = (voice) => {
  uni.showActionSheet({
    itemList: ['重命名', '删除'],
    success: (res) => {
      switch (res.tapIndex) {
        case 0: // 重命名
          renameVoice(voice)
          break
        case 1: // 删除
          deleteVoice(voice.id)
          break
      }
    }
  })
}
</script>

<style lang="scss" scoped>
/* 页面基础样式 */
.page-container {
  min-height: 100vh;
  background-color: #030712;
  position: relative;
  color: #fff;
  font-family: 'PingFang SC', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  overflow-x: hidden;
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
    background: radial-gradient(circle, rgba(67, 181, 255, 0.18) 0%, rgba(62, 247, 200, 0.06) 50%, transparent 70%);
    filter: blur(60px);
  }
  
  .bg-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(67, 181, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(67, 181, 255, 0.04) 1px, transparent 1px);
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
      background: radial-gradient(circle, rgba(62, 247, 200, 0.06) 0%, transparent 70%);
      filter: blur(50px);
    }
    
    &.circle2 {
      bottom: -20%;
      right: -5%;
      width: 50%;
      height: 50%;
      background: radial-gradient(circle, rgba(67, 181, 255, 0.06) 0%, transparent 70%);
      filter: blur(60px);
    }
  }
}

/* 内容样式 */
.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 28px 16px;
  max-width: 640px;
  margin: 0 auto;
}

/* 导航头部 */
.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  
  .header-title {
    .title-text {
      display: block;
      font-size: 30px;
      font-weight: 700;
      background: linear-gradient(to right, #fff, #43b5ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 6px;
      letter-spacing: -0.5px;
    }
    
    .title-sub {
      display: block;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      letter-spacing: 0.2px;
    }
  }
  
  .create-button {
    .button-inner {
      display: flex;
      align-items: center;
      padding: 12px 22px;
      background: linear-gradient(135deg, #43b5ff, #3ef7c8);
      border-radius: 30px;
      box-shadow: 0 6px 16px rgba(67, 181, 255, 0.25);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        animation: shine 3s infinite;
      }
      
      &:active {
        transform: translateY(2px);
        box-shadow: 0 2px 6px rgba(67, 181, 255, 0.2);
      }
      
      svg {
        margin-right: 8px;
        color: rgba(0, 0, 0, 0.8);
      }
      
      text {
        font-size: 15px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.8);
      }
    }
  }
}

/* 声音列表 */
.voice-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
  
  .voice-card {
    position: relative;
    border-radius: 18px;
    overflow: hidden;
    background: rgba(17, 24, 39, 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.3s ease;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    
    &:hover {
      transform: translateY(-3px);
      border-color: rgba(67, 181, 255, 0.3);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
      
      .card-glow {
        opacity: 0.8;
      }
    }
    
    .card-inner {
      position: relative;
      z-index: 1;
      padding: 16px;
    }
    
    .voice-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .voice-info {
        flex: 1;
        min-width: 0;
        
        .voice-name {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .voice-date {
          display: block;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 4px;
        }
        
        .voice-duration {
          display: block;
          font-size: 12px;
          color: rgba(67, 181, 255, 0.8);
        }
      }
      
      .voice-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .play-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #43b5ff, #3ef7c8);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(67, 181, 255, 0.25);
          transition: all 0.25s ease;
          cursor: pointer;
          flex-shrink: 0;
          
          svg {
            width: 22px;
            height: 22px;
            color: rgba(0, 0, 0, 0.8);
          }
          
          &:active {
            transform: scale(0.95);
            box-shadow: 0 2px 6px rgba(67, 181, 255, 0.2);
          }
        }
        
        .more-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #43b5ff, #3ef7c8);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(67, 181, 255, 0.25);
          transition: all 0.25s ease;
          cursor: pointer;
          flex-shrink: 0;
          
          svg {
            width: 22px;
            height: 22px;
            color: rgba(0, 0, 0, 0.8);
          }
          
          &:active {
            transform: scale(0.95);
            box-shadow: 0 2px 6px rgba(67, 181, 255, 0.2);
          }
        }
        
        .use-button {
          height: 32px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 12px;
          transition: all 0.25s ease;
          font-size: 13px;
          white-space: nowrap;
          background: linear-gradient(to right, #43b5ff, #3ef7c8);
          color: rgba(0, 0, 0, 0.8);
          font-weight: 600;
          
          svg {
            width: 14px;
            height: 14px;
            margin-right: 4px;
          }
          
          &:active {
            transform: scale(0.95);
          }
        }
      }
    }
    
    .card-glow {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 60%;
      background: linear-gradient(to top, rgba(67, 181, 255, 0.08), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 0;
    }
  }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  
  .empty-animation {
    margin-bottom: 30px;
    
    .empty-icon-wrapper {
      position: relative;
      width: 130px;
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        position: relative;
        z-index: 2;
        color: #43b5ff;
        opacity: 0.9;
      }
      
      .pulse-circle {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(67, 181, 255, 0.2) 0%, transparent 70%);
        animation: pulse 2s infinite;
        z-index: 1;
      }
    }
  }
  
  .empty-title {
    font-size: 28px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 16px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    background: linear-gradient(to right, #fff, #43b5ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .empty-description {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.6);
    max-width: 280px;
    margin: 0 auto 40px;
    line-height: 1.6;
  }
  
  .empty-action {
    display: flex;
    align-items: center;
    padding: 16px 32px;
    background: linear-gradient(135deg, #43b5ff, #3ef7c8);
    border-radius: 30px;
    box-shadow: 0 8px 24px rgba(67, 181, 255, 0.3);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      animation: shine 3s infinite;
    }
    
    &:active {
      transform: translateY(3px);
      box-shadow: 0 4px 12px rgba(67, 181, 255, 0.2);
    }
    
    svg {
      margin-right: 10px;
      color: rgba(0, 0, 0, 0.8);
    }
    
    text {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.8);
    }
  }
}

/* 动画 */
@keyframes pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.6;
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

/* 响应式调整 */
@media (max-width: 375px) {
  .nav-header {
    flex-direction: column;
    align-items: flex-start;
    
    .create-button {
      margin-top: 16px;
      align-self: flex-start;
    }
  }
  
  .voice-content {
    flex-direction: column;
    align-items: flex-start;
    
    .voice-info {
      margin-bottom: 12px;
    }
    
    .voice-actions {
      width: 100%;
      justify-content: space-between;
    }
  }
}
</style> 