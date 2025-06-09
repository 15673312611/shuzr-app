<template>
  <view class="container">
    <!-- 背景元素 -->
    <view class="bg-gradient"></view>
    
    <!-- 3D网格背景 -->
    <view class="bg-grid"></view>
    
    <!-- 新增虚线网格 -->
    <view class="dotted-grid"></view>
    
    <!-- 创意元素 -->
    <view class="creative-elements">
      <!-- 3D浮动立方体 -->
      <view class="floating-cube cube1"></view>
      <view class="floating-cube cube2"></view>
      <view class="floating-cube cube3"></view>
      
      <!-- 透明球体 -->
      <view class="floating-sphere sphere1"></view>
      <view class="floating-sphere sphere2"></view>
      
      <!-- 悬浮环 -->
      <view class="floating-ring ring1"></view>
      <view class="floating-ring ring2"></view>
    </view>
    
    <!-- 装饰线 -->
    <view class="decorative-lines">
      <view class="line line1"></view>
      <view class="line line2"></view>
      <view class="line line3"></view>
      <view class="line line4"></view>
    </view>
    
    <!-- 流体效果 -->
    <view class="fluid-effect">
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(0, 255, 170, 0.3)" />
            <stop offset="100%" stop-color="rgba(66, 135, 245, 0.2)" />
          </linearGradient>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
          </filter>
        </defs>
        <g filter="url(#gooey)">
          <circle class="blob blob1" cx="200" cy="200" r="50" fill="url(#gradient1)" />
          <circle class="blob blob2" cx="200" cy="200" r="40" fill="url(#gradient1)" />
          <circle class="blob blob3" cx="200" cy="200" r="60" fill="url(#gradient1)" />
        </g>
      </svg>
    </view>
    
    <!-- 闪光点效果 -->
    <view class="sparkles">
      <view class="sparkle" v-for="i in 40" :key="i"></view>
    </view>
    
    <!-- 模糊光晕 -->
    <view class="glow-orbs">
      <view class="orb orb1"></view>
      <view class="orb orb2"></view>
      <view class="orb orb3"></view>
    </view>
    
    <!-- AI元素图标 -->
    <view class="ai-elements">
      <view class="ai-icon microphone">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16c-2.47 0-4.52-1.8-4.93-4.15-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" fill="rgba(255, 255, 255, 0.4)"/>
        </svg>
      </view>
      <view class="ai-icon camera">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" fill="rgba(255, 255, 255, 0.4)"/>
        </svg>
      </view>
      <view class="ai-icon face">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
          <path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM6 9c-.41.41-1.02.41-1.41 0-.41-.41-.41-1.02-.41-1.41 0-1.41.41-.41 1.02-.41 1.41 0 .41.41.41 1.02.41 1.41zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z" fill="rgba(255, 255, 255, 0.4)"/>
        </svg>
      </view>
    </view>
    
    <!-- 主要内容 -->
    <view class="content">
      <!-- 标题区域 -->
      <view class="title-section">
        <text class="title-line">快速创建我的</text>
        <text class="title-highlight">数字人形象</text>
        <view class="title-decoration"></view>
      </view>
      
      <!-- 一键分身按钮 -->
      <view class="primary-button" @click="goToClone">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
        </svg>
        <text>一键分身</text>
      </view>
      
      <!-- 功能卡片区域 -->
      <view class="cards-section">
        <!-- 形象克隆卡片 -->
        <view class="feature-card avatar-card" @click="goToImageClone">
          <view class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            </svg>
          </view>
          <view class="feature-content">
            <text class="feature-title">形象克隆</text>
            <text class="feature-desc">定制专属数字人</text>
          </view>
          <view class="card-glow"></view>
        </view>
        
        <!-- 视频合成卡片 -->
        <view class="feature-card video-card" @click="goToVideoSynthesis">
          <view class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" fill="currentColor"/>
            </svg>
          </view>
          <view class="feature-content">
            <text class="feature-title">视频合成</text>
            <text class="feature-desc">数字人短视频</text>
          </view>
          <view class="card-glow"></view>
        </view>
        
        <!-- 声音克隆卡片 -->
        <view class="feature-card voice-card" @click="goToVoiceClone">
          <view class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>
            </svg>
          </view>
          <view class="feature-content">
            <text class="feature-title">声音克隆</text>
            <text class="feature-desc">定制专属音色</text>
          </view>
          <view class="card-glow"></view>
        </view>
      </view>
      
      <!-- 热门工具 -->
      <view class="section-header">
        <view class="section-marker"></view>
        <text class="section-title">热门助手</text>
      </view>
      
      <view class="tools-grid">
        <view 
          v-for="(tool, index) in hotTools" 
          :key="index" 
          class="tool-card" 
          @click="goToTool(tool)"
        >
          <view class="tool-content">
            <text class="tool-title">{{ tool.name }}</text>
            <text class="tool-desc">{{ tool.desc }}</text>
          </view>
          <view class="tool-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path :d="tool.icon" :fill="index === 0 ? '#00ffaa' : (index === 1 ? '#4287f5' : '#ff6e6e')"/>
            </svg>
          </view>
          <view class="tool-shine"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const hotTools = ref([
  { 
    name: 'AI文案', 
    desc: '快速搞定营销文案',
    icon: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  },
  { 
    name: '资产市场', 
    desc: '分享资产赚佣金',
    icon: 'M17.21 9l-4.38-6.56c-.19-.28-.51-.42-.83-.42-.32 0-.64.14-.83.43L6.79 9H2c-.55 0-1 .45-1 1 0 .09.01.18.04.27l2.54 9.27c.23.84 1 1.46 1.92 1.46h13c.92 0 1.69-.62 1.93-1.46l2.54-9.27L23 10c0-.55-.45-1-1-1h-4.79zM9 9l3-4.4L15 9H9zm3 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
  }
  // ,
  // { 
  //   name: '一键包装', 
  //   desc: '视频网感一键生成',
  //   icon: 'M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z',
  // }
])

const goToClone = () => {
  router.push('/pages/avatar/clone')
}

const goToImageClone = () => {
  // 跳转至形象克隆上传页面
  router.push('/pages/avatar/upload')
}

const goToVideoSynthesis = () => {
  // 跳转至视频合成页面
  router.push('/pages/video/synthesis')
}
// 视频剪辑
const handleVideoEditor = () => {
  uni.navigateTo({
    url: '/pages/video-editor/index'
  })
}
const goToVoiceClone = () => {
  router.push('/pages/voice/upload')
}

const goToTool = (tool) => {
  if (tool.name === 'AI文案') {
    router.push('/pages/ai-writing/index')
  } else if (tool.name === '资产市场') {
    router.push('/pages/market/index')
  } else if (tool.name === '一键包装') {
    router.push('/pages/video-packaging/index')
  } else {
    // 其他工具的路由
    console.log('跳转到工具:', tool.name)
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #0a0e17;
  color: #fff;
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  font-family: 'PingFang SC', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
}

.bg-gradient {
  position: fixed;
  top: -80%;
  left: -80%;
  width: 260%;
  height: 260%;
  background: radial-gradient(circle at 30% 30%, rgba(44, 62, 80, 0.8), rgba(10, 14, 23, 1) 70%);
  z-index: 0;
  animation: subtle-rotate 180s infinite linear;
}

/* 新增虚线网格 */
.dotted-grid {
  position: fixed;
  top: -20%;
  left: -20%;
  width: 140%;
  height: 140%;
  background-image: 
    radial-gradient(rgba(66, 135, 245, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  background-position: center center;
  z-index: 0;
  opacity: 0.15;
}

.bg-grid {
  position: fixed;
  top: -150%;
  left: -150%;
  width: 400%;
  height: 400%;
  background-image: 
    linear-gradient(rgba(66, 135, 245, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(66, 135, 245, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: center center;
  z-index: 0;
  opacity: 0.3;
  transform: perspective(1000px) rotateX(60deg) scale(2, 2) translateY(-100px);
  transform-origin: center center;
  animation: grid-move 60s infinite linear;
}

/* 创意元素 */
.creative-elements {
  position: fixed;
  top: -20%;
  left: -20%;
  width: 140%;
  height: 140%;
  z-index: 0;
  overflow: hidden;
  
  .floating-cube {
    position: absolute;
    width: 50px;
    height: 50px;
    background: rgba(0, 255, 170, 0.1);
    box-shadow: 0 0 15px rgba(0, 255, 170, 0.3);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transform-style: preserve-3d;
    animation: cube-float 15s infinite ease-in-out;
    
    &:before, &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 255, 170, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    &:before {
      transform: rotateY(90deg) translateZ(25px) translateX(-25px);
    }
    
    &:after {
      transform: rotateX(90deg) translateZ(25px) translateY(-25px);
    }
    
    &.cube1 {
      top: 10%;
      right: 2%;
      animation-delay: 0s;
      transform: rotateX(45deg) rotateY(45deg);
    }
    
    &.cube2 {
      bottom: 5%;
      left: 2%;
      width: 40px;
      height: 40px;
      animation-delay: 3s;
      transform: rotateX(30deg) rotateY(60deg);
    }
    
    &.cube3 {
      top: 55%;
      right: 8%;
      width: 35px;
      height: 35px;
      animation-delay: 6s;
      transform: rotateX(60deg) rotateY(30deg);
    }
  }
  
  .floating-sphere {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(66, 135, 245, 0.3), rgba(66, 135, 245, 0.05));
    box-shadow: 0 0 20px rgba(66, 135, 245, 0.2);
    backdrop-filter: blur(3px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    animation: sphere-float 20s infinite ease-in-out;
    
    &.sphere1 {
      width: 100px;
      height: 100px;
      top: 15%;
      left: 5%;
      animation-delay: 2s;
    }
    
    &.sphere2 {
      width: 80px;
      height: 80px;
      bottom: 15%;
      right: 5%;
      animation-delay: 5s;
      background: radial-gradient(circle at 30% 30%, rgba(0, 255, 170, 0.2), rgba(0, 255, 170, 0.05));
      box-shadow: 0 0 20px rgba(0, 255, 170, 0.2);
    }
  }
  
  .floating-ring {
    position: absolute;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 20px rgba(0, 255, 170, 0.1);
    animation: ring-float 25s infinite linear;
    
    &.ring1 {
      width: 150px;
      height: 150px;
      top: 30%;
      left: -30px;
      transform: rotate3d(1, 1, 1, 45deg);
      animation-delay: 0s;
    }
    
    &.ring2 {
      width: 200px;
      height: 200px;
      bottom: 0;
      right: -30px;
      transform: rotate3d(1, -1, 1, 60deg);
      animation-delay: 8s;
      border: 2px solid rgba(66, 135, 245, 0.1);
      box-shadow: 0 0 20px rgba(66, 135, 245, 0.1);
    }
  }
}

/* 装饰线 */
.decorative-lines {
  position: fixed;
  top: -200px;
  left: -200px;
  width: calc(100% + 400px);
  height: calc(100% + 400px);
  z-index: 0;
  overflow: hidden;
  
  .line {
    position: absolute;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 170, 0.2), transparent);
    height: 1px;
    width: 300%;
    left: -100%;
    opacity: 0.3;
    animation: line-move 20s infinite linear;
    
    &.line1 {
      top: 20%;
      animation-delay: 0s;
    }
    
    &.line2 {
      top: 40%;
      animation-delay: 5s;
      background: linear-gradient(90deg, transparent, rgba(66, 135, 245, 0.2), transparent);
    }
    
    &.line3 {
      top: 60%;
      animation-delay: 10s;
    }
    
    &.line4 {
      top: 80%;
      animation-delay: 15s;
      background: linear-gradient(90deg, transparent, rgba(66, 135, 245, 0.2), transparent);
    }
  }
}

/* 流体效果 */
.fluid-effect {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 200vw;
  height: 200vh;
  transform: translate(-50%, -50%);
  opacity: 0.2;
  z-index: 0;
  pointer-events: none;
  
  svg {
    width: 100%;
    height: 100%;
    
    .blob {
      animation: blob-move 20s infinite ease-in-out;
      
      &.blob1 {
        animation-delay: 0s;
      }
      
      &.blob2 {
        animation-delay: 5s;
      }
      
      &.blob3 {
        animation-delay: 10s;
      }
    }
  }
}

/* 闪光点效果 */
.sparkles {
  position: fixed;
  top: -15%;
  left: -15%;
  width: 130%;
  height: 130%;
  z-index: 0;
  
  .sparkle {
    position: absolute;
    width: 2px;
    height: 2px;
    background-color: #fff;
    border-radius: 50%;
    animation: sparkle 6s infinite ease-in-out;
    
    @for $i from 1 through 40 {
      &:nth-child(#{$i}) {
        top: random(130) * 1%;
        left: random(130) * 1%;
        animation-delay: random(6) * 1s;
        opacity: 0.1 + random(7) * 0.1;
        transform: scale(0.5 + random(10) * 0.1);
      }
    }
  }
}

/* AI元素图标 */
.ai-elements {
  position: fixed;
  top: -5%;
  left: -5%;
  width: 110%;
  height: 110%;
  z-index: 0;
  pointer-events: none;
  
  .ai-icon {
    position: absolute;
    width: min(68px, 15vw);
    height: min(68px, 15vw);
    border-radius: 14px;
    background: rgba(30, 30, 40, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    animation: ai-icon-float 20s infinite ease-in-out;
    
    svg {
      width: min(32px, 8vw);
      height: min(32px, 8vw);
    }
    
    &.microphone {
      top: 15%;
      right: 3%;
      animation-delay: 0s;
      transform: rotate(10deg);
    }
    
    &.camera {
      bottom: 8%;
      left: 3%;
      animation-delay: 7s;
      transform: rotate(-5deg);
    }
    
    &.face {
      top: 50%;
      right: 6%;
      animation-delay: 4s;
      transform: rotate(5deg);
    }
  }
}

.content {
  position: relative;
  z-index: 1;
  padding: 50px 16px 50px;
  max-width: 480px;
  margin: 0 auto;
}

.title-section {
  margin-bottom: 32px;
  position: relative;
  
  .title-line {
    display: block;
    font-size: 24px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.95);
    margin-bottom: 10px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .title-highlight {
    display: block;
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 10px;
    background: linear-gradient(to right, #00ffaa, #7fff00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 20px rgba(0, 255, 170, 0.3);
  }
  
  .title-decoration {
    position: absolute;
    top: 12px;
    right: 20px;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(0, 255, 170, 0.2), rgba(127, 255, 0, 0.1));
    filter: blur(15px);
  }
}

.primary-button {
  width: 100%;
  height: 62px;
  background: linear-gradient(to right, #7fff00, #00ffaa);
  border-radius: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 36px;
  box-shadow: 0 8px 20px rgba(0, 255, 170, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 70%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
    animation: shine 3s infinite;
  }
  
  @keyframes shine {
    0% { left: -100%; }
    20% { left: 100%; }
    100% { left: 100%; }
  }
  
  svg {
    margin-right: 12px;
    color: rgba(0, 0, 0, 0.8);
    width: 22px;
    height: 22px;
  }
  
  text {
    font-size: 19px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: 1px;
  }
  
  &:active {
    transform: translateY(2px);
    box-shadow: 0 4px 10px rgba(0, 255, 170, 0.2);
  }
}

.cards-section {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  grid-template-rows: repeat(2, 1fr);
  gap: 14px;
  height: 280px;
  margin-bottom: 36px;
  margin-left: -16px;
  margin-right: -16px;
}

.feature-card {
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: min(20px, 5vw);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
    
    .card-glow {
      opacity: 0.8;
    }
  }
  
  .feature-icon {
    width: min(70px, 18vw);
    height: min(70px, 18vw);
    border-radius: 16px;
    background-color: rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    margin-bottom: min(18px, 4vw);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    
    svg {
      width: min(36px, 10vw);
      height: min(36px, 10vw);
    }
  }
  
  .feature-content {
    .feature-title {
      font-size: min(20px, 5.5vw);
      font-weight: 600;
      color: #fff;
      display: block;
      margin-bottom: 6px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
    
    .feature-desc {
      font-size: min(14px, 4vw);
      color: rgba(255, 255, 255, 0.85);
      display: block;
    }
  }
  
  .card-glow {
    position: absolute;
    bottom: -40px;
    right: -40px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    filter: blur(30px);
    opacity: 0.5;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
}

.avatar-card {
  grid-column: 1;
  grid-row: 1 / 3;
  /* 将图片和渐变色作为多重背景叠加 */
  /* 上层：人物图片, 100% 高度并置于底部, no-repeat 不重复 */
  background: 
    url('../../static/images/tabbar/xingxbeij.png') center bottom / auto 100% no-repeat,
    linear-gradient(135deg, rgba(0, 233, 186, 0.7), rgba(0, 179, 230, 0.7));
  
  /* 仅针对形象克隆卡片内部元素进行样式覆盖 */
  .feature-icon {
    width: 50px;
    height: 50px;
    background-color: rgba(255, 255, 255, 0.4);
    color: #000;
    
    svg {
      width: 40px;
      height: 40px;
    }
  }
  
  .feature-content {
    .feature-title {
      color: #000;
      text-shadow: none;
    }
    .feature-desc {
      color: #333;
    }
  }
  
  .card-glow {
    background: rgba(0, 233, 186, 0.6);
  }
}

.video-card {
  grid-column: 2;
  grid-row: 1;
  background: linear-gradient(135deg, rgba(66, 135, 245, 0.8), rgba(109, 0, 255, 0.8));
  
  .card-glow {
    background: rgba(66, 135, 245, 0.6);
  }
}

.voice-card {
  grid-column: 2;
  grid-row: 2;
  background: linear-gradient(135deg, rgba(0, 204, 187, 0.8), rgba(0, 163, 224, 0.8));
  
  .card-glow {
    background: rgba(0, 204, 187, 0.6);
  }
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 2vh;
  margin-left: -36px;
  padding-left: 16px;
  
  .section-marker {
    width: 5px;
    height: min(20px, 5vw);
    background: linear-gradient(to bottom, #00ffaa, rgba(0, 255, 170, 0.5));
    border-radius: 2.5px;
    margin-right: 12px;
  }
  
  .section-title {
    font-size: min(20px, 5.5vw);
    font-weight: 600;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-left: -28px;
  margin-right: -16px;
  padding-left: 16px;
  padding-right: 16px;
}

.tool-card {
  background-color: rgba(25, 25, 25, 0.7);
  border-radius: 18px;
  padding: min(18px, 4.5vw);
  height: min(105px, 25vh);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    
    .tool-shine {
      opacity: 1;
    }
    
    .tool-icon {
      transform: scale(1.1);
      box-shadow: 0 0 15px rgba(var(--icon-glow-color, 0, 255, 170), 0.5);
    }
    
    .tool-title {
      background: linear-gradient(to right, #fff, rgba(var(--icon-glow-color, 0, 255, 170), 1));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    &::after {
      opacity: 0.8;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, 
      rgba(var(--card-gradient-start, 0, 255, 170), 0.05) 0%, 
      rgba(var(--card-gradient-end, 66, 135, 245), 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }
  
  &:nth-child(1) {
    --icon-glow-color: 0, 255, 170;
    --card-gradient-start: 0, 255, 170;
    --card-gradient-end: 127, 255, 0;
    border-left: 3px solid rgba(0, 255, 170, 0.5);
    
    .tool-icon {
      background: linear-gradient(135deg, rgba(0, 255, 170, 0.2), rgba(127, 255, 0, 0.2));
    }
  }
  
  &:nth-child(2) {
    --icon-glow-color: 66, 135, 245;
    --card-gradient-start: 66, 135, 245;
    --card-gradient-end: 109, 0, 255;
    border-left: 3px solid rgba(66, 135, 245, 0.5);
    
    .tool-icon {
      background: linear-gradient(135deg, rgba(66, 135, 245, 0.2), rgba(109, 0, 255, 0.2));
    }
  }
  
  &:nth-child(3) {
    --icon-glow-color: 255, 110, 110;
    --card-gradient-start: 255, 110, 110;
    --card-gradient-end: 255, 150, 100;
    border-left: 3px solid rgba(255, 110, 110, 0.5);
    
    .tool-icon {
      background: linear-gradient(135deg, rgba(255, 110, 110, 0.2), rgba(255, 150, 100, 0.2));
    }
  }
  
  .tool-content {
    z-index: 1;
    
    .tool-title {
      font-size: min(18px, 5vw);
      font-weight: 600;
      color: #fff;
      margin-bottom: 6px;
      display: block;
      transition: all 0.3s ease;
    }
    
    .tool-desc {
      font-size: min(14px, 4vw);
      color: rgba(255, 255, 255, 0.7);
    }
  }
  
  .tool-icon {
    position: absolute;
    bottom: 16px;
    right: 16px;
    width: min(40px, 12vw);
    height: min(40px, 12vw);
    border-radius: 50%;
    background-color: rgba(30, 30, 30, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    z-index: 1;
    transition: all 0.3s ease;
  }
  
  .tool-shine {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.08) 0%, transparent 60%);
    transform: rotate(45deg);
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: 0;
  }
}

@keyframes subtle-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes grid-move {
  0% {
    transform: perspective(1000px) rotateX(60deg) scale(2, 2) translateY(-100px);
  }
  50% {
    transform: perspective(1000px) rotateX(60deg) scale(2, 2) translateY(0px);
  }
  100% {
    transform: perspective(1000px) rotateX(60deg) scale(2, 2) translateY(-100px);
  }
}

@keyframes cube-float {
  0%, 100% {
    transform: rotateX(45deg) rotateY(45deg) translateY(0);
  }
  50% {
    transform: rotateX(45deg) rotateY(225deg) translateY(-20px);
  }
}

@keyframes sphere-float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-15px) scale(1.05);
  }
}

@keyframes ring-float {
  0% {
    transform: rotate3d(1, 1, 1, 0deg);
  }
  100% {
    transform: rotate3d(1, 1, 1, 360deg);
  }
}

@keyframes line-move {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(50%);
  }
}

@keyframes blob-move {
  0%, 100% {
    cx: 200;
    cy: 200;
  }
  25% {
    cx: 150;
    cy: 250;
  }
  50% {
    cx: 250;
    cy: 150;
  }
  75% {
    cx: 300;
    cy: 200;
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.5);
  }
}

@keyframes orb-pulse {
  0% {
    opacity: 0.1;
    transform: scale(0.9);
  }
  100% {
    opacity: 0.2;
    transform: scale(1.1);
  }
}

@keyframes ai-icon-float {
  0%, 100% {
    transform: translateY(0) rotate(var(--rotation, 0deg));
  }
  50% {
    transform: translateY(-10px) rotate(var(--rotation, 0deg));
  }
}

/* 模糊光晕 */
.glow-orbs {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  
  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.25;
    animation: orb-pulse 15s infinite alternate;
    
    &.orb1 {
      width: 100vw;
      height: 100vw;
      top: -40vh;
      right: -40vw;
      background: radial-gradient(circle at center, rgba(0, 255, 170, 0.6), transparent 70%);
      animation-delay: 0s;
    }
    
    &.orb2 {
      width: 120vw;
      height: 120vw;
      bottom: -50vh;
      left: -50vw;
      background: radial-gradient(circle at center, rgba(66, 135, 245, 0.5), transparent 70%);
      animation-delay: 5s;
    }
    
    &.orb3 {
      width: 80vw;
      height: 80vw;
      top: 40%;
      right: -30vw;
      background: radial-gradient(circle at center, rgba(255, 100, 255, 0.4), transparent 70%);
      animation-delay: 10s;
    }
  }
}

// 添加设备专用媒体查询
// 小屏幕设备适配 (iPhone SE 等)
@media screen and (max-width: 375px) {
  .content {
    padding: 20px 12px 30px;
  }
  
  .title-section {
    margin-bottom: 20px;
    
    .title-line {
      font-size: 18px;
      margin-bottom: 6px;
    }
    
    .title-highlight {
      font-size: 26px;
      margin-bottom: 6px;
    }
    
    .title-decoration {
      width: 36px;
      height: 36px;
    }
  }

  .primary-button {
    height: 50px;
    margin-bottom: 20px;
    
    text {
      font-size: 16px;
    }
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
  
  .cards-section {
    height: 220px;
    margin-bottom: 20px;
    gap: 10px;
  }
  
  .feature-card {
    padding: 12px;
    
    .feature-icon {
      width: 50px;
      height: 50px;
      margin-bottom: 10px;
      
      svg {
        width: 26px;
        height: 26px;
      }
    }
    
    .feature-content {
      .feature-title {
        font-size: 16px;
        margin-bottom: 4px;
      }
      
      .feature-desc {
        font-size: 12px;
      }
    }
  }
  
  .section-header {
    margin-bottom: 12px;
    
    .section-marker {
      height: 16px;
    }
    
    .section-title {
      font-size: 16px;
    }
  }
  
  .tools-grid {
    gap: 10px;
  }
  
  .tool-card {
    padding: 12px;
    height: 85px;
    
    .tool-content {
      .tool-title {
        font-size: 15px;
        margin-bottom: 4px;
      }
      
      .tool-desc {
        font-size: 12px;
      }
    }
    
    .tool-icon {
      width: 32px;
      height: 32px;
      bottom: 12px;
      right: 12px;
      
      svg {
        width: 18px;
        height: 18px;
      }
    }
  }
  
  .ai-elements {
    .ai-icon {
      width: 45px;
      height: 45px;
      
      svg {
        width: 22px;
        height: 22px;
      }
    }
  }
}

// 中等屏幕设备适配 (iPhone X, 11, 12, 13 等)
@media screen and (min-width: 376px) and (max-width: 428px) {
  .content {
    padding: 36px 14px 40px;
  }
  
  .title-section {
    margin-bottom: 26px;
    
    .title-line {
      font-size: 20px;
      margin-bottom: 8px;
    }
    
    .title-highlight {
      font-size: 30px;
      margin-bottom: 8px;
    }
  }

  .primary-button {
    height: 56px;
    margin-bottom: 28px;
    
    text {
      font-size: 18px;
    }
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
  
  .cards-section {
    height: 240px;
    margin-bottom: 28px;
  }
  
  .feature-card {
    padding: 16px;
    
    .feature-icon {
      width: 60px;
      height: 60px;
      
      svg {
        width: 30px;
        height: 30px;
      }
    }
    
    .feature-content {
      .feature-title {
        font-size: 18px;
      }
      
      .feature-desc {
        font-size: 13px;
      }
    }
  }
  
  .tool-card {
    padding: 16px;
    height: 95px;
    
    .tool-content {
      .tool-title {
        font-size: 16px;
      }
    }
    
    .tool-icon {
      width: 36px;
      height: 36px;
      
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
  
  .ai-elements {
    .ai-icon {
      width: 56px;
      height: 56px;
      
      svg {
        width: 26px;
        height: 26px;
      }
    }
  }
}

// 大屏幕设备适配 (iPhone 14 Pro Max 等)
@media screen and (min-width: 429px) {
  .content {
    max-width: 480px;
    padding: 50px 16px 60px;
  }
  
  .cards-section {
    height: 280px;
  }
}
</style> 