<template>
  <view class="page-container">
    <!-- 背景元素 -->
    <view class="bg-elements">
      <view class="bg-gradient"></view>
      <view class="bg-circle circle1"></view>
      <view class="bg-circle circle2"></view>
    </view>
    
    <!-- 页面内容 -->
    <view class="content-wrapper">
      <!-- 用户信息区域 -->
      <view class="user-info-section">
        <view class="user-card">
          <view class="user-card-bg-pattern"></view>
          <view class="user-card-content">
            <view class="user-avatar-container" @click="showLoginModal = true">
              <view class="avatar-glow"></view>
              <view class="user-icon">
                <svg t="1690426362582" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2358" width="36" height="36"><path d="M512 512a204.8 204.8 0 1 0 0-409.6 204.8 204.8 0 0 0 0 409.6z m0 102.4c-188.16 0-341.76 146.688-354.56 332.8a30.208 30.208 0 0 0 8.704 22.016 30.72 30.72 0 0 0 22.016 9.984h647.68a30.72 30.72 0 0 0 22.016-9.984 30.208 30.208 0 0 0 8.704-22.016c-12.8-186.112-166.4-332.8-354.56-332.8z" p-id="2359"></path></svg>
              </view>
            </view>
            <view class="user-details">
              <text class="user-account">{{ userInfo.username || '未登录' }}</text>
            </view>
          </view>
          <view class="user-card-light"></view>
        </view>
      </view>
      
      <!-- 当前算力区域 -->
      <view class="assets-section">
        <view class="assets-grid">
          <view class="power-card">
            <view class="power-container">
              <view class="power-left">
                <view class="power-icon-wrapper">
                  <view class="power-icon-bg"></view>
                  <svg t="1690433433130" class="power-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3541" width="32" height="32"><path d="M915.2 561.066667c-8.533333-19.2-29.866667-29.866667-51.2-25.6l-234.666667 42.666666 42.666667-384c2.133333-19.2-6.4-38.4-21.333333-49.066666-17.066667-10.666667-38.4-10.666667-53.333334 4.266666l-384 320c-14.933333 12.8-21.333333 34.133333-14.933333 53.333334 8.533333 19.2 29.866667 29.866667 51.2 25.6l234.666667-42.666667-42.666667 384c-2.133333 19.2 6.4 38.4 21.333333 49.066667 6.4 4.266667 14.933333 6.4 23.466667 6.4 10.666667 0 21.333333-4.266667 29.866667-10.666667l384-320c14.933333-12.8 21.333333-34.133333 14.933333-53.333333z" fill="#64B5F6" p-id="3542"></path></svg>
                </view>
                <text class="power-label">算力余额</text>
              </view>
              <view class="power-right">
                <text class="power-value">{{ assets.computePower || 0 }}</text>
                <view class="power-refresh" @click="refreshPage">
                  <svg t="1690433597495" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4638" width="18" height="18"><path d="M866.133333 512c0 195.157333-158.208 353.365333-353.365333 353.365333-130.56 0-244.906667-70.826667-306.389333-176.256l63.957333-36.949333c49.962667 86.357333 143.530667 144.213333 242.432 144.213333 159.146667 0 288.384-129.28 288.384-288.384a64.981333 64.981333 0 0 0-130.005333 0 159.018667 159.018667 0 0 1-158.378667 158.378667 159.061333 159.061333 0 0 1-158.421333-158.378667 159.061333 159.061333 0 0 1 158.421333-158.378667c26.538667 0 51.84 5.504 74.794667 15.445334l-32 55.424 144.810666 83.626666-15.36-167.594666-31.445333 54.442666A223.317333 223.317333 0 0 0 512 288.682667c-123.136 0-223.36 100.224-223.36 223.36 0 123.136 100.224 223.36 223.36 223.36 123.157333 0 223.36-100.224 223.36-223.36a129.962667 129.962667 0 0 1 130.773333-130.005334c71.957333 0 130.005333 57.109333 130.005334 130.005334z" p-id="4639"></path></svg>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 个人中心菜单 -->
      <view class="menu-section">
        <view class="section-title">
          <text>个人中心</text>
        </view>
        <view class="menu-grid">
          <view class="menu-item" @click="showRechargeModal">
            <view class="menu-icon recharge-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
            </view>
            <text class="menu-label">充值</text>
          </view>
          <view class="menu-item" @click="goToInvite">
            <view class="menu-icon invite-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </view>
            <text class="menu-label">邀请有礼</text>
          </view>
          <view class="menu-item" @click="goToTutorial">
            <view class="menu-icon tutorial-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/>
              </svg>
            </view>
            <text class="menu-label">新手教程</text>
          </view>
          <view class="menu-item" @click="showCustomerService">
            <view class="menu-icon support-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/>
              </svg>
            </view>
            <text class="menu-label">联系客服</text>
          </view>
          <view class="menu-item" @click="goToAbout">
            <view class="menu-icon about-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/>
              </svg>
            </view>
            <text class="menu-label">关于我们</text>
          </view>
        </view>
      </view>
      
      <!-- 退出登录按钮 -->
      <view class="logout-button" @click="logout">
        <text>退出登录</text>
      </view>
    </view>
    
    <!-- 充值弹窗 -->
    <view class="modal" v-if="showRecharge">
      <view class="modal-mask" @click="hideRechargeModal"></view>
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">充值</text>
          <view class="modal-close" @click="hideRechargeModal">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </view>
        </view>
        <view class="modal-body">
          <view class="input-field">
            <text class="input-label">卡密</text>
            <input 
              v-model="rechargeCode" 
              type="text" 
              placeholder="请输入卡密" 
              class="input"
            />
          </view>
          <view class="recharge-button" @click="recharge">
            <text>确认充值</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 客服信息弹窗 -->
    <view class="modal" v-if="showService">
      <view class="modal-mask" @click="hideCustomerService"></view>
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">联系客服</text>
          <view class="modal-close" @click="hideCustomerService">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </view>
        </view>
        <view class="modal-body">
          <view class="service-info">
            <text class="service-title">客服微信</text>
            <text class="service-value">soe303</text>
          </view>
          <view class="copy-button" @click="copyWechat">
            <text>复制微信号</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '../../api/services'

const router = useRouter()

// 用户信息
const userInfo = ref({
  username: ''
})

// 资产信息
const assets = ref({
  computePower: 0
})

// 弹窗状态
const showRecharge = ref(false)
const showService = ref(false)
const rechargeCode = ref('')

// 获取用户信息
const getUserInfo = async () => {
  try {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      // 未登录，跳转到登录页
      router.push('/pages/login/index')
      return
    }
    
    // 使用userApi.getUserInfo()方法请求/api/auth/check接口
    const response = await userApi.getUserInfo()
    console.log('用户信息响应:', response)
    
    // 处理响应数据
    userInfo.value.username = response.username || ''
    assets.value.computePower = response.power || 0
    userInfo.value.inviteCode = response.inviteCode || ''
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 刷新页面
const refreshPage = () => {
  window.location.reload()
}

// 页面跳转函数
const goToComputePower = () => {
  router.push('/pages/my/compute')
}

const goToInvite = () => {
  router.push('/pages/my/invite')
}

const goToTutorial = () => {
  router.push('/pages/my/tutorial')
}

const goToAbout = () => {
  router.push('/pages/my/about')
}

// 显示充值弹窗
const showRechargeModal = () => {
  showRecharge.value = true
}

// 隐藏充值弹窗
const hideRechargeModal = () => {
  showRecharge.value = false
  rechargeCode.value = ''
}

// 充值操作
const recharge = async () => {
  if (!rechargeCode.value) {
    uni.showToast({
      title: '请输入卡密',
      icon: 'none'
    })
    return
  }
  
  try {
    // 调用充值API
    uni.showLoading({
      title: '充值中...'
    })
    
    // 模拟API调用
    setTimeout(() => {
      uni.hideLoading()
      uni.showToast({
        title: '充值成功',
        icon: 'success'
      })
      hideRechargeModal()
      getUserInfo() // 重新获取用户信息
    }, 1500)
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: '充值失败',
      icon: 'none'
    })
  }
}

// 显示客服信息
const showCustomerService = () => {
  showService.value = true
}

// 隐藏客服信息
const hideCustomerService = () => {
  showService.value = false
}

// 复制微信号
const copyWechat = () => {
  uni.setClipboardData({
    data: 'soe303',
    success: () => {
      uni.showToast({
        title: '微信号已复制',
        icon: 'success'
      })
    }
  })
}

// 退出登录
const logout = async () => {
  try {
    await userApi.logout()
    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    // 跳转到登录页
    router.push('/pages/login/index')
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}

// 页面加载时获取数据
onMounted(() => {
  getUserInfo()
})
</script>

<style lang="scss" scoped>
/* 页面基础样式 */
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
  position: absolute;
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
    background: radial-gradient(circle, rgba(111, 76, 255, 0.18) 0%, rgba(47, 112, 237, 0.06) 50%, transparent 70%);
    filter: blur(60px);
  }
  
  .bg-circle {
    position: absolute;
    border-radius: 50%;
    
    &.circle1 {
      top: 10%;
      left: -10%;
      width: 40%;
      height: 40%;
      background: radial-gradient(circle, rgba(47, 112, 237, 0.06) 0%, transparent 70%);
      filter: blur(50px);
    }
    
    &.circle2 {
      bottom: -20%;
      right: -5%;
      width: 50%;
      height: 50%;
      background: radial-gradient(circle, rgba(111, 76, 255, 0.06) 0%, transparent 70%);
      filter: blur(60px);
    }
  }
}

/* 内容样式 */
.content-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  padding: 20px;
  padding-top: calc(20px + env(safe-area-inset-top, 0));
  padding-bottom: calc(80px + env(safe-area-inset-bottom, 0));
  max-width: 100%;
  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* 用户信息区域 */
.user-info-section {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  background-color: rgba(16, 23, 41, 0.6);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(111, 76, 255, 0.3);
  position: relative;
  backdrop-filter: blur(10px);
  
  .user-card {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    
    .user-card-bg-pattern {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        linear-gradient(135deg, rgba(47, 112, 237, 0.05) 0%, transparent 70%),
        radial-gradient(circle at 20% 30%, rgba(111, 76, 255, 0.08) 0%, transparent 60%);
      animation: pulseBg 4s infinite alternate;
    }
    
    .user-card-content {
      position: relative;
      z-index: 1;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .user-avatar-container {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 16px;
        background: linear-gradient(135deg, #6f4cff, #2f70ed);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        box-shadow: 0 4px 20px rgba(111, 76, 255, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.1);
        
        .user-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          
          svg {
            fill: #fff;
          }
        }
        
        .avatar-glow {
          position: absolute;
          top: -10%;
          left: -10%;
          width: 120%;
          height: 120%;
          background: radial-gradient(circle, rgba(111, 76, 255, 0.4) 0%, transparent 70%);
          filter: blur(8px);
          z-index: 1;
          animation: pulse 3s infinite alternate;
        }
        
        &:before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, rgba(111, 76, 255, 0.7), rgba(47, 112, 237, 0.7));
          border-radius: 50%;
          z-index: -1;
          opacity: 0;
          animation: glow 3s infinite;
        }
      }
      
      .user-details {
        flex: 1;
        
        .user-account {
          font-size: 24px;
          font-weight: 600;
          color: #fff;
          text-shadow: 0 0 10px rgba(111, 76, 255, 0.4);
          margin-bottom: 5px;
          display: block;
          background: linear-gradient(90deg, #fff 0%, #a3aaff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: 'Arial', sans-serif;
          letter-spacing: 0.5px;
        }
      }
    }
    
    .user-card-light {
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 150px;
      background: linear-gradient(135deg, rgba(111, 76, 255, 0.1), rgba(47, 112, 237, 0.05));
      transform: rotate(-45deg) translate(50%, -50%);
      filter: blur(20px);
      animation: rotateLight 8s infinite linear;
    }
  }
}

/* 当前算力区域 */
.assets-section {
  background-color: rgba(16, 23, 41, 0.6);
  border-radius: 16px;
  padding: 15px 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: none;
  position: relative;
  backdrop-filter: blur(10px);
  overflow: hidden;
  
  &:before {
    display: none;
  }
  
  .assets-grid {
    display: flex;
    justify-content: center;
    position: relative;
    z-index: 2;
    
    .power-card {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      
      .power-container {
        width: 100%;
        background: rgba(20, 30, 48, 0.7);
        border-radius: 12px;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        border: 1px solid rgba(100, 181, 246, 0.15);
        
        &:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(100, 181, 246, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .power-left {
          display: flex;
          align-items: center;
          position: relative;
          
          .power-icon-wrapper {
            position: relative;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            
            .power-icon-bg {
              position: absolute;
              width: 36px;
              height: 36px;
              background: radial-gradient(circle, rgba(100, 181, 246, 0.2) 0%, transparent 70%);
              border-radius: 50%;
              animation: pulse 2.5s infinite alternate;
            }
            
            .power-icon {
              position: relative;
              z-index: 2;
              width: 28px;
              height: 28px;
              filter: drop-shadow(0 0 5px rgba(100, 181, 246, 0.6));
            }
          }
          
          .power-label {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.85);
            font-weight: 500;
            letter-spacing: 0.5px;
          }
        }
        
        .power-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          position: relative;
          
          .power-value {
            font-size: 24px;
            font-weight: 700;
            color: #64B5F6;
            letter-spacing: 0.5px;
            text-shadow: 0 0 10px rgba(100, 181, 246, 0.3);
            font-family: 'Arial', sans-serif;
            margin-right: 12px;
          }
          
          .power-refresh {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(100, 181, 246, 0.2);
            box-shadow: 0 0 10px rgba(100, 181, 246, 0.1);
            transition: all 0.3s ease;
            
            &:active {
              transform: rotate(180deg);
              background: rgba(100, 181, 246, 0.1);
            }
            
            svg {
              fill: rgba(255, 255, 255, 0.7);
              transition: all 0.3s ease;
            }
          }
        }
      }
    }
  }
}

@keyframes pulse {
  0% {
    opacity: 0.4;
    transform: scale(0.95);
  }
  100% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

@keyframes rotateLight {
  from {
    transform: rotate(-45deg) translate(50%, -50%);
  }
  to {
    transform: rotate(315deg) translate(50%, -50%);
  }
}

@keyframes pulseBg {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

@keyframes glow {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
  }
}

/* 菜单区域 */
.menu-section {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 20px;
  }
  
  .menu-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px 16px;
    
    .menu-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .menu-icon {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        
        svg {
          fill: #fff;
          width: 28px;
          height: 28px;
        }
        
        &.recharge-icon {
          background: linear-gradient(135deg, #6f4cff, #2f70ed);
        }
        
        &.invite-icon {
          background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
        }
        
        &.tutorial-icon {
          background: linear-gradient(135deg, #a1c4fd, #c2e9fb);
        }
        
        &.support-icon {
          background: linear-gradient(135deg, #84fab0, #8fd3f4);
        }
        
        &.about-icon {
          background: linear-gradient(135deg, #fa709a, #fee140);
        }
      }
      
      .menu-label {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

/* 退出登录按钮 */
.logout-button {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 25px;
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  text {
    font-size: 16px;
    color: #ff6b6b;
  }
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .modal-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
  }
  
  .modal-content {
    position: relative;
    width: 85%;
    background: #1a2035;
    border-radius: 16px;
    padding: 20px;
    z-index: 101;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(111, 76, 255, 0.2);
    
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      
      .modal-title {
        font-size: 18px;
        font-weight: 600;
        color: #fff;
        background: linear-gradient(to right, #6f4cff, #2f70ed);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      .modal-close {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        
        svg {
          fill: #fff;
          width: 20px;
          height: 20px;
        }
      }
    }
    
    .modal-body {
      .input-field {
        margin-bottom: 20px;
        
        .input-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 8px;
          display: block;
        }
        
        .input {
          width: 100%;
          height: 48px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(111, 76, 255, 0.2);
          border-radius: 12px;
          padding: 0 16px;
          font-size: 16px;
          color: #fff;
          box-sizing: border-box;
          
          &::placeholder {
            color: rgba(255, 255, 255, 0.3);
          }
        }
      }
      
      .recharge-button, .copy-button {
        width: 100%;
        height: 48px;
        background: linear-gradient(135deg, #6f4cff, #2f70ed);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        
        text {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }
      }
      
      .service-info {
        text-align: center;
        padding: 20px 0;
        
        .service-title {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 10px;
        }
        
        .service-value {
          font-size: 24px;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(to right, #6f4cff, #2f70ed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
  }
}

// 添加设备专用媒体查询
// 小屏幕设备适配 (iPhone SE 等)
@media screen and (max-width: 375px) {
  .content-wrapper {
    padding: 12px;
    padding-top: calc(12px + env(safe-area-inset-top, 0));
    padding-bottom: calc(60px + env(safe-area-inset-bottom, 0));
  }
  
  .user-info-section {
    padding: 15px;
    margin-bottom: 16px;
    
    .user-card {
      .user-card-content {
        .user-avatar-container {
          width: 50px;
          height: 50px;
          margin-right: 12px;
          
          svg {
            width: 28px;
            height: 28px;
          }
        }
        
        .user-details {
          .user-account {
            font-size: 20px;
          }
        }
      }
    }
  }
  
  .assets-section {
    padding: 12px 15px;
    margin-bottom: 16px;
    
    .assets-grid {
      .power-card {
        .power-container {
          padding: 15px;
          
          .power-left {
            .power-icon-wrapper {
              width: 38px;
              height: 38px;
              margin-right: 10px;
              
              .power-icon {
                width: 24px;
                height: 24px;
              }
            }
            
            .power-label {
              font-size: 14px;
            }
          }
          
          .power-right {
            .power-value {
              font-size: 20px;
              margin-right: 8px;
            }
            
            .power-refresh {
              width: 28px;
              height: 28px;
              
              svg {
                width: 16px;
                height: 16px;
              }
            }
          }
        }
      }
    }
  }
  
  .menu-section {
    padding: 15px;
    margin-bottom: 16px;
    
    .section-title {
      font-size: 15px;
      margin-bottom: 15px;
    }
    
    .menu-grid {
      gap: 16px 10px;
      
      .menu-item {
        .menu-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          margin-bottom: 8px;
          
          svg {
            width: 24px;
            height: 24px;
          }
        }
        
        .menu-label {
          font-size: 12px;
        }
      }
    }
  }
  
  .logout-button {
    height: 45px;
    margin-top: 16px;
    
    text {
      font-size: 15px;
    }
  }
  
  .modal {
    .modal-content {
      padding: 15px;
      
      .modal-header {
        margin-bottom: 15px;
        
        .modal-title {
          font-size: 16px;
        }
        
        .modal-close {
          width: 32px;
          height: 32px;
          
          svg {
            width: 18px;
            height: 18px;
          }
        }
      }
      
      .modal-body {
        .input-field {
          margin-bottom: 15px;
          
          .input-label {
            font-size: 13px;
          }
          
          .input {
            height: 42px;
            font-size: 15px;
          }
        }
        
        .recharge-button, .copy-button {
          height: 42px;
          
          text {
            font-size: 15px;
          }
        }
        
        .service-info {
          padding: 15px 0;
          
          .service-title {
            font-size: 13px;
          }
          
          .service-value {
            font-size: 20px;
          }
        }
      }
    }
  }
}

// 中等屏幕设备适配 (iPhone X, 11, 12, 13 等)
@media screen and (min-width: 376px) and (max-width: 428px) {
  .content-wrapper {
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top, 0));
    padding-bottom: calc(70px + env(safe-area-inset-bottom, 0));
  }
  
  .user-info-section {
    padding: 18px;
    margin-bottom: 20px;
  }
  
  .assets-section {
    padding: 14px 18px;
    margin-bottom: 20px;
  }
  
  .menu-section {
    padding: 18px;
    
    .menu-grid {
      gap: 20px 12px;
      
      .menu-item {
        .menu-icon {
          width: 52px;
          height: 52px;
          
          svg {
            width: 26px;
            height: 26px;
          }
        }
      }
    }
  }
}

// 大屏幕设备适配 (iPhone 14 Pro Max 等)
@media screen and (min-width: 429px) {
  .content-wrapper {
    max-width: 480px;
    margin: 0 auto;
  }
  
  .menu-section {
    .menu-grid {
      gap: 28px 20px;
      
      .menu-item {
        .menu-icon {
          width: 60px;
          height: 60px;
          
          svg {
            width: 30px;
            height: 30px;
          }
        }
        
        .menu-label {
          font-size: 15px;
        }
      }
    }
  }
}
</style> 