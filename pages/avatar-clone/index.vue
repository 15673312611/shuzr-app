<template>
  <view class="container">
    <view class="upload-section">
      <view class="upload-box" @click="handleUpload" v-if="!imageUrl">
        <u-icon name="camera-fill" size="48" color="#35c8a9"></u-icon>
        <text class="upload-text">上传照片</text>
        <text class="upload-desc">支持jpg、png格式，大小不超过5MB</text>
      </view>
      <view class="preview-box" v-else>
        <image :src="imageUrl" mode="aspectFill" />
        <view class="preview-mask">
          <u-icon name="trash" size="32" color="#ffffff" @click="handleDelete"></u-icon>
        </view>
      </view>
    </view>

    <view class="tips-section">
      <view class="tips-title">
        <u-icon name="info-circle" size="24" color="#35c8a9"></u-icon>
        <text>拍摄建议</text>
      </view>
      <view class="tips-content">
        <text>1. 请上传清晰的正面照片</text>
        <text>2. 光线充足，避免背光</text>
        <text>3. 面部表情自然</text>
        <text>4. 避免佩戴墨镜等遮挡物</text>
      </view>
    </view>

    <view class="result-section" v-if="generatedUrl">
      <text class="result-title">生成结果</text>
      <view class="result-image">
        <image :src="generatedUrl" mode="aspectFill" />
      </view>
      <view class="result-actions">
        <u-button type="primary" text="保存到相册" @click="handleSave"></u-button>
        <u-button type="info" text="重新生成" @click="handleRegenerate"></u-button>
      </view>
    </view>

    <view class="bottom-button" v-if="imageUrl && !generating && !generatedUrl">
      <u-button type="primary" text="开始生成" @click="handleGenerate" :loading="generating"></u-button>
    </view>

    <!-- 生成进度弹窗 -->
    <u-popup :show="generating" mode="center" :closeable="false" :mask-close-able="false">
      <view class="progress-popup">
        <u-loading-icon size="48" color="#35c8a9"></u-loading-icon>
        <text class="progress-text">正在生成中 ({{ progress }}%)</text>
        <text class="progress-desc">请耐心等待，预计需要1-2分钟</text>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { avatarApi } from '@/api/services'

const imageUrl = ref('')
const generating = ref(false)
const progress = ref(0)
const generatedUrl = ref('')

// 上传图片
const handleUpload = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0]
      
      // 检查文件大小
      const { size } = await uni.getFileInfo({
        filePath: tempFilePath
      })
      
      if (size > 5 * 1024 * 1024) {
        uni.showToast({
          title: '图片大小不能超过5MB',
          icon: 'none'
        })
        return
      }
      
      imageUrl.value = tempFilePath
    }
  })
}

// 删除图片
const handleDelete = () => {
  imageUrl.value = ''
  generatedUrl.value = ''
}

// 开始生成
const handleGenerate = async () => {
  try {
    generating.value = true
    progress.value = 0
    
    // 上传图片
    const { taskId } = await avatarApi.uploadImage({
      image: imageUrl.value
    })
    
    // 轮询获取进度
    const timer = setInterval(async () => {
      const { progress: currentProgress, status, result } = await avatarApi.getProgress(taskId)
      progress.value = currentProgress
      
      if (status === 'completed') {
        clearInterval(timer)
        generating.value = false
        generatedUrl.value = result.url
        
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

// 保存到相册
const handleSave = () => {
  uni.saveImageToPhotosAlbum({
    filePath: generatedUrl.value,
    success: () => {
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })
    },
    fail: () => {
      uni.showToast({
        title: '保存失败',
        icon: 'none'
      })
    }
  })
}

// 重新生成
const handleRegenerate = () => {
  generatedUrl.value = ''
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #000000;
  padding: 20rpx;
}

.upload-section {
  margin: 40rpx 0;
  
  .upload-box {
    width: 100%;
    height: 400rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20rpx;
    
    .upload-text {
      font-size: 32rpx;
      color: #ffffff;
      font-weight: bold;
    }
    
    .upload-desc {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.6);
    }
  }
  
  .preview-box {
    width: 100%;
    height: 400rpx;
    border-radius: 16rpx;
    overflow: hidden;
    position: relative;
    
    image {
      width: 100%;
      height: 100%;
    }
    
    .preview-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
      
      &:active {
        opacity: 1;
      }
    }
  }
}

.tips-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  
  .tips-title {
    display: flex;
    align-items: center;
    gap: 10rpx;
    margin-bottom: 20rpx;
    
    text {
      font-size: 28rpx;
      color: #ffffff;
      font-weight: bold;
    }
  }
  
  .tips-content {
    display: flex;
    flex-direction: column;
    gap: 10rpx;
    
    text {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.result-section {
  margin: 40rpx 0;
  
  .result-title {
    font-size: 32rpx;
    color: #ffffff;
    font-weight: bold;
    margin-bottom: 20rpx;
  }
  
  .result-image {
    width: 100%;
    height: 400rpx;
    border-radius: 16rpx;
    overflow: hidden;
    margin-bottom: 30rpx;
    
    image {
      width: 100%;
      height: 100%;
    }
  }
  
  .result-actions {
    display: flex;
    gap: 20rpx;
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
</style> 