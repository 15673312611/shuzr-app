<template>
  <view class="container">
    <!-- 视频模板列表 -->
    <scroll-view scroll-y class="template-list">
      <view 
        class="template-item" 
        v-for="item in templates" 
        :key="item.id"
        :class="{ active: selectedTemplate?.id === item.id }"
        @click="handleSelectTemplate(item)"
      >
        <video 
          class="template-video" 
          :src="item.previewUrl"
          :poster="item.coverUrl"
          object-fit="cover"
        ></video>
        <view class="template-info">
          <text class="template-name">{{ item.name }}</text>
          <text class="template-duration">{{ item.duration }}秒</text>
        </view>
      </view>
    </scroll-view>

    <!-- 参数设置 -->
    <view class="settings-section" v-if="selectedTemplate">
      <view class="settings-header">
        <text class="settings-title">参数设置</text>
      </view>
      
      <!-- 文本输入 -->
      <view class="setting-item" v-for="field in selectedTemplate.fields" :key="field.key">
        <text class="setting-label">{{ field.label }}</text>
        <u-input
          v-model="formData[field.key]"
          :placeholder="field.placeholder"
          border="bottom"
        ></u-input>
      </view>

      <!-- 背景音乐选择 -->
      <view class="setting-item">
        <text class="setting-label">背景音乐</text>
        <u-radio-group v-model="formData.bgm">
          <u-radio 
            v-for="music in bgmList" 
            :key="music.id"
            :name="music.id"
            :label="music.name"
          ></u-radio>
        </u-radio-group>
      </view>
    </view>

    <!-- 生成按钮 -->
    <view class="bottom-button" v-if="selectedTemplate">
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
        <text class="progress-desc">请耐心等待，预计需要3-5分钟</text>
      </view>
    </u-popup>

    <!-- 生成结果弹窗 -->
    <u-popup :show="showResult" mode="center" @close="handleCloseResult">
      <view class="result-popup">
        <video 
          class="result-video"
          :src="resultUrl"
          :poster="resultCover"
          object-fit="contain"
          controls
        ></video>
        <view class="result-actions">
          <u-button type="primary" text="保存到相册" @click="handleSave"></u-button>
          <u-button type="info" text="重新生成" @click="handleRegenerate"></u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { videoApi } from '@/api/services'

// 模板数据
const templates = ref([
  {
    id: 1,
    name: '商务展示',
    previewUrl: 'https://example.com/preview1.mp4',
    coverUrl: 'https://example.com/cover1.jpg',
    duration: 15,
    fields: [
      { key: 'title', label: '标题', placeholder: '请输入视频标题' },
      { key: 'subtitle', label: '副标题', placeholder: '请输入副标题' }
    ]
  },
  {
    id: 2,
    name: '产品介绍',
    previewUrl: 'https://example.com/preview2.mp4',
    coverUrl: 'https://example.com/cover2.jpg',
    duration: 30,
    fields: [
      { key: 'productName', label: '产品名称', placeholder: '请输入产品名称' },
      { key: 'description', label: '产品描述', placeholder: '请输入产品描述' }
    ]
  }
])

// 背景音乐列表
const bgmList = ref([
  { id: 1, name: '轻快节奏' },
  { id: 2, name: '优雅舒缓' },
  { id: 3, name: '激情动感' }
])

const selectedTemplate = ref(null)
const formData = reactive({})
const generating = ref(false)
const progress = ref(0)
const showResult = ref(false)
const resultUrl = ref('')
const resultCover = ref('')

// 选择模板
const handleSelectTemplate = (template) => {
  selectedTemplate.value = template
  // 初始化表单数据
  formData.bgm = bgmList.value[0].id
  template.fields.forEach(field => {
    formData[field.key] = ''
  })
}

// 开始生成
const handleGenerate = async () => {
  // 验证表单
  const hasEmptyField = selectedTemplate.value.fields.some(field => !formData[field.key])
  if (hasEmptyField) {
    uni.showToast({
      title: '请填写完整参数',
      icon: 'none'
    })
    return
  }

  try {
    generating.value = true
    progress.value = 0

    // 生成视频
    const { taskId } = await videoApi.generate({
      templateId: selectedTemplate.value.id,
      ...formData
    })

    // 轮询获取进度
    const timer = setInterval(async () => {
      const { progress: currentProgress, status, result } = await videoApi.getProgress(taskId)
      progress.value = currentProgress

      if (status === 'completed') {
        clearInterval(timer)
        generating.value = false
        resultUrl.value = result.url
        resultCover.value = result.coverUrl
        showResult.value = true

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

// 关闭结果弹窗
const handleCloseResult = () => {
  showResult.value = false
}

// 保存到相册
const handleSave = () => {
  uni.saveVideoToPhotosAlbum({
    filePath: resultUrl.value,
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
  showResult.value = false
  resultUrl.value = ''
  resultCover.value = ''
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #000000;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.template-list {
  height: 300rpx;
  white-space: nowrap;
  
  .template-item {
    display: inline-block;
    width: 240rpx;
    margin-right: 20rpx;
    border-radius: 16rpx;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
    
    &.active {
      border: 2rpx solid #35c8a9;
    }
    
    .template-video {
      width: 100%;
      height: 200rpx;
    }
    
    .template-info {
      padding: 16rpx;
      
      .template-name {
        font-size: 28rpx;
        color: #ffffff;
        margin-bottom: 8rpx;
      }
      
      .template-duration {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
}

.settings-section {
  margin-top: 40rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 30rpx;
  
  .settings-header {
    margin-bottom: 30rpx;
    
    .settings-title {
      font-size: 32rpx;
      color: #ffffff;
      font-weight: bold;
    }
  }
  
  .setting-item {
    margin-bottom: 30rpx;
    
    .setting-label {
      font-size: 28rpx;
      color: #ffffff;
      margin-bottom: 16rpx;
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

.result-popup {
  background: #ffffff;
  padding: 30rpx;
  border-radius: 16rpx;
  width: 600rpx;
  
  .result-video {
    width: 100%;
    height: 400rpx;
    margin-bottom: 30rpx;
  }
  
  .result-actions {
    display: flex;
    gap: 20rpx;
  }
}
</style> 