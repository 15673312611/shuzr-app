<template>
  <view class="ai-writing-container">
    <!-- 背景装饰元素 -->
    <view class="bg-decoration">
      <view class="bg-circle bg-circle-1"></view>
      <view class="bg-circle bg-circle-2"></view>
      <view class="bg-circle bg-circle-3"></view>
      <view class="bg-dots"></view>
    </view>
    
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="header-left">
        <view class="back-button" @click="handleBack">
          <text class="icon-back">←</text>
        </view>
      </view>
      <view class="header-title">
        <text class="title-text">AI文案创作</text>
        <view class="title-underline"></view>
      </view>
      <view class="header-right">
        <view class="close-button" @click="handleClose">
          <text class="icon-close">×</text>
        </view>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <view class="content">
      <!-- 输入区域 -->
      <view class="input-section">
        <view class="input-label">
          <text class="label-icon">💡</text>
          <text class="label-text">输入创作主题</text>
        </view>
        <textarea
          class="input-box"
          v-model="inputText"
          placeholder="请输入你想要生成的文案主题或灵感..."
          maxlength="200"
          @input="handleInput"
        ></textarea>
        <view class="word-count">{{ inputText.length }}/200</view>
      </view>

      <!-- 字数控制区 -->
      <view class="section length-section">
        <view class="section-title">
          <text class="section-icon">📏</text>
          <text>字数控制</text>
        </view>
        <view class="option-group">
          <view 
            v-for="(option, index) in lengthOptions" 
            :key="index" 
            class="option-item" 
            :class="{ active: selectedLength === option.value }"
            @click="selectLength(option.value)"
          >
            {{ option.name }}
          </view>
        </view>
      </view>

      <!-- 生成数量选择 -->
      <view class="section count-section">
        <view class="section-title">
          <text class="section-icon">#️⃣</text>
          <text>生成数量</text>
        </view>
        <view class="option-group">
          <view 
            v-for="(option, index) in countOptions" 
            :key="index" 
            class="option-item" 
            :class="{ active: selectedCount === option.value }"
            @click="selectCount(option.value)"
          >
            {{ option.name }}
          </view>
        </view>
      </view>
      
      <!-- 特性展示 -->
      <view class="features-section">
        <view class="feature-item">
          <view class="feature-icon">⚡</view>
          <view class="feature-text">高效创作</view>
        </view>
        <view class="feature-item">
          <view class="feature-icon">🔄</view>
          <view class="feature-text">多样变化</view>
        </view>
        <view class="feature-item">
          <view class="feature-icon">🎯</view>
          <view class="feature-text">精准表达</view>
        </view>
      </view>
    </view>

    <!-- 底部操作区 -->
    <view class="footer">
      <button class="generate-button" @click="generateContent" :disabled="isLoading">
        <view class="button-content">
          <text class="button-icon" v-if="!isLoading">✨</text>
          <text class="button-loading" v-if="isLoading">⏳</text>
          <text>{{ isLoading ? '生成中...' : '立即生成' }}</text>
        </view>
        <view class="button-glow" v-if="!isLoading"></view>
      </button>
      <view class="footer-tips">点击按钮生成AI文案，为您的创作赋能</view>
    </view>
    
    <!-- 加载指示器 -->
    <div class="loading-overlay" v-if="isLoading">
      <div class="loading-spinner"></div>
    </div>
    
    <!-- 结果弹窗 -->
    <div class="result-modal" v-if="showResult">
      <div class="result-container">
        <div class="result-header">
          <h3>生成结果</h3>
          <span class="close-result" @click="closeResult">×</span>
        </div>
        <div class="result-body">
          <div v-for="(item, index) in generatedTexts" :key="index" class="result-item">
            <div class="result-text">{{ item }}</div>
            <div class="result-actions">
              <button class="copy-btn" @click="copyText(item)">复制</button>
            </div>
          </div>
        </div>
        <div class="result-footer">
          <button class="regenerate-btn" @click="regenerate">重新生成</button>
          <button class="close-btn" @click="closeResult">关闭</button>
        </div>
      </div>
    </div>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { contentApi } from '../../api/services'

const router = useRouter()
const isLoading = ref(false) // 加载状态变量
const showResult = ref(false) // 控制结果弹窗显示
const generatedTexts = ref([]) // 存储生成的文案

// 文本输入
const inputText = ref('')
const handleInput = (e) => {
  // 可以在这里添加输入处理逻辑
}

// 字数控制
const lengthOptions = [
  { name: '100字', value: 'short' },
  { name: '200字', value: 'medium' },
  { name: '300字', value: 'long' }
]
const selectedLength = ref('medium')
const selectLength = (value) => {
  selectedLength.value = value
}

// 生成数量
const countOptions = [
  { name: '1条', value: 1 },
  { name: '3条', value: 3 },
  { name: '5条', value: 5 }
]
const selectedCount = ref(3)
const selectCount = (value) => {
  selectedCount.value = value
}

// 导航处理
const handleBack = () => {
  router.back()
}

const handleClose = () => {
  router.push('/')
}

// 显示提示信息
const showToast = (message, type = 'info') => {
  // 使用原生alert作为替代，实际项目中可以替换为更美观的提示组件
  alert(message)
}

// 生成内容
const generateContent = async () => {
  if (!inputText.value.trim()) {
    showToast('请输入文案主题或灵感')
    return
  }
  
  // 构建请求参数
  const requestData = {
    topic: inputText.value,
    length: selectedLength.value,
    count: selectedCount.value
  }
  
  // 显示加载状态
  isLoading.value = true
  
  try {
    // 调用文案生成API
    const response = await contentApi.generate(requestData)
    
    console.log('文案生成成功，原始响应:', response)
    
    isLoading.value = false
    
    // 打印完整的响应数据结构，帮助调试
    console.log('响应数据类型:', typeof response)
    if (typeof response === 'object') {
      console.log('响应数据键:', Object.keys(response))
    }
    
    // 尝试从各种可能的数据结构中提取文案
    let creations = null
    
    // 提取creations数组的函数
    const extractCreations = (obj) => {
      if (!obj) return null
      
      // 直接检查对象中是否有creations数组
      if (Array.isArray(obj.creations)) {
        return obj.creations
      }
      
      // 检查data字段
      if (obj.data) {
        // data字段中直接有creations数组
        if (Array.isArray(obj.data.creations)) {
          return obj.data.creations
        }
        
        // data.data中有creations数组
        if (obj.data.data && Array.isArray(obj.data.data.creations)) {
          return obj.data.data.creations
        }
      }
      
      return null
    }
    
    // 尝试提取creations
    creations = extractCreations(response)
    
    // 如果成功提取到creations
    if (creations && creations.length > 0) {
      console.log('成功提取文案:', creations)
      generatedTexts.value = creations
      showResult.value = true
    } else {
      // 如果上面的方法都失败，尝试一些特殊情况
      console.error('无法从标准路径提取文案，尝试备用方法')
      console.log('完整响应:', JSON.stringify(response))
      
      // 尝试转换字符串响应(如果API返回的是JSON字符串)
      if (typeof response === 'string') {
        try {
          const parsedResponse = JSON.parse(response)
          creations = extractCreations(parsedResponse)
          
          if (creations && creations.length > 0) {
            generatedTexts.value = creations
            showResult.value = true
            return
          }
        } catch (e) {
          console.error('解析响应字符串失败:', e)
        }
      }
      
      // 如果是简单数组
      if (Array.isArray(response)) {
        generatedTexts.value = response
        showResult.value = true
        return
      }
      
      // 最后的尝试：查找任何可能的数组
      for (const key in response) {
        if (Array.isArray(response[key]) && response[key].length > 0 && 
            typeof response[key][0] === 'string') {
          console.log('从字段提取到可能的文案:', key)
          generatedTexts.value = response[key]
          showResult.value = true
          return
        }
      }
      
      // 所有尝试都失败
      showToast('无法提取生成的文案，请检查控制台日志')
    }
  } catch (error) {
    console.error('文案生成失败:', error)
    
    isLoading.value = false
    showToast('生成失败，请稍后重试')
  }
}

// 关闭结果弹窗
const closeResult = () => {
  showResult.value = false
}

// 重新生成
const regenerate = () => {
  showResult.value = false
  generateContent()
}

// 复制文本
const copyText = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      showToast('复制成功')
    })
    .catch(err => {
      console.error('复制失败:', err)
      showToast('复制失败，请手动复制')
    })
}
</script>

<style lang="scss" scoped>
.ai-writing-container {
  min-height: 100vh;
  height: 100vh;
  max-height: 100vh;
  background: linear-gradient(135deg, #171626, #1E1B36, #232141);
  display: flex;
  flex-direction: column;
  padding: 16px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

// 背景装饰
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
  
  .bg-circle {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(45deg, rgba(108, 92, 231, 0.1), rgba(138, 126, 255, 0.05));
    filter: blur(40px);
  }
  
  .bg-circle-1 {
    top: -10%;
    right: -5%;
    width: 300px;
    height: 300px;
    animation: float1 20s infinite ease-in-out;
  }
  
  .bg-circle-2 {
    bottom: -15%;
    left: -10%;
    width: 400px;
    height: 400px;
    animation: float2 25s infinite ease-in-out;
  }
  
  .bg-circle-3 {
    top: 40%;
    right: 10%;
    width: 200px;
    height: 200px;
    animation: float3 15s infinite ease-in-out;
  }
  
  .bg-dots {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 30px 30px;
    opacity: 0.3;
  }
}

@keyframes float1 {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-20px) translateX(20px); }
}

@keyframes float2 {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(30px) translateX(-20px); }
}

@keyframes float3 {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-15px) translateX(-15px); }
}

// 顶部导航栏
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  height: 44px;
  position: relative;
  z-index: 1;
  
  .header-left, .header-right {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .back-button, .close-button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    
    &:active {
      transform: scale(0.92);
      background-color: rgba(255, 255, 255, 0.15);
    }
  }
  
  .header-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .title-text {
      font-size: 20px;
      font-weight: bold;
      color: #FFFFFF;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    
    .title-underline {
      width: 36px;
      height: 3px;
      background: linear-gradient(to right, #6C5CE7, #8A7EFF);
      border-radius: 3px;
      margin-top: 3px;
    }
  }
  
  .icon-back, .icon-close {
    font-size: 18px;
    color: #FFFFFF;
    font-weight: bold;
  }
}

// 内容区域
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

// 输入区域
.input-section {
  position: relative;
  margin-bottom: 0;
  
  .input-label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    
    .label-icon {
      font-size: 18px;
    }
    
    .label-text {
      font-size: 16px;
      font-weight: 600;
      color: #FFFFFF;
    }
  }
  
  .input-box {
    width: 100%;
    height: 110px;
    background: rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 14px;
    font-size: 16px;
    color: #FFFFFF;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    
    &:focus {
      border-color: #6C5CE7;
      transform: translateY(-2px);
      box-shadow: 0 12px 25px rgba(108, 92, 231, 0.25);
    }
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
  
  .word-count {
    position: absolute;
    bottom: 10px;
    right: 14px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    background: rgba(0, 0, 0, 0.2);
    padding: 3px 8px;
    border-radius: 8px;
  }
}

// 通用部分标题样式
.section {
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
  }
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    
    .section-icon {
      font-size: 20px;
      background: rgba(162, 155, 254, 0.2);
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
    }
  }
}

// 选项组通用样式
.option-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  
  .option-item {
    flex: 1;
    min-width: 60px;
    padding: 10px 16px;
    text-align: center;
    background: rgba(255, 255, 255, 0.07);
    border-radius: 12px;
    font-size: 14px;
    color: #E2E8F0;
    transition: all 0.3s;
    border: 1px solid transparent;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    
    &.active {
      background: linear-gradient(135deg, #6C5CE7, #8A7EFF);
      color: #FFFFFF;
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 6px 15px rgba(108, 92, 231, 0.3);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
}

// 特性展示区
.features-section {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 0;
  
  .feature-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-radius: 14px;
    padding: 15px 10px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    }
    
    .feature-icon {
      font-size: 22px;
      margin-bottom: 4px;
      background: rgba(108, 92, 231, 0.2);
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
    }
    
    .feature-text {
      font-size: 14px;
      font-weight: 500;
      color: #FFFFFF;
    }
  }
}

// 底部操作区
.footer {
  margin-top: 24px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  
  .generate-button {
    width: 100%;
    height: 54px;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #6C5CE7, #8A7EFF);
    border-radius: 27px;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    border: none;
    box-shadow: 0 8px 20px rgba(108, 92, 231, 0.4);
    transition: all 0.3s;
    
    &:active {
      transform: scale(0.97);
      box-shadow: 0 4px 10px rgba(108, 92, 231, 0.3);
    }
    
    &:disabled {
      opacity: 0.7;
      transform: none;
      box-shadow: none;
    }
    
    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 2;
    }
    
    .button-icon {
      font-size: 20px;
    }
    
    .button-glow {
      position: absolute;
      top: 0;
      left: -50%;
      width: 40%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(255, 255, 255, 0.2), 
        transparent
      );
      transform: skewX(-30deg);
      animation: button-glow 3s infinite;
    }
  }
  
  .footer-tips {
    margin-top: 10px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
  }
}

// 加载指示器
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #6C5CE7;
  animation: spin 1s ease-in-out infinite;
}

.button-loading {
  animation: pulse 1.5s infinite;
}

// 结果弹窗
.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
}

.result-container {
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  background: linear-gradient(135deg, #1E1B36, #232141);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(108, 92, 231, 0.3);
}

.result-header {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 {
    margin: 0;
    font-size: 18px;
    color: #fff;
    font-weight: 600;
  }
  
  .close-result {
    font-size: 24px;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    
    &:hover {
      color: #fff;
    }
  }
}

.result-body {
  padding: 15px;
  overflow-y: auto;
  max-height: 60vh;
  
  .result-item {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 15px;
    margin-bottom: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .result-text {
      color: #fff;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 10px;
      white-space: pre-wrap;
    }
    
    .result-actions {
      display: flex;
      justify-content: flex-end;
      
      button {
        background: rgba(108, 92, 231, 0.2);
        border: none;
        color: #fff;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
          background: rgba(108, 92, 231, 0.4);
        }
      }
    }
  }
}

.result-footer {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  button {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    
    &.regenerate-btn {
      background: linear-gradient(135deg, #6C5CE7, #8A7EFF);
      color: #fff;
      flex: 1;
      margin-right: 10px;
      
      &:hover {
        background: linear-gradient(135deg, #7d6ffe, #9c8fff);
      }
    }
    
    &.close-btn {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      padding: 10px 15px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
}

@keyframes button-glow {
  0% { left: -50%; }
  100% { left: 150%; }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}

/* 响应式适配 */
/* 小屏幕设备 (iPhone SE 等) */
@media screen and (max-width: 375px) {
  .ai-writing-container {
    padding: 12px;
    
    .header {
      margin-bottom: 16px;
      
      .header-title {
        .title-text {
          font-size: 18px;
        }
      }
      
      .back-button, .close-button {
        width: 36px;
        height: 36px;
      }
    }
    
    .content {
      .input-section {
        margin-bottom: 16px;
        
        .input-label {
          margin-bottom: 8px;
          
          .label-text {
            font-size: 15px;
          }
        }
        
        .input-box {
          height: 100px;
          font-size: 14px;
          padding: 12px;
        }
        
        .word-count {
          font-size: 12px;
          margin-top: 6px;
        }
      }
      
      .section {
        margin-bottom: 16px;
        padding: 14px;
        
        .section-title {
          font-size: 15px;
          margin-bottom: 10px;
        }
        
        .option-group {
          gap: 8px;
          
          .option-item {
            font-size: 13px;
            padding: 8px 12px;
          }
        }
      }
      
      .features-section {
        margin-top: 16px;
        
        .feature-item {
          padding: 10px;
          
          .feature-icon {
            font-size: 18px;
            margin-bottom: 6px;
          }
          
          .feature-text {
            font-size: 13px;
          }
        }
      }
    }
    
    .footer {
      margin-top: 20px;
      
      .generate-button {
        height: 46px;
        font-size: 15px;
      }
      
      .footer-tips {
        margin-top: 10px;
        font-size: 12px;
      }
    }
  }
  
  .result-modal {
    .result-container {
      width: 90%;
      max-height: 80vh;
      
      .result-header {
        padding: 12px 15px;
        
        h3 {
          font-size: 16px;
        }
      }
      
      .result-body {
        padding: 12px;
        
        .result-item {
          padding: 12px;
          margin-bottom: 12px;
          
          .result-text {
            font-size: 13px;
            margin-bottom: 8px;
          }
        }
      }
      
      .result-footer {
        padding: 12px;
        
        button {
          padding: 8px 16px;
          font-size: 13px;
        }
      }
    }
  }
}

/* 中等屏幕设备 (iPhone X, 11, 12, 13 等) */
@media screen and (min-width: 376px) and (max-width: 428px) {
  .ai-writing-container {
    padding: 16px;
    
    .content {
      .input-section {
        .input-box {
          height: 120px;
        }
      }
      
      .section {
        padding: 16px;
      }
    }
  }
  
  .result-modal {
    .result-container {
      width: 85%;
    }
  }
}

/* 大屏幕设备 (iPhone 14 Pro Max 等) */
@media screen and (min-width: 429px) {
  .ai-writing-container {
    padding: 20px;
    max-width: 500px;
    margin: 0 auto;
    
    .header {
      margin-bottom: 24px;
      
      .header-title {
        .title-text {
          font-size: 22px;
        }
      }
    }
    
    .content {
      .input-section {
        margin-bottom: 24px;
        
        .input-box {
          height: 140px;
          font-size: 16px;
        }
      }
      
      .section {
        margin-bottom: 20px;
        padding: 20px;
        
        .section-title {
          font-size: 17px;
          margin-bottom: 14px;
        }
        
        .option-group {
          .option-item {
            font-size: 15px;
            padding: 10px 16px;
          }
        }
      }
    }
    
    .footer {
      margin-top: 30px;
      
      .generate-button {
        height: 52px;
        font-size: 17px;
      }
    }
  }
  
  .result-modal {
    .result-container {
      width: 80%;
      max-width: 450px;
      
      .result-header {
        padding: 18px 20px;
        
        h3 {
          font-size: 18px;
        }
      }
      
      .result-body {
        padding: 20px;
        
        .result-item {
          padding: 16px;
          
          .result-text {
            font-size: 15px;
          }
        }
      }
      
      .result-footer {
        padding: 18px 20px;
        
        button {
          padding: 12px 20px;
          font-size: 15px;
        }
      }
    }
  }
}
</style>
