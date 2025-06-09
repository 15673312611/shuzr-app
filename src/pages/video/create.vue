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
          <text class="title">视频合成</text>
        </view>
      </view>
      
      <!-- 表单内容 -->
      <view class="form-container">
        <!-- 步骤指示器 -->
        <view class="step-indicator">
          <view class="step" :class="{ 'active': currentStep === 1, 'completed': currentStep > 1 }">
            <view class="step-number">1</view>
            <text class="step-text">选择视频</text>
          </view>
          <view class="step-line" :class="{ 'active': currentStep > 1 }"></view>
          <view class="step" :class="{ 'active': currentStep === 2, 'completed': currentStep > 2 }">
            <view class="step-number">2</view>
            <text class="step-text">选择音频</text>
          </view>
          <view class="step-line" :class="{ 'active': currentStep > 2 }"></view>
          <view class="step" :class="{ 'active': currentStep === 3 }">
            <view class="step-number">3</view>
            <text class="step-text">合成配置</text>
          </view>
        </view>
        
        <!-- 步骤1：选择视频 -->
        <view class="step-content" v-if="currentStep === 1">
          <view class="form-group">
            <view class="form-label">选择数字人视频</view>
            <view class="upload-container" @click="selectVideo" :class="{ 'has-file': videoFile }">
              <view class="upload-icon" v-if="!videoFile">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                </svg>
              </view>
              <view class="upload-preview" v-else>
                <view class="file-info">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <text>{{ videoFile.name }}</text>
                </view>
                <view class="remove-file" @click.stop="removeVideo">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </view>
              </view>
              <text class="upload-text" v-if="!videoFile">点击上传视频文件</text>
            </view>
            <text class="form-helper">支持mp4、mov格式，大小不超过100MB</text>
          </view>
          
          <view class="form-actions">
            <view class="next-button" @click="nextStep" :class="{ 'disabled': !videoFile }">
              <text>下一步</text>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </view>
          </view>
        </view>
        
        <!-- 步骤2：选择音频 -->
        <view class="step-content" v-if="currentStep === 2">
          <view class="form-group">
            <view class="form-label">选择音频文件</view>
            <view class="upload-container" @click="selectAudio" :class="{ 'has-file': audioFile }">
              <view class="upload-icon" v-if="!audioFile">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </view>
              <view class="upload-preview" v-else>
                <view class="file-info">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <text>{{ audioFile.name }}</text>
                </view>
                <view class="remove-file" @click.stop="removeAudio">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </view>
              </view>
              <text class="upload-text" v-if="!audioFile">点击上传音频文件</text>
            </view>
            <text class="form-helper">支持mp3、wav格式，大小不超过50MB</text>
          </view>
          
          <view class="form-actions">
            <view class="back-button-step" @click="prevStep">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              <text>上一步</text>
            </view>
            <view class="next-button" @click="nextStep" :class="{ 'disabled': !audioFile }">
              <text>下一步</text>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </view>
          </view>
        </view>
        
        <!-- 步骤3：合成配置 -->
        <view class="step-content" v-if="currentStep === 3">
          <view class="form-group">
            <view class="form-label">作品名称</view>
            <input 
              type="text" 
              v-model="workName" 
              placeholder="请输入作品名称" 
              class="form-input"
              maxlength="50"
            />
            <view class="input-counter">{{ workName.length }}/50</view>
          </view>
          
          <view class="form-group">
            <view class="form-label">文本内容</view>
            <textarea 
              v-model="textContent" 
              placeholder="请输入要转换的文本内容（最多450字）" 
              class="form-textarea"
              maxlength="450"
            ></textarea>
            <view class="input-counter">{{ textContent.length }}/450</view>
          </view>
          
          <view class="form-actions">
            <view class="back-button-step" @click="prevStep">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              <text>上一步</text>
            </view>
            <view class="next-button" @click="submitForm" :class="{ 'disabled': !workName }">
              <text>立即合成</text>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { videoApi } from '../../api/services'

const router = useRouter()
const route = useRoute()

// 表单数据
const currentStep = ref(1)
const videoFile = ref(null)
const audioFile = ref(null)
const workName = ref('')
const textContent = ref('')
const avatarId = ref(null)
const videoUrl = ref('')

// 初始化
onMounted(() => {
  // 获取URL参数
  if (route.query.id) {
    avatarId.value = route.query.id
  }
  
  if (route.query.videoUrl) {
    videoUrl.value = decodeURIComponent(route.query.videoUrl)
    // 模拟已上传视频
    videoFile.value = {
      name: '数字人视频.mp4',
      size: 1024 * 1024 * 10, // 假设10MB
      url: videoUrl.value
    }
  }
  
  if (route.query.name) {
    workName.value = decodeURIComponent(route.query.name) + '的视频'
  }
})

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 下一步
const nextStep = () => {
  if (currentStep.value === 1 && !videoFile.value) {
    uni.showToast({
      title: '请先上传视频文件',
      icon: 'none'
    })
    return
  }
  
  if (currentStep.value === 2 && !audioFile.value) {
    uni.showToast({
      title: '请先上传音频文件',
      icon: 'none'
    })
    return
  }
  
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

// 上一步
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// 选择视频
const selectVideo = () => {
  uni.chooseFile({
    count: 1,
    type: 'video',
    extension: ['mp4', 'mov'],
    success: (res) => {
      const file = res.tempFiles[0]
      // 检查文件大小
      if (file.size > 100 * 1024 * 1024) { // 100MB
        uni.showToast({
          title: '视频文件不能超过100MB',
          icon: 'none'
        })
        return
      }
      videoFile.value = file
    }
  })
}

// 移除视频
const removeVideo = () => {
  videoFile.value = null
}

// 选择音频
const selectAudio = () => {
  uni.chooseFile({
    count: 1,
    type: 'audio',
    extension: ['mp3', 'wav'],
    success: (res) => {
      const file = res.tempFiles[0]
      // 检查文件大小
      if (file.size > 50 * 1024 * 1024) { // 50MB
        uni.showToast({
          title: '音频文件不能超过50MB',
          icon: 'none'
        })
        return
      }
      audioFile.value = file
    }
  })
}

// 移除音频
const removeAudio = () => {
  audioFile.value = null
}

// 提交表单
const submitForm = async () => {
  if (!workName.value) {
    uni.showToast({
      title: '请输入作品名称',
      icon: 'none'
    })
    return
  }
  
  if (!videoFile.value) {
    uni.showToast({
      title: '请上传视频文件',
      icon: 'none'
    })
    return
  }
  
  if (!audioFile.value) {
    uni.showToast({
      title: '请上传音频文件',
      icon: 'none'
    })
    return
  }
  
  try {
    uni.showLoading({
      title: '正在提交...',
      mask: true
    })
    
    // 构建表单数据
    const formData = new FormData()
    formData.append('name', workName.value)
    formData.append('video', videoFile.value)
    formData.append('audio', audioFile.value)
    
    if (textContent.value) {
      formData.append('text', textContent.value)
    }
    
    if (avatarId.value) {
      formData.append('avatarId', avatarId.value)
    }
    
    // 提交任务
    const response = await videoApi.generate(formData)
    
    uni.hideLoading()
    
    if (response && response.success) {
      uni.showToast({
        title: '提交成功',
        icon: 'success'
      })
      
      // 跳转到任务列表页
      setTimeout(() => {
        router.push('/pages/works/list')
      }, 1500)
    } else {
      throw new Error(response?.message || '提交失败')
    }
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: error.message || '提交失败，请重试',
      icon: 'none'
    })
  }
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

/* 内容样式 */
.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 20px 16px;
  max-width: 640px;
  margin: 0 auto;
}

/* 顶部标题栏 */
.header-bar {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  
  .back-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    
    svg {
      fill: #fff;
    }
    
    &:active {
      background: rgba(255, 255, 255, 0.2);
    }
  }
  
  .header-title {
    .title {
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(to right, #fff, #10b981, #43b5ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }
  }
}

/* 表单容器 */
.form-container {
  background: rgba(17, 24, 39, 0.6);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(16, 185, 129, 0.1);
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
    
    .step-number {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 8px;
      transition: all 0.3s ease;
    }
    
    .step-text {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      transition: all 0.3s ease;
    }
    
    &.active {
      .step-number {
        background: linear-gradient(135deg, #10b981, #43b5ff);
        color: #fff;
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
      }
      
      .step-text {
        color: #fff;
        font-weight: 500;
      }
    }
    
    &.completed {
      .step-number {
        background: #10b981;
        color: #fff;
      }
      
      .step-text {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  
  .step-line {
    flex: 1;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    margin: 0 10px;
    margin-bottom: 30px;
    transition: all 0.3s ease;
    
    &.active {
      background: linear-gradient(to right, #10b981, #43b5ff);
    }
  }
}

/* 表单组件 */
.form-group {
  margin-bottom: 24px;
  position: relative;
  
  .form-label {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .form-helper {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 6px;
  }
  
  .form-input {
    width: 100%;
    height: 48px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0 16px;
    color: #fff;
    font-size: 16px;
    transition: all 0.3s ease;
    
    &:focus {
      border-color: rgba(16, 185, 129, 0.5);
      background: rgba(255, 255, 255, 0.08);
    }
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
  }
  
  .form-textarea {
    width: 100%;
    height: 120px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 12px 16px;
    color: #fff;
    font-size: 16px;
    transition: all 0.3s ease;
    resize: none;
    
    &:focus {
      border-color: rgba(16, 185, 129, 0.5);
      background: rgba(255, 255, 255, 0.08);
    }
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
  }
  
  .input-counter {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }
  
  .upload-container {
    width: 100%;
    height: 140px;
    background: rgba(255, 255, 255, 0.05);
    border: 2px dashed rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:active {
      background: rgba(255, 255, 255, 0.08);
    }
    
    &.has-file {
      border-style: solid;
      border-color: rgba(16, 185, 129, 0.3);
      background: rgba(16, 185, 129, 0.05);
    }
    
    .upload-icon {
      margin-bottom: 12px;
      color: rgba(255, 255, 255, 0.3);
      
      svg {
        fill: currentColor;
      }
    }
    
    .upload-text {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
    }
    
    .upload-preview {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 90%;
      padding: 12px 16px;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 8px;
      
      .file-info {
        display: flex;
        align-items: center;
        
        svg {
          fill: #10b981;
          margin-right: 8px;
        }
        
        text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      
      .remove-file {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        
        svg {
          fill: rgba(255, 255, 255, 0.7);
        }
        
        &:active {
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
}

/* 表单操作按钮 */
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  
  .next-button {
    display: flex;
    align-items: center;
    padding: 12px 24px;
    background: linear-gradient(135deg, #10b981, #43b5ff);
    border-radius: 30px;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
    margin-left: auto;
    
    &:active {
      transform: translateY(2px);
      box-shadow: 0 2px 6px rgba(16, 185, 129, 0.2);
    }
    
    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
    
    svg {
      margin-left: 8px;
      fill: #fff;
    }
  }
  
  .back-button-step {
    display: flex;
    align-items: center;
    padding: 12px 24px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 30px;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:active {
      background: rgba(255, 255, 255, 0.2);
    }
    
    svg {
      margin-right: 8px;
      fill: #fff;
    }
  }
}
</style> 