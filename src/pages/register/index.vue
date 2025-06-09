<template>
  <view class="register-container">
    <!-- 背景动画元素 -->
    <view class="animated-bg">
      <view class="glow-circle circle-1"></view>
      <view class="glow-circle circle-2"></view>
      <view class="glow-circle circle-3"></view>
      <view class="floating-particles">
        <view class="particle" v-for="i in 20" :key="i"></view>
      </view>
    </view>
    
    <!-- 主体内容 -->
    <view class="content-wrapper">
      <!-- 标题区域 -->
      <view class="title-area">
        <view class="logo-container">
          <view class="logo-glow"></view>
          <u-avatar size="80" icon="account-fill" fontSize="40" color="#000" bgColor="#3ef7c8"></u-avatar>
        </view>
        <text class="title">数字人平台</text>
        <text class="subtitle">创建您的新账户</text>
      </view>
      
      <!-- 表单区域 -->
      <view class="form-area">
        <view class="form-header">
          <text class="form-title">注册</text>
          <text class="form-subtitle"></text>
        </view>
        
        <!-- 用户名输入框 -->
        <view class="input-item">
          <view class="input-icon">
            <text class="iconfont icon-account" style="color: #3ef7c8; font-size: 22px;"></text>
          </view>
          <input
            type="text"
            v-model="form.username"
            placeholder="请输入用户名"
            placeholder-style="color: #666666"
            class="input-field"
          />
          <view class="input-clear" v-if="form.username" @click="form.username = ''">
            <text class="iconfont icon-close" style="color: #7A7A7A; font-size: 18px;"></text>
          </view>
        </view>
        
        <!-- 邮箱输入框 -->
        <view class="input-item">
          <view class="input-icon">
            <text class="iconfont icon-email" style="color: #3ef7c8; font-size: 22px;"></text>
          </view>
          <input
            type="text"
            v-model="form.email"
            placeholder="请输入邮箱"
            placeholder-style="color: #666666"
            class="input-field"
          />
          <view class="input-clear" v-if="form.email" @click="form.email = ''">
            <text class="iconfont icon-close" style="color: #7A7A7A; font-size: 18px;"></text>
          </view>
        </view>
        
        <!-- 图形验证码 -->
        <view class="input-item captcha-item">
          <view class="input-icon">
            <text class="iconfont icon-shield" style="color: #3ef7c8; font-size: 22px;"></text>
          </view>
          <input
            type="text"
            v-model="form.captcha"
            placeholder="验证码"
            placeholder-style="color: #666666"
            class="input-field captcha-input"
            maxlength="4"
          />
          <view class="captcha-image" @click="refreshCaptcha">
            <img :src="captchaImage" mode="aspectFit"></img>
          </view>
        </view>
        
        <!-- 密码输入框 -->
        <view class="input-item">
          <view class="input-icon">
            <text class="iconfont icon-lock" style="color: #3ef7c8; font-size: 22px;"></text>
          </view>
          <input
            :type="passwordVisible ? 'text' : 'password'"
            v-model="form.password"
            placeholder="请输入密码"
            placeholder-style="color: #666666"
            class="input-field"
          />
          <view class="input-clear" @click="togglePasswordVisibility">
            <text class="iconfont" :class="passwordVisible ? 'icon-eye-fill' : 'icon-eye-off'" style="color: #7A7A7A; font-size: 18px;"></text>
          </view>
        </view>
        
        <!-- 确认密码输入框 -->
        <view class="input-item">
          <view class="input-icon">
            <text class="iconfont icon-lock-fill" style="color: #3ef7c8; font-size: 22px;"></text>
          </view>
          <input
            :type="passwordVisible ? 'text' : 'password'"
            v-model="form.confirmPassword"
            placeholder="请确认密码"
            placeholder-style="color: #666666"
            class="input-field"
          />
          <view class="input-clear" v-if="form.confirmPassword" @click="form.confirmPassword = ''">
            <text class="iconfont icon-close" style="color: #7A7A7A; font-size: 18px;"></text>
          </view>
        </view>
        
        <!-- 协议同意 -->
        <view class="agreement-row">
          <view class="checkbox-container" @click="toggleAgreeTerms">
            <view class="checkbox" :class="{'checkbox-active': agreeTerms}">
              <text class="iconfont icon-check" v-if="agreeTerms" style="color: #000; font-size: 12px;"></text>
            </view>
            <text style="color: #bbbbbb; margin-left: 8px;">
              我已阅读并同意
              <text class="agreement-link" @click.stop="showAgreement = true">《用户协议》</text>
            </text>
          </view>
        </view>
        
        <!-- 添加物理间隔 -->
        <view class="spacer-element"></view>
        
        <!-- 注册按钮 -->
        <view class="btn-wrapper">
          <button 
            class="register-btn" 
            :class="{'register-btn-loading': loading}"
            @click="handleRegister"
          >
            <text v-if="!loading">创建账号</text>
            <view v-else class="loading-spinner"></view>
          </button>
          <view class="btn-glow"></view>
        </view>
        
        <!-- 登录链接 -->
        <view class="login-link">
          <text>已有账号?</text>
          <text class="link" @click="goToLogin">立即登录</text>
        </view>
      </view>
    </view>
    <UserAgreementModal :visible="showAgreement" @close="showAgreement = false" />
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '../../api/services'
import UserAgreementModal from '../../components/UserAgreementModal.vue'

const router = useRouter()
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  captcha: '',
  captchaId: '',
  inviteCode: ''
})
const passwordVisible = ref(false)
const agreeTerms = ref(false)
const loading = ref(false)
const captchaImage = ref('')
const showAgreement = ref(false)

// 切换密码可见性
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

// 切换同意条款
const toggleAgreeTerms = () => {
  agreeTerms.value = !agreeTerms.value
}

// 验证邮箱格式
const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

// 生成验证码图片
const generateCaptchaImage = async () => {
  try {
    const response = await fetch('/api/captcha/generate')
    const data = await response.json()
    if (data.image) {
      captchaImage.value = 'data:image/jpeg;base64,' + data.image
      form.captchaId = data.captchaId
    } else {
      console.error('获取验证码失败')
    }
  } catch (error) {
    console.error('获取验证码失败:', error)
  }
}

// 刷新验证码
const refreshCaptcha = () => {
  generateCaptchaImage()
}

// 处理注册
const handleRegister = async () => {
  try {
    // 表单验证
    if (!form.username || !form.email || !form.password || !form.confirmPassword || !form.captcha) {
      uni.showToast({
        title: '请完整填写注册信息',
        icon: 'none'
      })
      return
    }
    
    // 验证码校验
    if (!form.captcha) {
      uni.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      refreshCaptcha()
      return
    }
    
    if (!isValidEmail(form.email)) {
      uni.showToast({
        title: '请输入有效的邮箱地址',
        icon: 'none'
      })
      return
    }
    
    if (form.password.length < 6) {
      uni.showToast({
        title: '密码长度至少为6位',
        icon: 'none'
      })
      return
    }
    
    if (form.password !== form.confirmPassword) {
      uni.showToast({
        title: '两次输入的密码不一致',
        icon: 'none'
      })
      return
    }
    
    if (!agreeTerms.value) {
      uni.showToast({ title: '请阅读并同意用户协议', icon: 'none' })
      return
    }
    
    loading.value = true
    
    const data = {
      username: form.username,
      email: form.email,
      password: form.password,
      captcha: form.captcha,
      captchaId: form.captchaId
    }
    
    // 如果有邀请码，添加到请求数据中
    if (form.inviteCode) {
      data.inviteCode = form.inviteCode
    }
    
    const response = await userApi.register(data)
    console.log('注册响应:', response)
    
    if (response && response.token) {
      // 保存认证信息
      localStorage.setItem('token', response.token)
      localStorage.setItem('userId', response.userId || '1')
      
      // 清除已使用的邀请码
      localStorage.removeItem('inviteCode')
      
      // 获取重定向URL
      const redirectUrl = localStorage.getItem('redirectUrl') || '/pages/asset/index'
      localStorage.removeItem('redirectUrl') // 使用后删除
      
      // 使用新的处理函数
      handleRegisterSuccess(redirectUrl)
    } else {
      throw new Error('注册失败，请重试')
    }
  } catch (error) {
    console.error('注册失败:', error)
    uni.showToast({
      title: error.message || '注册失败，请重试',
      icon: 'none'
    })
    // 刷新验证码
    refreshCaptcha()
  } finally {
    loading.value = false
  }
}

// 去登录页面
const goToLogin = () => {
  router.push('/pages/login/index')
}

// 处理注册成功后的跳转
const handleRegisterSuccess = (redirectUrl) => {
  // 显示成功提示
  uni.showToast({
    title: '注册成功',
    icon: 'success'
  })
  
  // 延迟导航以确保Toast显示
  setTimeout(() => {
    router.push('/pages/index/index')
  }, 1000)
}

// 页面加载时初始化
onMounted(() => {
  // 页面初始化逻辑
  generateCaptchaImage()
  
  // 从localStorage中获取邀请码
  const storedInviteCode = localStorage.getItem('inviteCode')
  if (storedInviteCode) {
    console.log('使用存储的邀请码:', storedInviteCode)
    form.inviteCode = storedInviteCode
  }
})
</script>

<style lang="scss" scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #0a192f; /* 深蓝色背景 */
  color: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

/* 背景动画 */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  
  .glow-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.15;
    
    &.circle-1 {
      top: -100px;
      left: -100px;
      width: 300px;
      height: 300px;
      background: #64ffda; /* 科技感青色 */
      animation: float 15s ease-in-out infinite;
    }
    
    &.circle-2 {
      bottom: -150px;
      right: -50px;
      width: 250px;
      height: 250px;
      background: #4a90e2; /* 科技感蓝色 */
      animation: float 20s ease-in-out infinite reverse;
    }
    
    &.circle-3 {
      top: 40%;
      left: 60%;
      width: 180px;
      height: 180px;
      background: #ff6b6b; /* 科技感红色 */
      animation: float 25s ease-in-out infinite;
    }
  }
  
  .floating-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    
    .particle {
      position: absolute;
      width: 2px;
      height: 2px;
      background-color: rgba(100, 255, 218, 0.6); /* 科技感青色 */
      border-radius: 50%;
      
      @for $i from 1 through 20 {
        &:nth-child(#{$i}) {
          left: random(100) * 1%;
          top: random(100) * 1%;
          animation: 
            twinkle #{random(5) + 3}s ease-in-out infinite alternate,
            float #{random(20) + 10}s ease-in-out infinite;
          animation-delay: #{random(5)}s;
        }
      }
    }
  }
}

@keyframes float {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, 20px);
  }
  100% {
    transform: translate(0, 0);
  }
}

@keyframes twinkle {
  0% {
    opacity: 0.2;
    transform: scale(1);
  }
  100% {
    opacity: 0.8;
    transform: scale(1.5);
  }
}

/* 主体内容 */
.content-wrapper {
  flex: 1;
  padding: 20px 30px 40px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 标题区域 */
.title-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  
  .logo-container {
    position: relative;
    margin-bottom: 20px;
    
    .logo-glow {
      position: absolute;
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: rgba(100, 255, 218, 0.2); /* 科技感青色 */
      filter: blur(15px);
      z-index: -1;
      animation: pulse 3s ease-in-out infinite;
    }
  }
  
  .title {
    font-size: 30px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 5px;
    letter-spacing: 2px;
    text-shadow: 0 0 10px rgba(100, 255, 218, 0.3); /* 科技感青色 */
    animation: fadeIn 1s ease-out;
  }
  
  .subtitle {
    font-size: 16px;
    color: #7A7A7A;
    animation: fadeIn 1s ease-out 0.3s backwards;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.4;
  }
  100% {
    transform: scale(1);
    opacity: 0.2;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 表单区域 */
.form-area {
  background: linear-gradient(135deg, rgba(18, 30, 52, 0.85) 0%, rgba(28, 38, 71, 0.9) 100%);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3),
              inset 1px 1px 0px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(100, 255, 218, 0.08);
  animation: slideUp 0.8s ease-out;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(100, 255, 218, 0.03) 0%, transparent 70%);
    z-index: 0;
    pointer-events: none;
  }
  
  .form-header {
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
    
    .form-title {
      font-size: 22px;
      font-weight: 600;
      color: #ffffff;
      display: block;
      margin-bottom: 5px;
      letter-spacing: 0.5px;
      text-shadow: 0 0 10px rgba(100, 255, 218, 0.4);
    }
    
    .form-subtitle {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
}

.input-item {
  margin-bottom: 20px;
  background: rgba(25, 35, 60, 0.6);
  border: 1px solid rgba(100, 255, 218, 0.12);
  border-radius: 12px;
  padding: 8px 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  
  &:focus-within {
    border-color: rgba(100, 255, 218, 0.5);
    box-shadow: 0 0 0 2px rgba(100, 255, 218, 0.12), 
                inset 0 1px 3px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  &.captcha-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .captcha-image {
      width: 110px;
      height: 42px;
      background-color: rgba(10, 25, 47, 0.6);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 5px;
      z-index: 10;
      position: relative;
      border: 1px solid rgba(100, 255, 218, 0.3);
      padding: 0;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: rgba(100, 255, 218, 0.5);
        box-shadow: 0 0 8px rgba(100, 255, 218, 0.2);
      }
      
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }
    }
    
    .input-field {
      flex: 0.45;
      min-width: 80px;
      padding-right: 5px;
    }
  }
  
  .input-icon {
    margin-right: 10px;
    width: 24px;
    text-align: center;
  }
  
  .input-field {
    flex: 1;
    background: transparent;
    border: none;
    height: 40px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
  }
  
  .input-clear {
    padding: 5px;
  }
}

.agreement-row {
  margin: 18px 0 0 0; /* 移除底部margin，让spacer元素控制间距 */
  position: relative;
  z-index: 1;
  
  .checkbox-container {
    display: flex;
    align-items: center;
    
    .checkbox {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid rgba(100, 255, 218, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      
      &.checkbox-active {
        background-color: rgba(100, 255, 218, 0.9);
        border-color: rgba(100, 255, 218, 0.9);
        box-shadow: 0 0 8px rgba(100, 255, 218, 0.5);
      }
    }
    
    .agreement-link {
      color: rgba(100, 255, 218, 0.9);
      margin: 0 2px;
      cursor: pointer;
      text-decoration: underline;
      transition: all 0.2s ease;
      
      &:active {
        color: #ffffff;
      }
    }
  }
}

/* 添加间隔元素样式 */
.spacer-element {
  height: 40px;
  width: 100%;
  display: block;
}

.btn-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  margin-top: 0; /* 重置为0，让spacer元素控制间距 */
  z-index: 1;
  
  .register-btn {
    width: 100%;
    height: 48px;
    border-radius: 24px;
    background: linear-gradient(135deg, #4a90e2 0%, #5637d7 100%);
    color: #ffffff;
    font-weight: bold;
    letter-spacing: 2px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.98);
      background: linear-gradient(135deg, #4186d2 0%, #502dc7 100%);
    }
    
    &.register-btn-loading {
      opacity: 0.8;
    }
  }
  
  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 0.8s linear infinite;
  }
  
  .btn-glow {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 50px;
    background: linear-gradient(135deg, #4a90e2 0%, #5637d7 100%);
    opacity: 0.25;
    filter: blur(15px);
    z-index: -1;
  }
}

/* 登录链接 */
.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  position: relative;
  z-index: 1;
  
  .link {
    color: rgba(100, 255, 218, 0.9);
    margin-left: 5px;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:active {
      opacity: 0.7;
    }
  }
}

/* 响应式适配 */
@media screen and (max-width: 375px) {
  .content-wrapper {
    padding: 15px 20px 30px;
  }
  
  .title-area {
    margin-bottom: 20px;
    
    .title {
      font-size: 26px;
    }
    
    .subtitle {
      font-size: 14px;
    }
  }
  
  .form-area {
    padding: 20px;
    
    .form-header {
      margin-bottom: 16px;
      
      .form-title {
        font-size: 20px;
      }
    }
  }
  
  .input-item {
    margin-bottom: 16px;
    padding: 6px 10px;
    
    &.captcha-item {
      .captcha-image {
        width: 100px;
        height: 38px;
      }
    }
    
    .input-field {
      height: 36px;
      font-size: 15px;
    }
  }
  
  .agreement-row {
    margin: 14px 0 0 0;
  }
  
  .spacer-element {
    height: 30px;
  }
  
  .btn-wrapper {
    margin-bottom: 16px;
    
    .register-btn {
      height: 44px;
      font-size: 15px;
    }
  }
}

@media screen and (min-width: 376px) and (max-width: 428px) {
  .content-wrapper {
    padding: 20px 25px 35px;
  }
  
  .title-area {
    margin-bottom: 25px;
    
    .title {
      font-size: 28px;
    }
  }
  
  .form-area {
    padding: 22px;
  }
  
  .input-item {
    margin-bottom: 18px;
  }
  
  .spacer-element {
    height: 35px;
  }
}

@media screen and (min-width: 429px) {
  .content-wrapper {
    padding: 20px 30px 40px;
    max-width: 480px;
    margin: 0 auto;
    width: 100%;
  }
  
  .form-area {
    padding: 30px;
  }
  
  .input-item {
    padding: 10px 14px;
    
    .input-field {
      height: 42px;
    }
    
    &.captcha-item {
      .captcha-image {
        width: 120px;
        height: 46px;
      }
    }
  }
  
  .btn-wrapper {
    .register-btn {
      height: 52px;
    }
  }
}
</style> 