<template>
  <div class="page-container">
    <!-- 背景元素 -->
    <div class="bg-elements">
      <div class="bg-gradient"></div>
      <div class="bg-grid"></div>
      <div class="bg-circle circle1"></div>
      <div class="bg-circle circle2"></div>
    </div>
    
    <!-- 页面内容 -->
    <div class="content-wrapper">
      <div class="header">
        <div class="back-button" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </div>
        <div class="title">新手教程</div>
      </div>
      
      <!-- 教程列表 -->
      <div class="tutorial-list">
        <!-- 教程1：如何克隆自己的声音 -->
        <div class="tutorial-card">
          <div class="tutorial-image voice-clone">
            <div class="tutorial-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
                <defs>
                  <linearGradient id="voiceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#43B5FF" />
                    <stop offset="100%" stop-color="#10B981" />
                  </linearGradient>
                </defs>
                <path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.42 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" fill="url(#voiceGradient)"/>
              </svg>
              <div class="icon-glow"></div>
            </div>
            <div class="tutorial-number">01</div>
          </div>
          <div class="tutorial-content">
            <div class="tutorial-title">如何克隆自己的声音</div>
            <div class="tutorial-desc">利用AI技术，只需3分钟录音，即可创建与您声音高度相似的AI声音克隆模型，用于生成各类语音内容。</div>
            <div class="steps-container">
              <div class="step-item">
                <div class="step-dot"></div>
                <span>上传音频样本</span>
              </div>
              <div class="step-item">
                <div class="step-dot"></div>
                <span>AI模型训练</span>
              </div>
              <div class="step-item">
                <div class="step-dot"></div>
                <span>声音模型生成</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 教程2：如何克隆自己的分身 -->
        <div class="tutorial-card">
          <div class="tutorial-image avatar-clone">
            <div class="tutorial-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
                <defs>
                  <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6F4CFF" />
                    <stop offset="100%" stop-color="#2F70ED" />
                  </linearGradient>
                </defs>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="url(#avatarGradient)"/>
              </svg>
              <div class="icon-glow"></div>
            </div>
            <div class="tutorial-number">02</div>
          </div>
          <div class="tutorial-content">
            <div class="tutorial-title">如何克隆自己的分身</div>
            <div class="tutorial-desc">通过短视频上传，AI技术能快速学习您的面部特征和表情，生成可实时驱动的高清数字分身。</div>
            <div class="steps-container">
              <div class="step-item">
                <div class="step-dot"></div>
                <span>上传人像视频</span>
              </div>
              <div class="step-item">
                <div class="step-dot"></div>
                <span>AI模型训练</span>
              </div>
              <div class="step-item">
                <div class="step-dot"></div>
                <span>数字分身创建</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 教程3：如何生成数字人视频 -->
        <div class="tutorial-card">
          <div class="tutorial-image video-gen">
            <div class="tutorial-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
                <defs>
                  <linearGradient id="videoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FF6B8B" />
                    <stop offset="100%" stop-color="#FF8E53" />
                  </linearGradient>
                </defs>
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" fill="url(#videoGradient)"/>
              </svg>
              <div class="icon-glow"></div>
            </div>
            <div class="tutorial-number">03</div>
          </div>
          <div class="tutorial-content">
            <div class="tutorial-title">如何生成数字人视频</div>
            <div class="tutorial-desc">结合您的数字分身与声音克隆，只需输入文本内容，即可一键生成自然流畅的数字人视频，适用于多种场景。</div>
            <div class="steps-container">
              <div class="step-item">
                <div class="step-dot"></div>
                <span>选择数字分身</span>
              </div>
              <div class="step-item">
                <div class="step-dot"></div>
                <span>输入文本内容</span>
              </div>
              <div class="step-item">
                <div class="step-dot"></div>
                <span>一键生成视频</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-tip">
        <div class="tip-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/>
          </svg>
        </div>
        <span>更多详细教程将陆续更新</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回上一页
const goBack = () => {
  router.back()
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
  padding-bottom: calc(20px + env(safe-area-inset-bottom, 0));
  max-width: 100%;
  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 头部 */
.header {
  display: flex;
  align-items: center;
  padding: 10px 0;
  position: relative;
  margin-bottom: 20px;
  
  .back-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    
    svg {
      fill: #fff;
    }
    
    &:active {
      background: rgba(255, 255, 255, 0.2);
    }
  }
  
  .title {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
  }
}

/* 教程列表 */
.tutorial-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 8px;
}

/* 教程卡片 */
.tutorial-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  .tutorial-image {
    position: relative;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    
    .tutorial-icon {
      position: relative;
      z-index: 2;
      
      .icon-glow {
        position: absolute;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        filter: blur(20px);
      }
    }
    
    .tutorial-number {
      position: absolute;
      bottom: 10px;
      right: 15px;
      font-size: 40px;
      font-weight: 700;
      opacity: 0.5;
      color: rgba(255, 255, 255, 0.2);
      font-family: 'Arial', sans-serif;
      letter-spacing: -1px;
    }
    
    &.voice-clone {
      background: linear-gradient(135deg, rgba(67, 181, 255, 0.2), rgba(16, 185, 129, 0.2));
      
      .icon-glow {
        background: rgba(67, 181, 255, 0.3);
      }
    }
    
    &.avatar-clone {
      background: linear-gradient(135deg, rgba(111, 76, 255, 0.2), rgba(47, 112, 237, 0.2));
      
      .icon-glow {
        background: rgba(111, 76, 255, 0.3);
      }
    }
    
    &.video-gen {
      background: linear-gradient(135deg, rgba(255, 107, 139, 0.2), rgba(255, 142, 83, 0.2));
      
      .icon-glow {
        background: rgba(255, 107, 139, 0.3);
      }
    }
  }
  
  .tutorial-content {
    padding: 16px;
    
    .tutorial-title {
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 10px;
    }
    
    .tutorial-desc {
      font-size: 14px;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 16px;
    }
  }
}

.steps-container {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    top: 10px;
    left: 15px;
    right: 15px;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
  }
  
  .step-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    position: relative;
    z-index: 1;
    
    .step-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #6F4CFF;
      box-shadow: 0 0 10px rgba(111, 76, 255, 0.5);
      margin: 6px 0;
    }
    
    span {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      text-align: center;
      line-height: 1.3;
      max-width: 90px;
    }
  }
}

.footer-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 30px;
  padding: 16px;
  opacity: 0.7;
  
  .tip-icon {
    svg {
      fill: rgba(255, 255, 255, 0.7);
    }
  }
  
  span {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }
}
</style> 