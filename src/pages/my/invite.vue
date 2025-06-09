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
      <!-- 顶部导航栏 -->
      <view class="nav-bar">
        <view class="back-button" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </view>
        <span class="page-title">邀请有礼</span>
        <view class="placeholder"></view>
      </view>
      
      <!-- 邀请奖励信息 -->
      <view class="invite-bg rounded-2xl overflow-hidden relative shadow-lg">
        <!-- 背景装饰 -->
        <view class="absolute left-0 top-0 w-full h-64 bg-gradient"></view>
        <view class="bg-decoration right"></view>
        <view class="bg-decoration left"></view>
        
        <!-- 内容区域 -->
        <view class="invite-content">
          <view class="invite-title">邀请好友注册，立获</view>
          <view class="reward-amount">
            <span class="reward-number">300</span>
            <span class="reward-unit">算力</span>
          </view>
          <view class="reward-desc">
            等于5分钟时长，有效期30天
          </view>
        </view>
      </view>
      
      <!-- 累计奖励和上限 -->
      <view class="reward-stats">
        <view class="reward-total">
          <view class="reward-icon">
            <svg class="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76zM16 17l-3.54-3.54" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19.48 10.52c.3.28.48.67.52 1.08" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </view>
          <view class="reward-text">
            已累计获得 <span class="reward-value">{{ totalInviteReward }}</span> 算力
          </view>
        </view>
        <view class="reward-limit">
          您每月最多可获得3000算力
        </view>
      </view>
      
      <!-- 复制链接按钮 -->
      <view class="copy-section">
        <button class="copy-button" @click="copyInviteLink">
          <svg class="copy-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1M8 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M8 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 0h2a2 2 0 0 1 2 2v3m2 4H10m0 0l3-3m-3 3l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          复制邀请链接
        </button>
        
        <view class="invite-code">
          邀请码: <span class="code-value">{{ inviteCode }}</span>
        </view>
      </view>
      
      <!-- 规则说明 -->
      <view class="rules-section">
        <view class="rules-title">
          <svg class="rules-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          使用说明：
        </view>
        <view class="rules-content">
          <span class="rule-item">• 复制邀请链接或邀请码给好友，对方通过邀请注册成功后，你即可获得300算力。</span>
          <span class="rule-item">• 如发现违规获取算力的行为，将追回算力或冻结账号。</span>
          <span class="rule-item">• 活动解释权归官方所有。</span>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '../../api/services'
import request from '../../utils/request'

const router = useRouter()
const inviteCode = ref('')
const inviteLink = ref('')
const totalInviteReward = ref(0)

// 生成邀请链接
const generateInviteLink = () => {
  if (!inviteCode.value) {
    // 创建一个显示提示的函数
    const showErrorTip = (message) => {
      if (typeof uni !== 'undefined' && typeof uni.showToast === 'function') {
        uni.showToast({
          title: message,
          icon: 'none'
        });
      } else {
        console.error(message);
        alert(message);
      }
    };
    
    showErrorTip('邀请码获取失败，请刷新页面重试');
    return;
  }
  
  // 获取完整的基础URL
  let baseUrl = '';
  
  // 尝试获取完整的URL（协议+域名+路径）
  try {
    baseUrl = window.location.origin + window.location.pathname;
    
    // 移除路径中的页面部分，只保留到应用根目录
    // 例如: https://example.com/pages/my/invite.html -> https://example.com/
    const pathParts = window.location.pathname.split('/');
    const appBasePath = pathParts.slice(0, pathParts.length - 2).join('/');
    
    baseUrl = window.location.origin + appBasePath;
    
    // 确保URL末尾没有斜杠
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }
  } catch (e) {
    console.error('构建基础URL失败:', e);
    baseUrl = window.location.origin || '';
  }
  
  // 生成完整的邀请链接
  inviteLink.value = `${baseUrl}?inviteCode=${inviteCode.value}`;
  console.log('生成的邀请链接:', inviteLink.value);
}

// 复制邀请链接
const copyInviteLink = () => {
  if (!inviteLink.value) {
    generateInviteLink()
  }
  
  // 定义自定义Toast函数，在uni不可用时使用
  const showToast = (options) => {
    if (typeof uni !== 'undefined' && typeof uni.showToast === 'function') {
      uni.showToast(options);
    } else {
      // 创建一个简单的替代toast
      const toast = document.createElement('div');
      toast.textContent = options.title || '';
      toast.style.position = 'fixed';
      toast.style.top = '50%';
      toast.style.left = '50%';
      toast.style.transform = 'translate(-50%, -50%)';
      toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      toast.style.color = '#fff';
      toast.style.padding = '12px 20px';
      toast.style.borderRadius = '4px';
      toast.style.fontSize = '14px';
      toast.style.zIndex = '10000';
      
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 1500);
    }
  };
  
  // 直接使用剪贴板API或降级方案
  try {
    // 首先尝试使用navigator.clipboard API (现代浏览器)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(inviteLink.value)
        .then(() => {
          showToast({
            title: '邀请链接已复制',
            icon: 'success'
          });
        })
        .catch(err => {
          console.error('剪贴板API失败:', err);
          // 降级到createElement方法
          useFallbackCopyMethod();
        });
    } else {
      // 降级方案
      useFallbackCopyMethod();
    }
  } catch (e) {
    console.error('复制操作失败:', e);
    showToast({
      title: '复制失败，请手动复制',
      icon: 'none'
    });
  }
  
  // 降级复制方法
  function useFallbackCopyMethod() {
    const textarea = document.createElement('textarea');
    textarea.value = inviteLink.value;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    
    try {
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      if (successful) {
        showToast({
          title: '邀请链接已复制',
          icon: 'success'
        });
      } else {
        showToast({
          title: '复制失败，请手动复制',
          icon: 'none'
        });
      }
    } catch (err) {
      console.error('Fallback: 复制到剪贴板失败', err);
      showToast({
        title: '复制失败，请手动复制',
        icon: 'none'
      });
    }
    
    document.body.removeChild(textarea);
  }
}

// 获取累计邀请奖励
const getTotalInviteReward = async () => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    // 调用相同的API获取累计奖励，与PC端保持一致
    const res = await request.get('/api/invite/total-reward', { params: { userId } });
    
    if (res && res.code === 200) {
      totalInviteReward.value = res.data || 0;
    }
  } catch (e) {
    totalInviteReward.value = 0;
    console.error('获取累计奖励失败:', e);
    
    // 提供用户友好的错误反馈
    const showToast = (message) => {
      if (typeof uni !== 'undefined' && typeof uni.showToast === 'function') {
        uni.showToast({
          title: message,
          icon: 'none'
        });
      } else {
        console.error(message);
      }
    };
    
    showToast('获取奖励信息失败，请稍后再试');
  }
};

// 获取或生成邀请码
const getInviteCode = async () => {
  try {
    // 先尝试从用户信息中获取邀请码
    const response = await userApi.getUserInfo();
    
    if (response && response.inviteCode) {
      inviteCode.value = response.inviteCode;
    } else {
      // 如果没有邀请码，则请求生成新的邀请码，与PC端保持一致
      const inviteRes = await request.post('/api/user/generate-invite-code');
      
      if (inviteRes && inviteRes.code === 200) {
        inviteCode.value = inviteRes.data;
      }
    }
    
    // 生成邀请链接
    generateInviteLink();
  } catch (error) {
    console.error('获取或生成邀请码失败:', error);
    
    // 提供用户友好的错误反馈
    const showToast = (message) => {
      if (typeof uni !== 'undefined' && typeof uni.showToast === 'function') {
        uni.showToast({
          title: message,
          icon: 'none'
        });
      } else {
        console.error(message);
      }
    };
    
    showToast('获取邀请码失败，请刷新页面或稍后再试');
  }
};

// 返回上一页
const goBack = () => {
  router.back()
}

// 页面加载时获取数据
onMounted(() => {
  getInviteCode()
  getTotalInviteReward()
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

/* 导航栏 */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  margin-bottom: 20px;
  
  .back-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      fill: #fff;
      width: 24px;
      height: 24px;
    }
    
    &:active {
      background: rgba(255, 255, 255, 0.2);
    }
  }
  
  .page-title {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
  }
  
  .placeholder {
    width: 36px;
  }
}

/* 邀请背景卡片 */
.invite-bg {
  position: relative;
  padding: 30px 20px;
  margin-bottom: 20px;
  overflow: hidden;
  
  .bg-gradient {
    background: linear-gradient(135deg, #3b82f6, #4f46e5);
    opacity: 0.9;
  }
  
  .bg-decoration {
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    z-index: 0;
    
    &.right {
      top: -50px;
      right: -50px;
      background: rgba(255, 255, 255, 0.1);
    }
    
    &.left {
      bottom: -100px;
      left: -70px;
      background: rgba(255, 255, 255, 0.08);
    }
  }
}

.invite-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
}

.invite-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 15px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.reward-amount {
  display: flex;
  align-items: flex-end;
  margin-bottom: 15px;
  
  .reward-number {
    font-size: 60px;
    font-weight: 800;
    line-height: 1;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .reward-unit {
    font-size: 24px;
    font-weight: 600;
    margin-left: 5px;
    margin-bottom: 8px;
  }
}

.reward-desc {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 6px 15px;
  font-size: 14px;
  font-weight: 500;
}

/* 累计奖励统计 */
.reward-stats {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  
  .reward-total {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    
    .reward-icon {
      margin-right: 10px;
      color: #3b82f6;
    }
    
    .reward-text {
      font-size: 16px;
      font-weight: 500;
      
      .reward-value {
        color: #3b82f6;
        font-weight: 700;
        font-size: 20px;
        margin: 0 2px;
      }
    }
  }
  
  .reward-limit {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 8px;
  }
}

/* 复制按钮区域 */
.copy-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  
  .copy-button {
    width: 100%;
    height: 54px;
    background: linear-gradient(135deg, #3b82f6, #4f46e5);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
    border: none;
    outline: none;
    
    .copy-icon {
      width: 22px;
      height: 22px;
      margin-right: 8px;
      stroke: currentColor;
    }
    
    &:active {
      opacity: 0.9;
    }
  }
  
  .invite-code {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    
    .code-value {
      font-family: monospace;
      font-weight: 600;
      color: #3b82f6;
    }
  }
}

/* 规则说明 */
.rules-section {
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  
  .rules-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: rgba(255, 255, 255, 0.9);
    
    .rules-icon {
      width: 20px;
      height: 20px;
      margin-right: 6px;
      stroke: currentColor;
    }
  }
  
  .rules-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    .rule-item {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.5;
      display: block;
    }
  }
}
</style> 