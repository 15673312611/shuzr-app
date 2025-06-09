<template>
  <div class="synthesis-page" :class="{ 'no-nav': !showNavBar }">
    <!-- 顶部导航栏，根据路由参数控制显示 -->
    <div class="nav-bar" v-if="showNavBar">
      <div class="back-btn" @click="goBack">
        <span class="back-arrow">&#10094;</span>
      </div>
      <div class="title">视频合成</div>
    </div>

    <!-- 新增顶部横条 -->
    <div class="top-header">
      <div class="back-btn" @click="goBack">
        <span class="back-arrow">&#10094;</span>
      </div>
      <div class="header-title">合成视频</div>
      <div class="placeholder-div"></div>
    </div>

    <!-- 视频标题输入 - 移到最上面 -->
    <div class="title-input-box">
      <div class="title-input-label">作品名称</div>
      <input type="text" placeholder="请输入作品名称" v-model="videoTitle" class="title-input" />
    </div>

    <!-- 形象选择提示 -->
    <div class="section-title">请选择形象</div>

    <!-- 视频卡片区域 -->
    <div class="video-cards">
      <div 
        v-for="(avatar, index) in avatarList" 
        :key="avatar.id"
        :class="['video-card', { selected: selectedAvatar === index }]"
        @click="selectAvatar(index)"
      >
        <img :src="avatar.coverUrl" :alt="avatar.name" class="video-cover" />
        <div v-if="avatar.name" class="video-text">{{ avatar.name }}</div>
        <div class="select-indicator" :class="{ active: selectedAvatar === index }">
          <div class="indicator-circle"></div>
        </div>
      </div>
      <div v-if="avatarList.length === 0" class="empty-tip">
        暂无形象，请先创建形象
      </div>
    </div>

    <!-- 驱动方式选择 -->
    <div class="drive-options">
      <div 
        :class="['drive-option', { active: driveMode === 'text' }]" 
        @click="driveMode = 'text'"
      >
        AI文本驱动
      </div>
      <div 
        :class="['drive-option', { active: driveMode === 'voice' }]" 
        @click="driveMode = 'voice'"
      >
        语音驱动
      </div>
    </div>

    <!-- AI文本驱动模式 -->
    <div v-if="driveMode === 'text'" class="text-drive-area">
      <textarea class="text-area" placeholder="请输入文案" v-model="textContent"></textarea>
      <div class="text-footer">
        <button class="btn-voice-color" @click="showVoiceModal">
          <span class="voice-icon">🔊</span> {{ selectedVoiceName || '选择音色' }}
        </button>
        <span class="text-count">{{ textContent.length }}/450</span>
        <button class="btn-write">
          <span class="write-icon">📝</span> 写文案
        </button>
      </div>
    </div>

    <!-- 语音驱动模式 -->
    <div v-if="driveMode === 'voice'" class="voice-record-area">
      <div class="voice-section">
        <!-- 录音区域 -->
        <div class="record-section">
          <div class="record-title">语音驱动</div>
          
          <!-- 录音部分 -->
          <div class="record-tip" v-if="!isRecording && !audioRecorded && !uploadedAudio">
            点击开始录制语音，建议录制 <span class="highlight">15~60秒</span> 内
          </div>
          <div class="record-tip" v-else-if="isRecording">
            正在录制中...
          </div>
          
          <div class="record-controls">
            <div class="record-btn-container" @click="toggleRecording">
              <div class="record-btn-large">
                <div class="mic-icon">🎤</div>
              </div>
              <svg class="record-progress" v-if="isRecording || isRecordingPaused" width="90" height="90">
                <circle
                  cx="45"
                  cy="45"
                  r="40"
                  fill="none"
                  stroke="#4e5cff"
                  stroke-width="3"
                  stroke-dasharray="251.2"
                  :stroke-dashoffset="progressOffset"
                  transform="rotate(-90, 45, 45)"
                />
              </svg>
            </div>
          </div>
          
          <div class="record-time" v-if="!audioRecorded && !uploadedAudio">{{ formatTime(recordingTime) }}</div>
          
          <!-- 上传音频选项 - 只有在没有任何音频时才显示 -->
          <div class="upload-option" v-if="!uploadedAudio && !audioRecorded && !isRecording" @click="uploadAudioFile">
            <div class="upload-icon-small">
              <span class="plus-icon-small">+</span>
            </div>
            <div class="upload-text-small">上传音频文件</div>
          </div>
          
          <div class="audio-tip" v-if="!audioRecorded && !uploadedAudio && !isRecording">
            支持mp3、m4a、wav音频文件，请上传3分钟内的音频
          </div>
          
          <!-- 统一的音频播放器 - 直接放在录音区域内 -->
          <div class="audio-player" v-if="audioRecorded || uploadedAudio">
            <!-- 录制的音频播放器 -->
            <div v-if="audioRecorded">
              <div class="audio-controls">
                <div class="play-btn" @click="toggleAudioPlay">
                  <svg v-if="!isAudioPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                </div>
                <div class="audio-progress-container">
                  <div class="audio-progress-bar">
                    <div class="audio-progress" :style="{ width: audioProgress + '%' }"></div>
                  </div>
                  <div class="audio-time">{{ formatTime(audioCurrentTime) }} / {{ formatTime(audioDuration || 0) }}</div>
                </div>
                <div class="delete-btn" @click="deleteRecording">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- 上传的音频播放器 -->
            <div v-if="uploadedAudio">
              <div class="audio-file-info">
                <div class="audio-file-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/>
                  </svg>
                </div>
                <div class="audio-file-name">{{ uploadedAudio.name }}</div>
              </div>
              <div class="audio-controls">
                <div class="play-btn" @click="toggleUploadedAudioPlay">
                  <svg v-if="!isUploadedAudioPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                </div>
                <div class="audio-progress-container">
                  <div class="audio-progress-bar">
                    <div class="audio-progress" :style="{ width: uploadedAudioProgress + '%' }"></div>
                  </div>
                  <div class="audio-time">{{ formatTime(uploadedAudioCurrentTime) }} / {{ formatTime(uploadedAudioDuration || 0) }}</div>
                </div>
                <div class="delete-btn" @click="deleteUploadedAudio">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="create-btn" @click="createVideo">立即创建</div>

    <!-- 音色选择弹窗 -->
    <div class="voice-modal" v-if="showVoiceSelection">
      <div class="voice-modal-mask" @click="hideVoiceModal"></div>
      <div class="voice-modal-content">
        <div class="voice-modal-header">
          <text class="voice-modal-title">选择音色</text>
          <div class="voice-modal-close" @click="hideVoiceModal">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </div>
        </div>
        
        <div class="voice-tabs">
          <div 
            class="voice-tab" 
            :class="{'active': voiceTab === 'system'}" 
            @click="voiceTab = 'system'"
          >
            系统音色
          </div>
          <div 
            class="voice-tab" 
            :class="{'active': voiceTab === 'custom'}" 
            @click="voiceTab = 'custom'"
          >
            自定义音色
          </div>
        </div>
        
        <div class="voice-list-container">
          <div v-if="voiceTab === 'system'" class="voice-list">
            <div 
              v-for="(voice, index) in systemVoices" 
              :key="'system-' + voice.id"
              class="voice-option"
              :class="{'selected': selectedVoice === voice.voiceId || selectedVoice === voice.id}"
              @click="selectVoice(voice)"
            >
              <div class="voice-indicator">
                <div class="indicator-dot" v-if="selectedVoice === voice.voiceId || selectedVoice === voice.id"></div>
              </div>
              <div class="voice-info">
                <text class="voice-name">{{ voice.name }}</text>
              </div>
              <div class="voice-play" @click.stop="playVoice(voice)">
                <svg v-if="playingVoiceId !== voice.voiceId && playingVoiceId !== voice.id" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div v-else class="voice-list">
            <div 
              v-for="(voice, index) in customVoices" 
              :key="'custom-' + voice.id"
              class="voice-option"
              :class="{'selected': selectedVoice === voice.voiceId || selectedVoice === voice.id}"
              @click="selectVoice(voice)"
            >
              <div class="voice-indicator">
                <div class="indicator-dot" v-if="selectedVoice === voice.voiceId || selectedVoice === voice.id"></div>
              </div>
              <div class="voice-info">
                <text class="voice-name">{{ voice.name }}</text>
              </div>
              <div class="voice-play" @click.stop="playVoice(voice)">
                <svg v-if="playingVoiceId !== voice.voiceId && playingVoiceId !== voice.id" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div class="voice-modal-footer">
          <div class="confirm-button" :class="{'disabled': !selectedVoice}" @click="confirmVoiceSelection">
            确认
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { avatarApi, voiceApi, videoApi } from '../../api/services'
import { uploadFileToOss } from '../../utils/oss'
import { showToast, showLoading, hideLoading } from '../../utils/toast'

const route = useRoute()
const router = useRouter()

// 控制导航栏显示
const showNavBar = ref(true)

// 形象列表
const avatarList = ref([])
const selectedAvatar = ref(0)
const loading = ref(false)

// 视频标题
const videoTitle = ref('')

// 驱动方式
const driveMode = ref('text') // 默认为'text'文本驱动，不是'voice'语音驱动

// 文本内容
const textContent = ref('')

// 录音状态
const isRecording = ref(false)
const isRecordingPaused = ref(false)
const recordingTime = ref(0)
const maxRecordingTime = 60 // 最大录制时间（秒）
const recordingInterval = ref(null)
const audioRecorded = ref(false)
const audioDuration = ref(0)
const audioCurrentTime = ref(0)
const audioProgress = ref(0)
const isAudioPlaying = ref(false)
const recordedAudio = ref(null)
const audioRecorder = ref(null)
const audioBlob = ref(null)
const audioUrl = ref(null)

// 音色选择相关
const showVoiceSelection = ref(false)
const voiceTab = ref('system')
const systemVoices = ref([])
const customVoices = ref([])
const selectedVoice = ref(null)
const selectedVoiceName = ref('')
const playingVoiceId = ref(null)
const audioElement = ref(null)

// 上传音频相关
const uploadedAudio = ref(null)
const uploadedAudioDuration = ref(0)
const uploadedAudioCurrentTime = ref(0)
const uploadedAudioProgress = ref(0)
const isUploadedAudioPlaying = ref(false)
const uploadedAudioElement = ref(null)

// 音频来源（录制或上传）
const audioSource = ref('recorded')

// 计算录音进度环的偏移量
const progressOffset = computed(() => {
  const circumference = 2 * Math.PI * 40 // 圆的周长
  const progress = recordingTime.value / maxRecordingTime
  return circumference * (1 - progress)
})

// 格式化时间为 MM:SS 格式
const formatTime = (seconds) => {
  if (seconds === undefined || seconds === null || isNaN(seconds)) {
    return '00:00'
  }
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 获取形象列表
const fetchAvatarList = async () => {
  loading.value = true
  try {
    const res = await avatarApi.getMyList()
    avatarList.value = res || [] // 直接使用返回的数组
    if (avatarList.value.length > 0) {
      selectedAvatar.value = 0
    }
  } catch (error) {
    console.error('获取形象列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 选择形象
const selectAvatar = (index) => {
  selectedAvatar.value = index
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 录音控制
const toggleRecording = () => {
  if (!isRecording.value && !isRecordingPaused.value) {
    startRecording()
  } else if (isRecording.value) {
    pauseRecording()
  } else if (isRecordingPaused.value) {
    resumeRecording()
  }
}

// 开始录音
const startRecording = async () => {
  try {
    // 重置状态
    if (audioRecorded.value) {
      deleteRecording()
    }
    
    // 如果有上传的音频，也要清理
    if (uploadedAudio.value) {
      deleteUploadedAudio()
    }
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioRecorder.value = new MediaRecorder(stream)
    const audioChunks = []
    
    audioRecorder.value.ondataavailable = (event) => {
      audioChunks.push(event.data)
    }
    
    audioRecorder.value.onstop = () => {
      const chunks = [...audioChunks]
      audioBlob.value = new Blob(chunks, { type: 'audio/webm' })
      audioUrl.value = URL.createObjectURL(audioBlob.value)
      
      // 创建音频元素来获取时长
      const audio = new Audio(audioUrl.value)
      audio.onloadedmetadata = () => {
        audioDuration.value = audio.duration
      }
      
      audioRecorded.value = true
      recordedAudio.value = audio
    }
    
    audioRecorder.value.start()
    isRecording.value = true
    
    // 启动计时器
    recordingTime.value = 0
    recordingInterval.value = setInterval(() => {
      recordingTime.value++
      
      // 达到最大录制时间自动结束
      if (recordingTime.value >= maxRecordingTime) {
        pauseRecording()
      }
    }, 1000)
    
  } catch (error) {
    console.error('录音失败:', error)
    showToast({
      title: '无法访问麦克风',
      icon: 'none'
    })
  }
}

// 暂停录音
const pauseRecording = () => {
  if (audioRecorder.value && isRecording.value) {
    audioRecorder.value.stop()
    clearInterval(recordingInterval.value)
    isRecording.value = false
    isRecordingPaused.value = true
    
    // 停止所有音轨
    audioRecorder.value.stream?.getTracks().forEach(track => track.stop())
  }
}

// 继续录音
const resumeRecording = () => {
  startRecording()
}

// 取消录音
const cancelRecording = () => {
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value)
  }
  
  audioRecorded.value = false
  isRecordingPaused.value = false
  recordingTime.value = 0
  audioBlob.value = null
  audioUrl.value = null
  recordedAudio.value = null
}

// 完成录音
const finishRecording = () => {
  isRecordingPaused.value = false
}

// 删除录音
const deleteRecording = () => {
  if (isAudioPlaying.value && recordedAudio.value) {
    recordedAudio.value.pause()
    isAudioPlaying.value = false
  }
  
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value)
  }
  
  audioRecorded.value = false
  recordingTime.value = 0
  audioBlob.value = null
  audioUrl.value = null
  recordedAudio.value = null
  audioCurrentTime.value = 0
  audioDuration.value = 0
  audioProgress.value = 0
}

// 播放/暂停录制的音频
const toggleAudioPlay = () => {
  if (!recordedAudio.value) return
  
  if (isAudioPlaying.value) {
    recordedAudio.value.pause()
    isAudioPlaying.value = false
  } else {
    // 如果上传的音频正在播放，先暂停
    if (isUploadedAudioPlaying.value && uploadedAudioElement.value) {
      uploadedAudioElement.value.pause()
      isUploadedAudioPlaying.value = false
    }
    
    recordedAudio.value.currentTime = 0
    recordedAudio.value.play()
    isAudioPlaying.value = true
    
    // 更新进度
    const updateProgress = () => {
      if (isAudioPlaying.value) {
        audioCurrentTime.value = recordedAudio.value.currentTime
        audioProgress.value = (audioCurrentTime.value / audioDuration.value) * 100
        requestAnimationFrame(updateProgress)
      }
    }
    
    updateProgress()
    
    // 播放结束
    recordedAudio.value.onended = () => {
      isAudioPlaying.value = false
      audioCurrentTime.value = 0
      audioProgress.value = 0
    }
  }
}

// 上传音频文件
const uploadAudioFile = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'audio/*'
  
  input.onchange = (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    // 检查文件大小（限制为20MB）
    if (file.size > 20 * 1024 * 1024) {
      showToast({
        title: '文件大小不能超过20MB',
        icon: 'none'
      })
      return
    }
    
    // 创建音频元素
    const audio = new Audio()
    audio.src = URL.createObjectURL(file)
    
    audio.onloadedmetadata = () => {
      // 检查音频时长（限制为3分钟）
      if (audio.duration > 3 * 60) {
        URL.revokeObjectURL(audio.src)
        showToast({
          title: '音频时长不能超过3分钟',
          icon: 'none'
        })
        return
      }
      
      // 如果已有上传的音频，先清理
      if (uploadedAudio.value && uploadedAudioElement.value) {
        deleteUploadedAudio()
      }
      
      // 如果有录制的音频，也要清理
      if (audioRecorded.value) {
        deleteRecording()
      }
      
      uploadedAudio.value = {
        file: file,
        name: file.name,
        url: audio.src
      }
      
      uploadedAudioElement.value = audio
      uploadedAudioDuration.value = audio.duration
    }
    
    audio.onerror = () => {
      URL.revokeObjectURL(audio.src)
      showToast({
        title: '音频文件无法播放',
        icon: 'none'
      })
    }
  }
  
  input.click()
}

// 播放/暂停上传的音频
const toggleUploadedAudioPlay = () => {
  if (!uploadedAudioElement.value) return
  
  if (isUploadedAudioPlaying.value) {
    uploadedAudioElement.value.pause()
    isUploadedAudioPlaying.value = false
  } else {
    // 如果录制的音频正在播放，先暂停
    if (isAudioPlaying.value && recordedAudio.value) {
      recordedAudio.value.pause()
      isAudioPlaying.value = false
    }
    
    uploadedAudioElement.value.currentTime = 0
    uploadedAudioElement.value.play()
    isUploadedAudioPlaying.value = true
    
    // 更新进度
    const updateProgress = () => {
      if (isUploadedAudioPlaying.value) {
        uploadedAudioCurrentTime.value = uploadedAudioElement.value.currentTime
        uploadedAudioProgress.value = (uploadedAudioCurrentTime.value / uploadedAudioDuration.value) * 100
        requestAnimationFrame(updateProgress)
      }
    }
    
    updateProgress()
    
    // 播放结束
    uploadedAudioElement.value.onended = () => {
      isUploadedAudioPlaying.value = false
      uploadedAudioCurrentTime.value = 0
      uploadedAudioProgress.value = 0
    }
  }
}

// 删除上传的音频
const deleteUploadedAudio = () => {
  if (isUploadedAudioPlaying.value && uploadedAudioElement.value) {
    uploadedAudioElement.value.pause()
  }
  
  if (uploadedAudio.value && uploadedAudio.value.url) {
    URL.revokeObjectURL(uploadedAudio.value.url)
  }
  
  uploadedAudio.value = null
  uploadedAudioElement.value = null
  uploadedAudioCurrentTime.value = 0
  uploadedAudioDuration.value = 0
  uploadedAudioProgress.value = 0
  isUploadedAudioPlaying.value = false
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

// 播放音色示例
const playVoice = async (voice) => {
  if (playingVoiceId.value === voice.voiceId || playingVoiceId.value === voice.id && audioElement.value) {
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
      if (!allVoices.some(voice => voice.voiceId === hotVoice.voiceId || voice.id === hotVoice.voiceId)) {
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
      { id: 2, name: '标准男声', voiceUrl: 'https://example.com/voice2.mp3' },
      { id: 3, name: '活力女声', voiceUrl: 'https://example.com/voice3.mp3' },
    ]
    customVoices.value = []
  }
}

// 创建视频
const createVideo = async () => {
  // 验证必填项
  if (!avatarList.value[selectedAvatar.value]) {
    showToast({
      title: '请选择形象',
      icon: 'none'
    })
    return
  }
  
  if (!videoTitle.value) {
    showToast({
      title: '请输入作品名称',
      icon: 'none'
    })
    return
  }
  
  if (driveMode.value === 'text') {
    if (!selectedVoice.value) {
      showToast({
        title: '请选择音色',
        icon: 'none'
      })
      return
    }
    
    if (!textContent.value.trim()) {
      showToast({
        title: '请输入文案',
        icon: 'none'
      })
      return
    }
  } else if (driveMode.value === 'voice') {
    // 检查是否有录音或上传的音频
    if (!audioRecorded.value && !uploadedAudio.value) {
      showToast({
        title: '请录制语音或上传音频文件',
        icon: 'none'
      })
      return
    }
  }
  
  try {
    showLoading('视频合成中...')
    
    // 使用URLSearchParams传递参数
    const params = new URLSearchParams();
    params.append('name', videoTitle.value);
    params.append('videoUrl', avatarList.value[selectedAvatar.value].videoUrl);
    
    // 根据驱动方式设置不同的参数
    if (driveMode.value === 'text') {
      params.append('text', textContent.value);
      params.append('voiceId', selectedVoice.value);
      params.append('type', 'text');
    } else if (driveMode.value === 'voice') {
      params.append('type', 'voice');
      
      // 如果是录制的音频
      if (audioRecorded.value && audioBlob.value) {
        try {
          // 将Blob转换为File对象
          const audioFile = new File([audioBlob.value], 'recorded_audio.webm', { type: 'audio/webm' })
          // 上传音频到OSS
          const audioUrl = await uploadFileToOss(audioFile, 'digital-human/audios')
          params.append('audio', audioUrl);
        } catch (uploadError) {
          console.error('音频上传失败:', uploadError)
          hideLoading()
          showToast({
            title: '音频上传失败，请重试',
            icon: 'none'
          })
          return
        }
      } 
      // 如果是上传的音频
      else if (uploadedAudio.value) {
        try {
          // 上传音频到OSS
          const audioUrl = await uploadFileToOss(uploadedAudio.value.file, 'digital-human/audios')
          params.append('audio', audioUrl);
        } catch (uploadError) {
          console.error('音频上传失败:', uploadError)
          hideLoading()
          showToast({
            title: '音频上传失败，请重试',
            icon: 'none'
          })
          return
        }
      }
    }
    
    console.log('提交创建请求参数:', Object.fromEntries(params.entries()))
    
    // 使用正确的API接口
    const response = await videoApi.generate(params)
    
    hideLoading()
    
    // 添加详细日志
    console.log('创建响应类型:', typeof response)
    console.log('创建响应内容:', JSON.stringify(response))
    
    // 处理直接返回字符串的情况（如"taskId"）
    if (typeof response === 'string') {
      console.log('收到任务ID:', response)
      showToast({
        title: '视频合成任务已提交',
        icon: 'success'
      })
      
      // 跳转到作品页面
      setTimeout(() => {
        router.push('/pages/works/index')
      }, 1500)
      return;
    }
    
    // 直接检查状态码是否为200，不抛出异常
    if (response && response.code === 200) {
      showToast({
        title: '视频合成任务已提交',
        icon: 'success'
      })
      
      // 跳转到作品页面
      setTimeout(() => {
        router.push('/pages/works/index')
      }, 1500)
      return;
    }
    
    // 如果没有直接返回，尝试更复杂的判断
    let isSuccess = false;
    
    // 检查各种可能的成功状态格式
    if (response) {
      if (response.success === true) {
        isSuccess = true;
      } else if (response.data && response.data.code === 200) {
        isSuccess = true;
      } else if (response.data && (typeof response.data === 'number' || typeof response.data === 'string')) {
        // 如果data是一个数字或字符串（可能是任务ID），也视为成功
        isSuccess = true;
      }
    }
    
    if (isSuccess) {
      showToast({
        title: '视频合成任务已提交',
        icon: 'success'
      })
      
      // 跳转到作品页面
      setTimeout(() => {
        router.push('/pages/works/index')
      }, 1500)
    } else {
      // 不要抛出异常，直接显示错误信息
      console.error('创建失败:', response)
      showToast({
        title: typeof response === 'object' && response?.message ? response.message : '创建失败，请重试',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('创建错误:', error)
    hideLoading()
    showToast({
      title: error.message || '创建失败，请重试',
      icon: 'none'
    })
  }
}

// 显示音色选择弹窗
const showVoiceModal = () => {
  showVoiceSelection.value = true
  // 如果还没有获取过音色列表，就获取一次
  if (systemVoices.value.length === 0) {
    fetchVoices()
  }
}

// 隐藏音色选择弹窗
const hideVoiceModal = () => {
  showVoiceSelection.value = false
}

// 切换音频来源
const switchAudioSource = (source) => {
  // 如果切换音频源，先暂停当前播放
  if (isAudioPlaying.value && recordedAudio.value) {
    recordedAudio.value.pause()
    isAudioPlaying.value = false
  }
  
  if (isUploadedAudioPlaying.value && uploadedAudioElement.value) {
    uploadedAudioElement.value.pause()
    isUploadedAudioPlaying.value = false
  }
  
  audioSource.value = source
}

// 页面加载时获取形象列表并检查来源
onMounted(() => {
  fetchAvatarList()
  
  // 通过路由历史判断是否从TabBar进入
  const fromPath = router.options.history.state.back
  console.log('来源路径:', fromPath)
  
  // 如果是从首页相关路径进入，或者有fromHome参数，则隐藏导航栏
  if (
    fromPath && (
      fromPath.includes('/pages/index') || 
      fromPath.includes('/pages/asset') || 
      fromPath.includes('/pages/works') || 
      fromPath.includes('/pages/my')
    ) || 
    route.query.fromHome === 'true'
  ) {
    showNavBar.value = false
  }
})
</script>

<style scoped>
/* 基础样式 */
.synthesis-page {
  background-color: #111827;
  color: #fff;
  height: 100vh;
  max-height: 100vh;
  font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  padding-bottom: 70px; /* 增加底部间距，确保内容不被遮挡 */
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* 允许页面滚动 */
  overflow-x: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 0;
}

.synthesis-page.no-nav {
  padding-top: 0;
}

/* 顶部导航栏 */
.nav-bar {
  display: none; /* 隐藏原来的导航栏 */
}

/* 新增顶部横条 */
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #1a202e;
  position: relative;
  height: 50px;
}

.back-btn {
  font-size: 20px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.header-title {
  font-size: 18px;
  font-weight: 500;
  flex-grow: 1;
  text-align: center;
}

.placeholder-div {
  width: 30px; /* 与返回按钮宽度相同，保持标题居中 */
}

/* 视频标题输入 - 移到顶部 */
.title-input-box {
  margin: 10px 10px 8px 10px;
  background: #1a202e;
  border-radius: 10px;
  padding: 12px 15px;
  border: 1px solid #3a3f5a;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.title-input-label {
  font-size: 14px;
  color: #a3aaff;
  margin-bottom: 5px;
  font-weight: 500;
}

.title-input {
  width: 100%;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.title-input::placeholder {
  color: #666;
}

.title-input:focus {
  outline: none;
}

/* 形象选择提示 */
.section-title {
  padding: 8px 16px;
  font-size: 16px;
  color: #a3aaff;
  font-weight: 500;
}

/* 视频卡片区域 */
.video-cards {
  display: flex;
  gap: 8px;
  padding: 0 10px 8px 10px;
  margin-bottom: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  max-height: 160px; /* 减小高度 */
  flex-shrink: 0; /* 防止被压缩 */
}
.video-cards::-webkit-scrollbar {
  display: none;
}
.video-card {
  position: relative;
  width: 100px;
  height: 150px; /* 减小高度 */
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid transparent;
  transition: border 0.2s, transform 0.2s;
}
.video-card.selected {
  border: 2px solid #7a7cff;
  transform: scale(1.05);
}
.video-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.video-text {
  position: absolute;
  bottom: 40px;
  left: 0;
  width: 100%;
  padding: 5px;
  background: rgba(0, 0, 0, 0.5);
  font-size: 12px;
  text-align: center;
}
.select-indicator {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.select-indicator.active {
  background: rgba(255, 255, 255, 0.8);
}
.indicator-circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #fff;
}
.empty-tip {
  width: 100%;
  padding: 20px;
  text-align: center;
  color: #666;
}

/* 驱动方式选择 */
.drive-options {
  display: flex;
  margin: 0 10px 8px 10px;
  border-radius: 30px;
  overflow: hidden;
}
.drive-option {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  background: #1a202e;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}
.drive-option.active {
  background: linear-gradient(90deg, #7a7cff, #4e5cff);
  color: #fff;
  font-weight: 500;
}

/* AI文本驱动区域 */
.text-drive-area {
  margin: 0 10px 8px 10px;
  background: #1a202e;
  border-radius: 10px;
  padding: 10px;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  border: 1px solid #2a3042;
  min-height: 150px; /* 减小最小高度 */
  height: 275px; /* 增加四分之一的高度，从220px到275px */
  overflow: hidden; /* 防止内容溢出 */
}
.text-area {
  width: 100%;
  flex: 1;
  min-height: 100px; /* 减小最小高度 */
  background: #141b2d;
  border: 1px solid #3a3f5a;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  resize: none;
  padding: 10px;
  margin-bottom: 8px;
  overflow-y: auto;
  box-sizing: border-box; /* 确保padding不会增加宽度 */
}
.text-area::placeholder {
  color: #666;
}
.text-area:focus {
  outline: none;
}
.text-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  width: 100%; /* 确保不超出父容器 */
}
.btn-voice-color, .btn-write {
  background: transparent;
  border: none;
  color: #7a7cff;
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap; /* 防止文本换行 */
}
.voice-icon, .write-icon {
  margin-right: 5px;
}
.text-count {
  color: #666;
  font-size: 14px;
}

/* 语音驱动区域改版 */
.voice-record-area {
  margin: 0 10px 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: calc(100vh - 450px);
  min-height: 150px;
  overflow: hidden;
}

.voice-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-section {
  background: #1a202e;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  border: 1px solid #2a3042;
  align-items: center;
  max-height: calc(100vh - 450px);
  overflow-y: auto;
}

.record-title {
  font-size: 15px;
  color: #a3aaff;
  margin-bottom: 12px;
  font-weight: 500;
  align-self: flex-start;
}

.record-time {
  font-size: 20px;
  font-weight: bold;
  color: #7a7cff;
  margin-top: 10px;
  margin-bottom: 15px;
}

.record-tip {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
  width: 100%;
}

.highlight {
  color: #7a7cff;
}

.record-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.record-btn-container {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.record-btn-large {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7a7cff, #4e5cff);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(122, 124, 255, 0.4);
  z-index: 2;
}

.record-progress {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.mic-icon {
  font-size: 28px;
  color: #fff;
}

/* 上传音频选项 */
.upload-option {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  cursor: pointer;
  margin-bottom: 10px;
  border: 1px dashed #3a3f5a;
}

.upload-option:active {
  background: rgba(255, 255, 255, 0.1);
}

.upload-icon-small {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(122, 124, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.plus-icon-small {
  font-size: 16px;
  color: #7a7cff;
}

.upload-text-small {
  color: #7a7cff;
  font-size: 14px;
}

.audio-tip {
  color: #999;
  font-size: 12px;
  text-align: center;
  margin-bottom: 5px;
  padding: 0 10px;
}

/* 音频播放器样式 */
.audio-player {
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  width: 100%;
  margin-top: 10px;
}

.audio-file-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.audio-file-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(122, 124, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.audio-file-icon svg {
  fill: #7a7cff;
  width: 20px;
  height: 20px;
}

.audio-file-name {
  color: #fff;
  font-size: 14px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.audio-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.play-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7a7cff, #4e5cff);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.play-btn svg {
  fill: #fff;
  width: 20px;
  height: 20px;
}

.audio-progress-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.audio-progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.audio-progress {
  height: 100%;
  background: linear-gradient(90deg, #7a7cff, #4e5cff);
  border-radius: 2px;
}

.audio-time {
  font-size: 12px;
  color: #999;
  text-align: left;
}

.delete-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.delete-btn svg {
  fill: #ff5252;
  width: 18px;
  height: 18px;
}

/* 底部创建按钮 */
.create-btn {
  margin: 10px 10px 10px 10px;
  position: fixed;
  bottom: 10px;
  left: 0;
  right: 0;
  padding: 14px 0;
  background: linear-gradient(90deg, #7a7cff, #4e5cff);
  border-radius: 10px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(122, 124, 255, 0.3);
  transition: transform 0.2s;
  z-index: 10;
}
.create-btn:active {
  transform: scale(0.98);
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
}

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
}

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
}

.voice-modal-close svg {
  fill: #fff;
  width: 20px;
  height: 20px;
}

.voice-modal-close:active {
  background: rgba(255, 255, 255, 0.2);
}

.voice-tabs {
  display: flex;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.voice-tab {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.5);
  position: relative;
}

.voice-tab.active {
  color: #6f4cff;
  font-weight: 600;
}

.voice-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 25%;
  width: 50%;
  height: 3px;
  background: linear-gradient(to right, #6f4cff, #2f70ed);
  border-radius: 3px;
}

.voice-option {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.voice-option.selected {
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
}

.indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(to right, #6f4cff, #2f70ed);
}

.voice-info {
  flex: 1;
}

.voice-name {
  font-size: 15px;
  color: #fff;
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
}

.voice-play svg {
  fill: #fff;
  width: 20px;
  height: 20px;
}

.voice-play:active {
  transform: scale(0.95);
}

.voice-modal-footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px 20px;
  background: linear-gradient(to top, #111827, rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0));
}

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
}

.confirm-button:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
  animation: shine 2s infinite;
}

.confirm-button:active {
  opacity: 0.9;
}

.confirm-button.disabled {
  opacity: 0.5;
}

.confirm-button.disabled:before {
  animation: none;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>
