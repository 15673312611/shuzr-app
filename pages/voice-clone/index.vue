<template>
  <view class="container">
    <!-- 录音区域 -->
    <view class="record-section">
      <view class="record-title">
        <text>录制声音样本</text>
        <text class="record-subtitle">请朗读以下文本，时长15-30秒</text>
      </view>
      
      <view class="sample-text">
        <text>{{ sampleText }}</text>
      </view>
      
      <view class="record-actions">
        <view class="record-button" @touchstart="handleStartRecord" @touchend="handleStopRecord">
          <u-icon :name="recording ? 'pause-circle' : 'mic'" size="64" color="#35c8a9"></u-icon>
          <text>{{ recording ? '松开结束' : '按住录音' }}</text>
        </view>
      </view>
      
      <view class="record-tips">
        <text>温馨提示：</text>
        <text>1. 请在安静的环境下录音</text>
        <text>2. 语速保持正常，语气自然</text>
        <text>3. 避免背景噪音干扰</text>
      </view>
    </view>

    <!-- 录音列表 -->
    <view class="record-list" v-if="recordList.length > 0">
      <view class="list-title">
        <text>已录制 ({{ recordList.length }}/3)</text>
        <text class="clear-btn" @click="handleClearAll">清空</text>
      </view>
      
      <view 
        class="record-item" 
        v-for="(item, index) in recordList" 
        :key="index"
      >
        <view class="record-info">
          <text class="record-name">录音{{ index + 1 }}</text>
          <text class="record-time">{{ item.duration }}秒</text>
        </view>
        
        <view class="record-controls">
          <u-icon 
            :name="item.playing ? 'pause' : 'play-right'" 
            size="32" 
            color="#35c8a9"
            @click="handlePlayRecord(index)"
          ></u-icon>
          <u-icon 
            name="trash" 
            size="32" 
            color="#ff4d4f"
            @click="handleDeleteRecord(index)"
          ></u-icon>
        </view>
      </view>
    </view>

    <!-- 生成按钮 -->
    <view class="bottom-button" v-if="recordList.length >= 1">
      <u-button 
        type="primary" 
        text="开始生成" 
        @click="handleGenerate"
        :loading="generating"
      ></u-button>
    </view>

    <!-- 生成进度弹窗 -->
    <u-popup :show="generating" mode="center" :closeable="false" :mask-close-able="false">
      <view class="progress-popup">
        <u-loading-icon size="48" color="#35c8a9"></u-loading-icon>
        <text class="progress-text">正在生成中 ({{ progress }}%)</text>
        <text class="progress-desc">请耐心等待，预计需要2-3分钟</text>
      </view>
    </u-popup>

    <!-- 试听弹窗 -->
    <u-popup :show="showPreview" mode="center" @close="handleClosePreview">
      <view class="preview-popup">
        <view class="preview-title">
          <text>试听结果</text>
        </view>
        
        <view class="preview-content">
          <u-icon 
            :name="playing ? 'pause' : 'play-right'" 
            size="48" 
            color="#35c8a9"
            @click="handlePlayPreview"
          ></u-icon>
          
          <view class="preview-text">
            <text>{{ previewText }}</text>
          </view>
        </view>
        
        <view class="preview-actions">
          <u-button type="primary" text="确认使用" @click="handleConfirm"></u-button>
          <u-button type="info" text="重新生成" @click="handleRegenerate"></u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { voiceApi } from '@/api/services'

const sampleText = ref('欢迎使用数字人声音克隆功能，通过录制您的声音样本，我们可以为您生成一个专属的AI声音。您可以使用这个声音来进行视频配音、语音播报等多种用途。')
const recording = ref(false)
const recordList = ref([])
const generating = ref(false)
const progress = ref(0)
const showPreview = ref(false)
const playing = ref(false)
const previewText = ref('您好，这是您的专属AI声音。现在正在进行试听，您觉得效果如何？')
let recorderManager = null
let audioContext = null

// 初始化录音管理器
const initRecorder = () => {
  recorderManager = uni.getRecorderManager()
  
  recorderManager.onStart(() => {
    console.log('开始录音')
  })
  
  recorderManager.onStop((res) => {
    const { tempFilePath, duration } = res
    recordList.value.push({
      path: tempFilePath,
      duration: Math.round(duration / 1000),
      playing: false
    })
  })
}

// 初始化音频上下文
const initAudioContext = () => {
  audioContext = uni.createInnerAudioContext()
  
  audioContext.onEnded(() => {
    playing.value = false
    recordList.value.forEach(item => {
      item.playing = false
    })
  })
}

// 开始录音
const handleStartRecord = () => {
  if (recordList.value.length >= 3) {
    uni.showToast({
      title: '最多录制3段声音',
      icon: 'none'
    })
    return
  }
  
  recording.value = true
  recorderManager.start({
    duration: 30000,
    sampleRate: 44100,
    numberOfChannels: 1,
    encodeBitRate: 192000,
    format: 'mp3'
  })
}

// 停止录音
const handleStopRecord = () => {
  recording.value = false
  recorderManager.stop()
}

// 播放录音
const handlePlayRecord = (index) => {
  const record = recordList.value[index]
  
  recordList.value.forEach((item, i) => {
    if (i !== index) {
      item.playing = false
    }
  })
  
  if (record.playing) {
    audioContext.stop()
    record.playing = false
  } else {
    audioContext.src = record.path
    audioContext.play()
    record.playing = true
  }
}

// 删除录音
const handleDeleteRecord = (index) => {
  recordList.value.splice(index, 1)
}

// 清空录音
const handleClearAll = () => {
  recordList.value = []
}

// 开始生成
const handleGenerate = async () => {
  try {
    generating.value = true
    progress.value = 0
    
    // 上传声音样本
    const formData = new FormData()
    recordList.value.forEach((record, index) => {
      formData.append(`sample${index + 1}`, record.path)
    })
    
    const { taskId } = await voiceApi.uploadSample(formData)
    
    // 生成声音
    const { voiceId } = await voiceApi.generate({
      taskId,
      text: previewText.value
    })
    
    // 轮询获取进度
    const timer = setInterval(async () => {
      const { progress: currentProgress, status, result } = await voiceApi.getProgress(voiceId)
      progress.value = currentProgress
      
      if (status === 'completed') {
        clearInterval(timer)
        generating.value = false
        audioContext.src = result.url
        showPreview.value = true
        
        uni.showToast({
          title: '生成成功',
          icon: 'success'
        })
      } else if (status === 'failed') {
        clearInterval(timer)
        generating.value = false
        
        uni.showToast({
          title: '生成失败，请重试',
          icon: 'none'
        })
      }
    }, 2000)
  } catch (error) {
    generating.value = false
    uni.showToast({
      title: error.message || '生成失败',
      icon: 'none'
    })
  }
}

// 播放预览
const handlePlayPreview = () => {
  if (playing.value) {
    audioContext.pause()
    playing.value = false
  } else {
    audioContext.play()
    playing.value = true
  }
}

// 关闭预览
const handleClosePreview = () => {
  showPreview.value = false
  playing.value = false
  audioContext.stop()
}

// 确认使用
const handleConfirm = () => {
  showPreview.value = false
  playing.value = false
  audioContext.stop()
  
  uni.showToast({
    title: '声音已保存',
    icon: 'success'
  })
  
  // 返回上一页
  uni.navigateBack()
}

// 重新生成
const handleRegenerate = () => {
  showPreview.value = false
  playing.value = false
  audioContext.stop()
  handleGenerate()
}

// 页面加载
onMounted(() => {
  initRecorder()
  initAudioContext()
})

// 页面卸载
onUnmounted(() => {
  if (audioContext) {
    audioContext.destroy()
  }
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #000000;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.record-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  
  .record-title {
    margin-bottom: 20rpx;
    
    text {
      font-size: 32rpx;
      color: #ffffff;
      font-weight: bold;
    }
    
    .record-subtitle {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.6);
      margin-left: 16rpx;
    }
  }
  
  .sample-text {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 30rpx;
    
    text {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.6;
    }
  }
  
  .record-actions {
    display: flex;
    justify-content: center;
    margin-bottom: 30rpx;
    
    .record-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16rpx;
      
      text {
        font-size: 28rpx;
        color: #ffffff;
      }
    }
  }
  
  .record-tips {
    display: flex;
    flex-direction: column;
    gap: 10rpx;
    
    text {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.6);
      
      &:first-child {
        color: #ffffff;
        margin-bottom: 6rpx;
      }
    }
  }
}

.record-list {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 30rpx;
  
  .list-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    text {
      font-size: 28rpx;
      color: #ffffff;
    }
    
    .clear-btn {
      font-size: 24rpx;
      color: #ff4d4f;
    }
  }
  
  .record-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12rpx;
    margin-bottom: 16rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .record-info {
      .record-name {
        font-size: 28rpx;
        color: #ffffff;
        margin-bottom: 8rpx;
      }
      
      .record-time {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.6);
      }
    }
    
    .record-controls {
      display: flex;
      gap: 20rpx;
    }
  }
}

.bottom-button {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx;
  background: #000000;
}

.progress-popup {
  background: #ffffff;
  padding: 40rpx;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  
  .progress-text {
    font-size: 28rpx;
    color: #333333;
    font-weight: bold;
  }
  
  .progress-desc {
    font-size: 24rpx;
    color: #999999;
  }
}

.preview-popup {
  background: #ffffff;
  padding: 30rpx;
  border-radius: 16rpx;
  width: 600rpx;
  
  .preview-title {
    text-align: center;
    margin-bottom: 30rpx;
    
    text {
      font-size: 32rpx;
      color: #333333;
      font-weight: bold;
    }
  }
  
  .preview-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30rpx;
    margin-bottom: 40rpx;
    
    .preview-text {
      background: #f5f5f5;
      border-radius: 12rpx;
      padding: 20rpx;
      
      text {
        font-size: 28rpx;
        color: #333333;
        line-height: 1.6;
      }
    }
  }
  
  .preview-actions {
    display: flex;
    gap: 20rpx;
  }
}
</style> 