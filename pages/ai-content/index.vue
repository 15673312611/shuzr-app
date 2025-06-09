<template>
  <view class="container">
    <!-- 模板选择 -->
    <view class="template-section">
      <view class="section-title">选择模板</view>
      <scroll-view scroll-x class="template-list">
        <view 
          class="template-item"
          v-for="item in templates"
          :key="item.id"
          :class="{ active: selectedTemplate?.id === item.id }"
          @click="handleSelectTemplate(item)"
        >
          <u-icon :name="item.icon" size="32" color="#35c8a9"></u-icon>
          <text>{{ item.name }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 参数配置 -->
    <view class="params-section" v-if="selectedTemplate">
      <view class="section-title">参数配置</view>
      <view class="params-form">
        <view 
          class="param-item"
          v-for="field in selectedTemplate.fields"
          :key="field.key"
        >
          <text class="param-label">{{ field.label }}</text>
          <template v-if="field.type === 'input'">
            <u-input
              v-model="formData[field.key]"
              :placeholder="field.placeholder"
              border="bottom"
            ></u-input>
          </template>
          <template v-else-if="field.type === 'textarea'">
            <u-textarea
              v-model="formData[field.key]"
              :placeholder="field.placeholder"
              :maxlength="500"
              count
            ></u-textarea>
          </template>
          <template v-else-if="field.type === 'select'">
            <u-radio-group v-model="formData[field.key]">
              <u-radio
                v-for="option in field.options"
                :key="option.value"
                :name="option.value"
                :label="option.label"
              ></u-radio>
            </u-radio-group>
          </template>
        </view>
      </view>
    </view>

    <!-- 生成结果 -->
    <view class="result-section" v-if="content">
      <view class="section-title">
        生成结果
        <text class="regenerate-btn" @click="handleRegenerate">重新生成</text>
      </view>
      <view class="result-content">
        <text>{{ content }}</text>
      </view>
      <view class="result-actions">
        <u-button 
          type="primary" 
          icon="copy" 
          text="复制文案" 
          @click="handleCopy"
        ></u-button>
        <u-button 
          type="info" 
          icon="star" 
          text="收藏文案" 
          @click="handleCollect"
        ></u-button>
      </view>
    </view>

    <!-- 生成按钮 -->
    <view class="bottom-button" v-if="selectedTemplate && !generating && !content">
      <u-button 
        type="primary" 
        text="开始生成" 
        @click="handleGenerate"
        :loading="generating"
      ></u-button>
    </view>

    <!-- 生成中弹窗 -->
    <u-popup :show="generating" mode="center" :closeable="false" :mask-close-able="false">
      <view class="generating-popup">
        <u-loading-icon size="48" color="#35c8a9"></u-loading-icon>
        <text>正在生成中，请稍候...</text>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { contentApi } from '@/api/services'

// 模板数据
const templates = ref([
  {
    id: 1,
    name: '短视频文案',
    icon: 'video',
    fields: [
      { key: 'topic', label: '主题', type: 'input', placeholder: '请输入视频主题' },
      { key: 'style', label: '风格', type: 'select', options: [
        { label: '搞笑', value: 'funny' },
        { label: '严肃', value: 'serious' },
        { label: '温情', value: 'warm' }
      ]},
      { key: 'keywords', label: '关键词', type: 'input', placeholder: '请输入关键词，用逗号分隔' }
    ]
  },
  {
    id: 2,
    name: '营销文案',
    icon: 'shopping-cart',
    fields: [
      { key: 'product', label: '产品名称', type: 'input', placeholder: '请输入产品名称' },
      { key: 'features', label: '产品特点', type: 'textarea', placeholder: '请输入产品特点' },
      { key: 'target', label: '目标人群', type: 'input', placeholder: '请输入目标人群' }
    ]
  },
  {
    id: 3,
    name: '朋友圈文案',
    icon: 'chat',
    fields: [
      { key: 'mood', label: '心情', type: 'select', options: [
        { label: '开心', value: 'happy' },
        { label: '感慨', value: 'emotion' },
        { label: '励志', value: 'motivation' }
      ]},
      { key: 'scene', label: '场景', type: 'input', placeholder: '请输入场景描述' }
    ]
  }
])

const selectedTemplate = ref(null)
const formData = reactive({})
const generating = ref(false)
const content = ref('')

// 选择模板
const handleSelectTemplate = (template) => {
  selectedTemplate.value = template
  // 初始化表单数据
  template.fields.forEach(field => {
    if (field.type === 'select') {
      formData[field.key] = field.options[0].value
    } else {
      formData[field.key] = ''
    }
  })
  content.value = ''
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
    
    const { content: generatedContent } = await contentApi.generate({
      templateId: selectedTemplate.value.id,
      ...formData
    })
    
    content.value = generatedContent
    
    uni.showToast({
      title: '生成成功',
      icon: 'success'
    })
  } catch (error) {
    uni.showToast({
      title: error.message || '生成失败',
      icon: 'none'
    })
  } finally {
    generating.value = false
  }
}

// 重新生成
const handleRegenerate = () => {
  content.value = ''
  handleGenerate()
}

// 复制文案
const handleCopy = () => {
  uni.setClipboardData({
    data: content.value,
    success: () => {
      uni.showToast({
        title: '复制成功',
        icon: 'success'
      })
    }
  })
}

// 收藏文案
const handleCollect = () => {
  uni.showToast({
    title: '收藏成功',
    icon: 'success'
  })
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #000000;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.section-title {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: bold;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .regenerate-btn {
    font-size: 24rpx;
    color: #35c8a9;
    font-weight: normal;
  }
}

.template-section {
  margin-bottom: 40rpx;
  
  .template-list {
    white-space: nowrap;
    
    .template-item {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 12rpx;
      padding: 20rpx;
      margin-right: 20rpx;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16rpx;
      min-width: 160rpx;
      
      &.active {
        background: rgba(53, 200, 169, 0.2);
        border: 2rpx solid #35c8a9;
      }
      
      text {
        font-size: 28rpx;
        color: #ffffff;
      }
    }
  }
}

.params-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  
  .params-form {
    .param-item {
      margin-bottom: 30rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .param-label {
        font-size: 28rpx;
        color: #ffffff;
        margin-bottom: 16rpx;
        display: block;
      }
    }
  }
}

.result-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  
  .result-content {
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

.generating-popup {
  background: #ffffff;
  padding: 40rpx;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  
  text {
    font-size: 28rpx;
    color: #333333;
  }
}
</style> 