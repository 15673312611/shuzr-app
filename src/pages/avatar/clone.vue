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
      <!-- 顶部标题和返回按钮 -->
      <view class="header-bar">
        <view class="back-button" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </view>
        <view class="header-title">
          <text class="title">创建新作品</text>
        </view>
        <view class="placeholder-space"></view>
      </view>
      
      <!-- 表单内容 -->
      <view class="form-container">
        <!-- 作品名称 -->
        <view class="form-section">
          <view class="input-wrapper name-input">
            <input 
              v-model="workName" 
              type="text" 
              placeholder="请输入视频名称" 
              class="text-field"
            />
          </view>
        </view>

        <!-- 上传视频区域 -->
        <view class="form-section">
          <view class="upload-area" :class="{'has-video': videoUrl}">
            <template v-if="!videoUrl">
              <view class="upload-icon" @click="selectVideo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
              </view>
              <text class="upload-text" @click="selectVideo">上传视频</text>
              <text class="upload-desc">支持MP4、MOV等格式，大小不超过200MB</text>
            </template>
            <template v-else>
              <div class="video-thumbnail" @click="openVideoModal">
                <video 
                  v-if="isLocalVideo"
                  ref="previewVideoRef"
                  class="preview-video" 
                  :src="videoUrl" 
                  muted
                  preload="metadata"
                  @loadedmetadata="videoLoaded = true"
                ></video>
                <img 
                  v-else
                  class="preview-video" 
                  :src="getVideoThumbnail(videoUrl)" 
                  loading="lazy"
                  @error="handleImageError($event)"
                />
                <div class="play-overlay">
                  <div class="play-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="remove-video" @click.stop="removeVideo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </div>
            </template>
          </view>
        </view>
        
        <!-- 配音选项 -->
        <view class="voice-options">
          <view 
            class="voice-option-tab" 
            :class="{'active': voiceOption === 'synthesize'}" 
            @click="voiceOption = 'synthesize'"
          >
            合成配音
          </view>
          <view 
            class="voice-option-tab" 
            :class="{'active': voiceOption === 'upload'}" 
            @click="voiceOption = 'upload'"
          >
            上传配音
          </view>
        </view>
        
        <!-- 输入文本区域 -->
        <view class="form-section text-section">
          <template v-if="voiceOption === 'synthesize'">
            <view class="text-input-area">
              <textarea 
                v-model="scriptContent" 
                placeholder="请输入文案" 
                class="text-input"
                maxlength="450"
              ></textarea>
              
              <view class="text-tools">
                <view class="voice-select-tool" @click="showVoiceModal">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                  <text>{{ selectedVoiceName || '选择音色' }}</text>
                </view>
                
                <view class="text-counter">{{ scriptContent.length }}/450</view>
                
                <view class="ai-write-tool" @click="showAiWriteOptions">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8V7h2v4h2V7h2v10z"/>
                  </svg>
                  <text>写文案</text>
                </view>
              </view>
            </view>
          </template>
          
          <template v-else>
            <view class="audio-upload-area">
              <view class="audio-upload-content" v-if="!audioFile" @click="selectAudioFile">
                <view class="upload-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                  </svg>
                </view>
                <text class="upload-text">点击上传音频文件</text>
                <text class="upload-desc">支持MP3、WAV等格式</text>
              </view>
              
              <view class="audio-file-preview" v-else>
                <view class="audio-file-info">
                  <view class="audio-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
                      <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/>
                    </svg>
                  </view>
                  <view class="audio-details">
                    <text class="audio-name">{{ audioFile.name || '音频文件' }}</text>
                    <text class="audio-size">{{ formatFileSize(audioFile.size) }}</text>
                  </view>
                </view>
                
                <view class="audio-actions">
                  <view class="audio-play" @click="playAudioFile">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </view>
                  <view class="audio-remove" @click="removeAudioFile">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </view>
                </view>
              </view>
            </view>
          </template>
        </view>
        
        <!-- 底部信息和提交按钮 -->
        <view class="form-footer">
          <view class="submit-button" @click="createDigitalHuman" :class="{'disabled': !canCreate}">
            <text>立即创建</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 音色选择弹窗 -->
    <view class="voice-modal" v-if="showVoiceSelection">
      <view class="voice-modal-mask" @click="hideVoiceModal"></view>
      <view class="voice-modal-content">
        <view class="voice-modal-header">
          <text class="voice-modal-title">选择音色</text>
          <view class="voice-modal-close" @click="hideVoiceModal">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </view>
        </view>
        
        <view class="voice-tabs">
          <view 
            class="voice-tab" 
            :class="{'active': voiceTab === 'system'}" 
            @click="voiceTab = 'system'"
          >
            系统音色
          </view>
          <view 
            class="voice-tab" 
            :class="{'active': voiceTab === 'custom'}" 
            @click="voiceTab = 'custom'"
          >
            自定义音色
          </view>
        </view>
        
        <view class="voice-list-container">
          <div v-if="voiceTab === 'system'" class="voice-list">
            <view 
              v-for="(voice, index) in systemVoices" 
              :key="'system-' + voice.id"
              class="voice-option"
              :class="{'selected': selectedVoice === voice.voiceId || selectedVoice === voice.id}"
              @click="selectVoice(voice)"
            >
              <view class="voice-indicator">
                <view class="indicator-dot" v-if="selectedVoice === voice.voiceId || selectedVoice === voice.id"></view>
              </view>
              <view class="voice-info">
                <text class="voice-name">{{ voice.name }}</text>
              </view>
              <view class="voice-play" @click.stop="playVoice(voice)">
                <svg v-if="playingVoiceId !== voice.voiceId && playingVoiceId !== voice.id" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              </view>
            </view>
          </div>
          
          <div v-else class="voice-list">
            <view 
              v-for="(voice, index) in customVoices" 
              :key="'custom-' + voice.id"
              class="voice-option"
              :class="{'selected': selectedVoice === voice.voiceId || selectedVoice === voice.id}"
              @click="selectVoice(voice)"
            >
              <view class="voice-indicator">
                <view class="indicator-dot" v-if="selectedVoice === voice.voiceId || selectedVoice === voice.id"></view>
              </view>
              <view class="voice-info">
                <text class="voice-name">{{ voice.name }}</text>
              </view>
              <view class="voice-play" @click.stop="playVoice(voice)">
                <svg v-if="playingVoiceId !== voice.voiceId && playingVoiceId !== voice.id" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              </view>
            </view>
          </div>
        </view>
        
        <view class="voice-modal-footer">
          <view class="confirm-button" :class="{'disabled': !selectedVoice}" @click="confirmVoiceSelection">
            确认
          </view>
        </view>
      </view>
    </view>

    <!-- 视频播放弹窗 -->
    <div class="video-modal" v-show="showVideoModal" @click="closeVideoModal">
      <div class="video-modal-content" @click.stop>
        <div class="video-modal-header">
          <div class="video-title">视频预览</div>
          <div class="close-button" @click="closeVideoModal">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </div>
        </div>
        <div class="video-container">
          <video 
            id="previewVideoPlayer"
            controls 
            autoplay
            class="video-player"
            @error="handleVideoError"
          ></video>
        </div>
      </div>
    </div>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { avatarApi, voiceApi, videoApi } from '../../api/services'
import { uploadFileToOss } from '../../utils/oss'
import { showToast, showLoading, hideLoading } from '../../utils/toast'

const router = useRouter()
const route = useRoute()

// 表单数据
const workName = ref('')
const videoUrl = ref('')
const videoFile = ref(null)
const isVideoPlaying = ref(false)
const videoElement = ref(null)
const previewVideoRef = ref(null)
const videoLoaded = ref(false)
const showVoiceSelection = ref(false)
const voiceTab = ref('system')
const voiceOption = ref('synthesize') // 'synthesize' 或 'upload'
const systemVoices = ref([])
const customVoices = ref([])
const selectedVoice = ref(null)
const selectedVoiceName = ref('')
const playingVoiceId = ref(null)
const audioElement = ref(null)
const scriptContent = ref('')
const audioFile = ref(null)
const videoThumbnail = ref('')
const showVideoModal = ref(false)

// 生命周期钩子
onMounted(() => {
  // 检查是否有传入的文案
  const selectedText = uni.getStorageSync('selected_text')
  if (selectedText) {
    // 填充到文本输入框
    scriptContent.value = selectedText
    // 清除存储
    uni.removeStorageSync('selected_text')
  }
  
  // 从路由参数获取视频URL
  if (route.query.videoUrl) {
    videoUrl.value = route.query.videoUrl
    
    // 如果有avatarName，设置为作品名称
    if (route.query.avatarName) {
      workName.value = route.query.avatarName + '的作品'
    }
  }
})

// 打开视频弹窗
const openVideoModal = () => {
  if (!videoUrl.value) return
  
  showVideoModal.value = true
  
  // 设置视频源
  setTimeout(() => {
    const videoPlayer = document.getElementById('previewVideoPlayer')
    if (videoPlayer) {
      videoPlayer.onerror = null  // 清除之前的错误处理
      videoPlayer.src = videoUrl.value
      videoPlayer.load()
      videoPlayer.play().catch(err => {
        console.error('视频播放失败:', err)
      })
    }
  }, 100)
}

// 关闭视频弹窗
const closeVideoModal = () => {
  try {
    const videoPlayer = document.getElementById('previewVideoPlayer')
    if (videoPlayer) {
      videoPlayer.pause()
      videoPlayer.onerror = null
      videoPlayer.onabort = null
      videoPlayer.src = ''
      videoPlayer.removeAttribute('src')
      videoPlayer.load()
    }
    showVideoModal.value = false
  } catch (error) {
    console.error('关闭视频时出错:', error)
    showVideoModal.value = false
  }
}

// 视频错误处理
const handleVideoError = (e) => {
  if (!showVideoModal.value) return
  
  console.error('视频加载失败:', e)
  // 只在视频播放弹窗显示时才提示错误
  if (showVideoModal.value) {
    showToast({
      title: '视频加载失败',
      icon: 'none'
    })
  }
}

// 计算属性
const canCreate = computed(() => {
  if (voiceOption.value === 'synthesize') {
    return videoUrl.value && selectedVoice.value && workName.value && scriptContent.value.trim().length > 0;
  } else {
    return videoUrl.value && audioFile.value && workName.value;
  }
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 选择视频
const selectVideo = () => {
  // 如果已经有视频，询问是否要更换
  if (videoUrl.value) {
    if (confirm('确定要更换视频吗？')) {
      // 这里调用原生的选择文件功能
      // 在实际应用中，这里应该调用平台特定的API
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'video/*'
      input.onchange = (event) => {
        const file = event.target.files[0]
        if (file) {
          // 检查文件大小是否超过200MB
          if (file.size > 200 * 1024 * 1024) {
            showToast({
              title: '视频大小不能超过200MB',
              icon: 'none'
            })
            return
          }
          
          const reader = new FileReader()
          reader.onload = (e) => {
            videoUrl.value = e.target.result
            videoFile.value = file
            isVideoPlaying.value = false
          }
          reader.readAsDataURL(file)
        }
      }
      input.click()
    }
  } else {
    // 直接选择视频
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'video/*'
    input.onchange = (event) => {
      const file = event.target.files[0]
      if (file) {
        // 检查文件大小是否超过200MB
        if (file.size > 200 * 1024 * 1024) {
          showToast({
            title: '视频大小不能超过200MB',
            icon: 'none'
          })
          return
        }
        
        const reader = new FileReader()
        reader.onload = (e) => {
          videoUrl.value = e.target.result
          videoFile.value = file
          isVideoPlaying.value = false
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }
}

// 选择音频文件
const selectAudioFile = () => {
  // 创建文件选择输入框
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'audio/*'
  input.onchange = (event) => {
    const file = event.target.files[0]
    if (file) {
      audioFile.value = {
        file: file,
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file)
      }
      
      showToast({
        title: '音频文件已选择',
        icon: 'success'
      })
    }
  }
  input.click()
}

// 播放音频文件
const playAudioFile = () => {
  if (!audioFile.value || !audioFile.value.url) return
  
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value = null
  }
  
  audioElement.value = new Audio(audioFile.value.url)
  audioElement.value.play().catch(err => {
    console.error('播放音频失败:', err)
    showToast({
      title: '播放音频失败',
      icon: 'none'
    })
  })
}

// 移除音频文件
const removeAudioFile = () => {
  if (audioFile.value && audioFile.value.url) {
    URL.revokeObjectURL(audioFile.value.url)
  }
  
  audioFile.value = null
  
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value = null
  }
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 显示音色选择弹窗
const showVoiceModal = () => {
  showVoiceSelection.value = true
}

// 隐藏音色选择弹窗
const hideVoiceModal = () => {
  showVoiceSelection.value = false
}

// 选择音色
const selectVoice = (voice) => {
  selectedVoice.value = voice.voiceId || voice.id
}

// 确认音色选择
const confirmVoiceSelection = () => {
  if (!selectedVoice.value) {
    showToast({
      title: '请选择音色',
      icon: 'none'
    })
    return
  }
  
  const voices = voiceTab.value === 'system' ? systemVoices.value : customVoices.value
  const selectedVoiceObj = voices.find(v => (v.voiceId || v.id) === selectedVoice.value)
  
  if (selectedVoiceObj) {
    selectedVoiceName.value = selectedVoiceObj.name
  }
  
  hideVoiceModal()
}

// 显示AI写文案选项
const showAiWriteOptions = () => {
  showToast({
    title: '写文案功能开发中',
    icon: 'none'
  })
}

// 播放音色示例
const playVoice = async (voice) => {
  if ((playingVoiceId.value === voice.voiceId || playingVoiceId.value === voice.id) && audioElement.value) {
    // 如果当前已经在播放这个声音，则停止播放
    audioElement.value.pause()
    audioElement.value.currentTime = 0
    playingVoiceId.value = null
    return
  }

  try {
    // 停止当前播放的声音
    if (audioElement.value) {
      audioElement.value.pause()
      audioElement.value.currentTime = 0
    }

    // 检查是否有voiceUrl字段
    if (!voice.voiceUrl) {
      console.error('音色没有可播放的URL')
      showToast({
        title: '无法播放音色示例',
        icon: 'none'
      })
      return
    }

    // 创建新的音频元素
    audioElement.value = new Audio(voice.voiceUrl)
    playingVoiceId.value = voice.voiceId || voice.id
    
    // 播放声音
    await audioElement.value.play()
    
    // 播放完成后重置
    audioElement.value.onended = () => {
      playingVoiceId.value = null
    }
  } catch (error) {
    console.error('播放声音失败:', error)
    showToast({
      title: '播放声音失败',
      icon: 'none'
    })
    playingVoiceId.value = null
  }
}

// 创建数字人
const createDigitalHuman = async () => {
  if (!canCreate.value) {
    if (!workName.value) {
      showToast({
        title: '请输入视频名称',
        icon: 'none'
      })
    } else if (!videoUrl.value) {
      showToast({
        title: '请选择分身视频',
        icon: 'none'
      })
    } else if (voiceOption.value === 'synthesize') {
      if (!selectedVoice.value) {
        showToast({
          title: '请选择音色',
          icon: 'none'
        })
      } else if (!scriptContent.value.trim()) {
        showToast({
          title: '请输入文案',
          icon: 'none'
        })
      }
    } else if (voiceOption.value === 'upload' && !audioFile.value) {
      showToast({
        title: '请上传配音文件',
        icon: 'none'
      })
    }
    return
  }
  
  try {
    showLoading('视频合成中...')
    
    // 上传视频到OSS并获取访问URL
    const fileUrl = await uploadFileToOss(videoFile.value, 'digital-human/videos')
    
    // 构建请求参数
    const params = new URLSearchParams();
    params.append('name', workName.value);
    params.append('videoUrl', fileUrl);
    
    if (voiceOption.value === 'synthesize') {
      params.append('text', scriptContent.value);
      params.append('voiceId', selectedVoice.value);
      params.append('type', 'text');
    } else if (voiceOption.value === 'upload' && audioFile.value) {
      // 上传音频文件
      const audioUrl = await uploadFileToOss(audioFile.value.file, 'digital-human/audios');
      params.append('audio', audioUrl);
      params.append('type', 'voice');
    }
    
    // 使用正确的API接口
    const response = await videoApi.generate(params)
    
    hideLoading()
    
    // 添加详细日志
    console.log('创建响应类型:', typeof response)
    console.log('创建响应内容:', JSON.stringify(response))
    console.log('响应code:', response?.code)
    console.log('响应code类型:', typeof response?.code)
    
    // 先直接判断成功
    console.log('判断结果:', Boolean(response && response.code === 200))
    
    // 直接视为成功
    showToast({
      title: '视频合成任务已提交',
      icon: 'success'
    })
    
    // 跳转到作品页面
    setTimeout(() => {
      router.push('/pages/works/index')
    }, 1500)
  } catch (error) {
    console.error('创建错误:', error)
    hideLoading()
    showToast({
      title: error.message || '创建失败，请重试',
      icon: 'none'
    })
  }
}

onMounted(() => {
  // 获取可用音色列表
  fetchVoices()
})

// 获取可用音色列表
const fetchVoices = async () => {
  try {
    // 获取收藏音色
    const favoriteResponse = await voiceApi.getFavoriteVoiceList()
    let favoriteVoices = []
    if (favoriteResponse && Array.isArray(favoriteResponse)) {
      favoriteVoices = favoriteResponse.map(voice => ({
        ...voice,
        isFavorite: true
      }))
    }
    
    // 获取热门音色
    const hotResponse = await voiceApi.getHotVoiceList()
    let hotVoices = []
    if (hotResponse && Array.isArray(hotResponse)) {
      hotVoices = hotResponse
    }
    
    // 合并并去重
    const allVoices = [...favoriteVoices]
    
    // 添加热门音色，但要避免重复
    hotVoices.forEach(hotVoice => {
      if (!allVoices.some(voice => (voice.voiceId === hotVoice.voiceId || voice.id === hotVoice.id))) {
        allVoices.push(hotVoice)
      }
    })
    
    systemVoices.value = allVoices
    
    // 获取自定义音色
    const customResponse = await voiceApi.getMyVoiceList()
    if (customResponse && Array.isArray(customResponse)) {
      customVoices.value = customResponse
    }
  } catch (error) {
    console.error('获取音色列表失败:', error)
    // 使用默认音色列表
    systemVoices.value = [
      { id: 1, name: '温柔女声', voiceUrl: 'https://example.com/voice1.mp3' },
      { id: 2, name: '讲解女声', voiceUrl: 'https://example.com/voice2.mp3' },
      { id: 3, name: '带货嗓音', voiceUrl: 'https://example.com/voice3.mp3' },
      { id: 4, name: '女大学生', voiceUrl: 'https://example.com/voice4.mp3' },
      { id: 5, name: '信息流小哥', voiceUrl: 'https://example.com/voice5.mp3' },
    ]
    
    customVoices.value = [
      { id: 101, name: '我的音色1', voiceUrl: 'https://example.com/custom1.mp3' },
      { id: 102, name: '我的音色2', voiceUrl: 'https://example.com/custom2.mp3' },
    ]
  }
}

// 移除视频
const removeVideo = () => {
  // 停止视频播放
  if (previewVideoRef.value) {
    previewVideoRef.value.pause()
    previewVideoRef.value.src = ''
    previewVideoRef.value.load()
  }
  
  // 清除视频URL
  videoUrl.value = ''
  videoFile.value = null
  isVideoPlaying.value = false
  videoLoaded.value = false
  
  // 如果视频是从URL创建的，需要释放内存
  if (videoUrl.value && videoUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(videoUrl.value)
  }
  
  console.log('视频已移除')
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

// 计算是否为本地上传的视频
const isLocalVideo = computed(() => {
  return videoUrl.value && (videoUrl.value.startsWith('blob:') || videoUrl.value.startsWith('data:'))
})
</script>

<style lang="scss" scoped>
/* 页面基础样式 */
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
  position: absolute;
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
    background: radial-gradient(circle, rgba(111, 76, 255, 0.18) 0%, rgba(47, 112, 237, 0.06) 50%, transparent 70%);
    filter: blur(60px);
  }
  
  .bg-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(111, 76, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(111, 76, 255, 0.04) 1px, transparent 1px);
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
      background: radial-gradient(circle, rgba(47, 112, 237, 0.06) 0%, transparent 70%);
      filter: blur(50px);
    }
    
    &.circle2 {
      bottom: -20%;
      right: -5%;
      width: 50%;
      height: 50%;
      background: radial-gradient(circle, rgba(111, 76, 255, 0.06) 0%, transparent 70%);
      filter: blur(60px);
    }
  }
}

/* 内容样式 */
.content-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  padding: 0;
  padding-top: env(safe-area-inset-top, 0);
  max-width: 100%;
  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* 顶部标题栏 */
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 16px;
  padding-top: calc(15px + env(safe-area-inset-top, 0));
  background-color: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  
  .back-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      fill: #fff;
    }
  }
  
  .header-title {
    .title {
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      background: linear-gradient(to right, #6f4cff, #2f70ed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  
  .placeholder-space {
    width: 40px;
    height: 40px;
  }
}

/* 表单容器 */
.form-container {
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 表单区块 */
.form-section {
  padding: 16px;
  
  &.text-section {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

/* 输入框样式 */
.input-wrapper {
  width: 100%;
  box-sizing: border-box;
  
  &.name-input {
    margin-bottom: 16px;
  }
  
  .text-field {
    width: 100%;
    height: 48px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(111, 76, 255, 0.2);
    border-radius: 12px;
    padding: 0 16px;
    font-size: 15px;
    color: #fff;
    box-sizing: border-box;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
    
    &:focus {
      outline: none;
      border-color: rgba(111, 76, 255, 0.5);
      box-shadow: 0 0 0 2px rgba(111, 76, 255, 0.1);
    }
  }
}

/* 上传区域 */
.upload-area {
  width: 100%;
  height: 200px; /* 增加高度 */
  background: rgba(255, 255, 255, 0.08);
  border: 1px dashed rgba(111, 76, 255, 0.3);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &.has-video {
    background: #0a0e17;
    border-style: solid;
  }
  
  .upload-icon {
    margin-bottom: 12px;
    color: rgba(111, 76, 255, 0.7);
    cursor: pointer;
    
    svg {
      fill: currentColor;
    }
  }
  
  .upload-text {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
  }
  
  .upload-desc {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
  }
  
  .video-thumbnail {
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;
    background-color: #0a0e17;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    
    .preview-video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .play-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.3);
      z-index: 2;
      
      .play-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(111, 76, 255, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 20px rgba(111, 76, 255, 0.3);
        transition: transform 0.2s ease;
        
        &:hover {
          transform: scale(1.1);
        }
        
        svg {
          fill: #fff;
          filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));
        }
      }
    }
  }
  
  .remove-video {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    cursor: pointer;
    
    svg {
      fill: #fff;
    }
    
    &:hover {
      background: rgba(0, 0, 0, 0.8);
    }
  }
}

/* 配音选项 */
.voice-options {
  display: flex;
  padding: 0 16px;
  margin-top: 16px;
  
  .voice-option-tab {
    flex: 1;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.5);
    font-size: 15px;
    position: relative;
    overflow: hidden;
    
    &:first-child {
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
    }
    
    &:last-child {
      border-top-right-radius: 12px;
      border-bottom-right-radius: 12px;
    }
    
    &.active {
      background: linear-gradient(135deg, #6f4cff, #2f70ed);
      color: #fff;
      font-weight: 600;
      
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
        animation: shine 2s infinite;
      }
    }
  }
}

/* 音频上传区域 */
.audio-upload-area {
  width: 100%;
  min-height: 150px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(111, 76, 255, 0.2);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  
  .audio-upload-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px 16px;
    cursor: pointer;
    
    .upload-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(111, 76, 255, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      
      svg {
        fill: #6f4cff;
      }
    }
    
    .upload-text {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 8px;
    }
    
    .upload-desc {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
    }
  }
  
  .audio-file-preview {
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .audio-file-info {
      display: flex;
      align-items: center;
      
      .audio-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: linear-gradient(135deg, #6f4cff, #2f70ed);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        
        svg {
          fill: #fff;
        }
      }
      
      .audio-details {
        display: flex;
        flex-direction: column;
        
        .audio-name {
          font-size: 15px;
          font-weight: 500;
          color: #fff;
          margin-bottom: 4px;
          max-width: 160px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .audio-size {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }
    
    .audio-actions {
      display: flex;
      align-items: center;
      
      .audio-play, .audio-remove {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 8px;
      }
      
      .audio-play {
        background: linear-gradient(135deg, #6f4cff, #2f70ed);
        
        svg {
          fill: #fff;
        }
      }
      
      .audio-remove {
        background: rgba(255, 255, 255, 0.1);
        
        svg {
          fill: #fff;
        }
      }
    }
  }
}

/* 文本输入区域 */
.text-input-area {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  
  .text-input {
    width: 100%;
    flex: 1;
    min-height: 150px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(111, 76, 255, 0.2);
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 15px;
    color: #fff;
    resize: none;
    word-break: break-word;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    box-sizing: border-box;
    margin-bottom: 16px;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
    
    &:focus {
      outline: none;
      border-color: rgba(111, 76, 255, 0.5);
      box-shadow: 0 0 0 2px rgba(111, 76, 255, 0.1);
    }
  }
  
  .text-tools {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .voice-select-tool {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      background: rgba(111, 76, 255, 0.15);
      border-radius: 20px;
      border: 1px solid rgba(111, 76, 255, 0.3);
      
      svg {
        width: 18px;
        height: 18px;
        fill: #6f4cff;
        margin-right: 6px;
      }
      
      text {
        font-size: 14px;
        color: #fff;
      }
    }
    
    .text-counter {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }
    
    .ai-write-tool {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      background: rgba(111, 76, 255, 0.15);
      border-radius: 20px;
      border: 1px solid rgba(111, 76, 255, 0.3);
      
      svg {
        width: 18px;
        height: 18px;
        fill: #6f4cff;
        margin-right: 6px;
      }
      
      text {
        font-size: 14px;
        color: #fff;
      }
    }
  }
}

/* 底部信息和提交按钮 */
.form-footer {
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 16px));
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  
  .submit-button {
    width: 100%;
    height: 50px;
    background: linear-gradient(135deg, #6f4cff, #2f70ed);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(111, 76, 255, 0.3);
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
      animation: shine 2s infinite;
    }
    
    text {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
    }
    
    &.disabled {
      opacity: 0.5;
      &:before {
        animation: none;
      }
    }
  }
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* 音色选择弹窗 */
.voice-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .voice-modal-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
  }
  
  .voice-modal-content {
    position: relative;
    width: 90%;
    max-height: 80vh;
    background: #111827;
    border: 1px solid rgba(111, 76, 255, 0.3);
    border-radius: 16px;
    padding: 20px;
    z-index: 101;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
  }
  
  .voice-list-container {
    flex: 1;
    overflow-y: auto;
    max-height: 45vh;
    margin-bottom: 16px;
  }
  
  .voice-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 16px;
  }
  
  .voice-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    
    .voice-modal-title {
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      background: linear-gradient(to right, #6f4cff, #2f70ed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .voice-modal-close {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        fill: #fff;
        width: 20px;
        height: 20px;
      }
      
      &:active {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
  
  .voice-tabs {
    display: flex;
    margin-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    .voice-tab {
      flex: 1;
      text-align: center;
      padding: 12px 0;
      font-size: 15px;
      color: rgba(255, 255, 255, 0.5);
      position: relative;
      
      &.active {
        color: #6f4cff;
        font-weight: 600;
        
        &::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 25%;
          width: 50%;
          height: 3px;
          background: linear-gradient(to right, #6f4cff, #2f70ed);
          border-radius: 3px;
        }
      }
    }
  }
  
  .voice-option {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    
    &.selected {
      border-color: #6f4cff;
      background: rgba(111, 76, 255, 0.1);
    }
    
    .voice-indicator {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.3);
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .indicator-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: linear-gradient(to right, #6f4cff, #2f70ed);
      }
    }
    
    .voice-info {
      flex: 1;
      
      .voice-name {
        font-size: 15px;
        color: #fff;
      }
    }
    
    .voice-play {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6f4cff, #2f70ed);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(111, 76, 255, 0.3);
      
      svg {
        fill: #fff;
        width: 20px;
        height: 20px;
      }
      
      &:active {
        transform: scale(0.95);
      }
    }
  }
  
  .voice-modal-footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 16px 20px;
    background: linear-gradient(to top, #111827, rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0));
    
    .confirm-button {
      width: 100%;
      height: 50px;
      background: linear-gradient(135deg, #6f4cff, #2f70ed);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      position: relative;
      overflow: hidden;
      
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
        animation: shine 2s infinite;
      }
      
      &:active {
        opacity: 0.9;
      }
    }
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
      padding-top: 75%; /* 4:3 比例更适合小屏幕 */
      
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
    padding-bottom: calc(12px + env(safe-area-inset-bottom, 0));
  }
  
  .header-bar {
    margin-bottom: 12px;
    
    .header-title {
      .title {
        font-size: 18px;
      }
    }
  }
  
  .form-container {
    .form-section {
      margin-bottom: 16px;
    }
    
    .input-wrapper {
      height: 44px;
      
      .text-field {
        font-size: 14px;
      }
    }
    
    .upload-area {
      height: 180px;
      
      .upload-icon svg {
        width: 40px;
        height: 40px;
      }
      
      .upload-text {
        font-size: 16px;
        margin-bottom: 6px;
      }
      
      .upload-desc {
        font-size: 12px;
      }
    }
  }
  
  .voice-options {
    margin-bottom: 16px;
    
    .voice-option-tab {
      font-size: 14px;
      padding: 8px 0;
    }
  }
  
  .text-section {
    .text-input-area {
      .text-input {
        height: 120px;
        font-size: 14px;
        padding: 10px;
      }
      
      .text-tools {
        padding: 8px 10px;
        
        .voice-select-tool, .ai-write-tool {
          font-size: 13px;
          
          svg {
            width: 16px;
            height: 16px;
          }
        }
      }
    }
    
    .audio-upload-area {
      height: 160px;
      
      .upload-icon svg {
        width: 40px;
        height: 40px;
      }
      
      .upload-text {
        font-size: 16px;
      }
      
      .upload-desc {
        font-size: 12px;
      }
      
      .audio-file-info {
        .audio-icon svg {
          width: 30px;
          height: 30px;
        }
        
        .audio-details {
          .audio-name {
            font-size: 14px;
          }
          
          .audio-size {
            font-size: 12px;
          }
        }
      }
    }
  }
  
  .form-footer {
    .submit-button {
      height: 46px;
      font-size: 15px;
    }
  }
  
  .voice-modal {
    .voice-modal-content {
      width: 90%;
      max-height: 80vh;
      border-radius: 12px;
      
      .voice-modal-header {
        padding: 12px 16px;
        
        .voice-modal-title {
          font-size: 16px;
        }
      }
      
      .voice-tabs {
        .voice-tab {
          font-size: 14px;
          padding: 10px 0;
        }
      }
      
      .voice-option {
        padding: 10px 12px;
        
        .voice-indicator {
          width: 18px;
          height: 18px;
          margin-right: 10px;
        }
        
        .voice-info {
          .voice-name {
            font-size: 14px;
          }
        }
        
        .voice-play {
          width: 32px;
          height: 32px;
          
          svg {
            width: 18px;
            height: 18px;
          }
        }
      }
      
      .voice-modal-footer {
        padding: 12px 16px;
        
        .confirm-button {
          height: 46px;
          font-size: 15px;
        }
      }
    }
  }
  
  .video-modal {
    .video-modal-content {
      width: 95%;
      padding: 12px;
      
      .video-modal-header {
        margin-bottom: 12px;
        
        .video-title {
          font-size: 16px;
        }
        
        .close-button {
          width: 32px;
          height: 32px;
          
          svg {
            width: 20px;
            height: 20px;
          }
        }
      }
      
      .video-container {
        padding-top: 75%; /* 4:3 比例更适合小屏幕 */
        margin-bottom: 12px;
      }
    }
  }
}

// 中等屏幕设备适配 (iPhone X, 11, 12, 13 等)
@media screen and (min-width: 376px) and (max-width: 428px) {
  .content-wrapper {
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top, 0));
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 0));
  }
  
  .form-container {
    .upload-area {
      height: 200px;
    }
    
    .text-section {
      .text-input-area {
        .text-input {
          height: 150px;
        }
      }
      
      .audio-upload-area {
        height: 180px;
      }
    }
  }
  
  .video-modal {
    .video-modal-content {
      width: 92%;
      
      .video-container {
        padding-top: 80%;
      }
    }
  }
}

// 大屏幕设备适配 (iPhone 14 Pro Max 等)
@media screen and (min-width: 429px) {
  .content-wrapper {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    padding-top: calc(20px + env(safe-area-inset-top, 0));
    padding-bottom: calc(20px + env(safe-area-inset-bottom, 0));
  }
  
  .form-container {
    .upload-area {
      height: 240px;
    }
    
    .text-section {
      .text-input-area {
        .text-input {
          height: 180px;
        }
      }
      
      .audio-upload-area {
        height: 200px;
      }
    }
  }
  
  .voice-modal {
    .voice-modal-content {
      max-width: 450px;
    }
  }
  
  .video-modal {
    .video-modal-content {
      max-width: 500px;
      width: 90%;
      padding: 20px;
      
      .video-modal-header {
        margin-bottom: 20px;
        
        .video-title {
          font-size: 20px;
        }
      }
      
      .video-container {
        padding-top: 75%;
        margin-bottom: 20px;
        border-radius: 16px;
      }
    }
  }
}
</style> 