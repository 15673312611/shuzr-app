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
      <view class="header">
        <view class="back-button" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </view>
        <view class="title">关于我们</view>
      </view>
      
      <view class="about-content">
        <view class="logo-section">
          <view class="logo-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#6F4CFF" />
                  <stop offset="100%" stop-color="#2F70ED" />
                </linearGradient>
              </defs>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="url(#logoGradient)"/>
            </svg>
            <view class="logo-glow"></view>
          </view>
          <text class="company-name">数字人科技</text>
          <text class="version">版本 1.0.0</text>
        </view>
        
        <view class="card company-intro">
          <view class="card-title">公司介绍</view>
          <view class="card-content">
            <text>我们是专业的数字人SaaS系统提供商，专注于AI驱动的数字人技术研发与应用。通过深度学习和计算机视觉技术，我们提供一站式数字人解决方案。</text>
            <text>公司拥有强大的技术团队和丰富的实施经验，已成功为多个行业客户提供定制化数字人SaaS系统服务，帮助企业快速实现数字化转型。</text>
          </view>
        </view>
        
        <view class="card mission">
          <view class="card-title">产品优势</view>
          <view class="card-content">
            <text>· 高度定制化：根据不同行业需求提供个性化数字人解决方案</text>
            <text>· 快速部署：成熟的SaaS架构，支持快速上云和灵活扩展</text>
            <text>· 持续更新：定期推送系统更新，不断优化用户体验</text>
            <text>· 安全可靠：严格的数据安全保障机制，保护用户隐私</text>
          </view>
        </view>
        
        <view class="card contact">
          <view class="card-title">商务合作</view>
          <view class="card-content contact-info">
            <view class="contact-item">
              <view class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
                </svg>
              </view>
              <text>如需搭建同款数字人系统，请添加客服微信咨询</text>
            </view>
            <view class="contact-item">
              <view class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </view>
              <text>客服微信：soe303</text>
            </view>
            <view class="contact-item copy-wechat" @click="copyWechat">
              <view class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </view>
              <text>点击复制微信号</text>
            </view>
          </view>
        </view>
      </view>
      
      <view class="footer">
        <text>© 2023 数字人科技 版权所有</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回上一页
const goBack = () => {
  router.back()
}

// 复制微信号
const copyWechat = () => {
  const wechatId = 'soe303'
  if (navigator.clipboard) {
    navigator.clipboard.writeText(wechatId).then(() => {
      uni.showToast({
        title: '微信号已复制',
        icon: 'none',
        duration: 1500
      })
    })
  } else {
    // 创建临时元素
    const textArea = document.createElement('textarea')
    textArea.value = wechatId
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      uni.showToast({
        title: '微信号已复制',
        icon: 'none',
        duration: 1500
      })
    } catch (err) {
      uni.showToast({
        title: '复制失败，请手动复制',
        icon: 'none',
        duration: 1500
      })
    }
    document.body.removeChild(textArea)
  }
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

/* 关于内容 */
.about-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Logo区域 */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  
  .logo-container {
    position: relative;
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
    
    svg {
      position: relative;
      z-index: 1;
    }
    
    .logo-glow {
      position: absolute;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: rgba(111, 76, 255, 0.2);
      filter: blur(20px);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 0;
    }
  }
  
  .company-name {
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 8px;
  }
  
  .version {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
  }
}

/* 卡片样式 */
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
  
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 12px;
    background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0.7));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .card-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    text {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
    }
  }
}

/* 联系信息 */
.contact-info {
  .contact-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    
    .contact-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(111, 76, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        fill: #6F4CFF;
      }
    }
    
    text {
      font-size: 13px;
    }
  }
  
  .copy-wechat {
    background: rgba(111, 76, 255, 0.15);
    border-radius: 8px;
    padding: 8px;
    transition: all 0.3s ease;
    
    &:active {
      background: rgba(111, 76, 255, 0.25);
      transform: scale(0.98);
    }
    
    text {
      color: #fff;
      font-weight: 500;
    }
  }
}

/* 页脚 */
.footer {
  text-align: center;
  padding: 20px 0;
  
  text {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }
}
</style> 