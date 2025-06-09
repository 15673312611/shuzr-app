<template>
  <view class="page-container">
    <!-- 背景元素 -->
    <view class="bg-elements">
      <view class="bg-gradient"></view>
      <view class="bg-grid"></view>
      <view class="bg-circle circle1"></view>
      <view class="bg-circle circle2"></view>
      <view class="bg-dots"></view>
      <view class="bg-line"></view>
      <view class="bg-glow glow1"></view>
      <view class="bg-glow glow2"></view>
    </view>
    
    <!-- 页面内容 -->
    <view class="content-wrapper">
      <!-- 顶部导航栏 -->
      <view class="nav-header">
        <view class="header-title">
          <text class="title-text">我的数字人</text>
          <text class="title-sub">管理您的所有数字形象</text>
        </view>
        <view class="create-button" @click="createNewAvatar">
          <view class="button-inner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <text>创建数字人</text>
          </view>
        </view>
      </view>
      
      <!-- 有数据时的内容 -->
      <block v-if="avatars.length > 0">
        <!-- 数字人列表 -->
        <view class="avatar-list">
          <view 
            class="avatar-card" 
            v-for="(avatar, index) in avatars" 
            :key="avatar.id"
          >
            <view class="card-inner">
              <!-- 形象预览 -->
              <view class="avatar-preview" @click="viewAvatarDetail(avatar)">
                <view class="preview-image">
                  <svg class="placeholder-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </view>
                <view class="preview-overlay">
                  <text>查看详情</text>
                </view>
              </view>
              
              <!-- 卡片内容区 -->
              <view class="card-content">
                <!-- 卡片标题 -->
                <text class="avatar-name">{{avatar.name}}</text>
                <text class="creation-date">创建于 {{formatDate(avatar.createTime)}}</text>
                
                <!-- 删除按钮 - 移至右上角 -->
                <view class="delete-button" @click.stop="deleteAvatar(avatar)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </view>
                
                <!-- 使用按钮 -->
                <view class="action-buttons">
                  <view class="action-button use" @click.stop="useAvatar(avatar)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <text>使用</text>
                  </view>
                </view>
              </view>
            </view>
            <view class="card-glow"></view>
          </view>
        </view>
      </block>
      
      <!-- 空状态 -->
      <view class="empty-state" v-else>
        <view class="empty-animation">
          <view class="empty-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <view class="pulse-circle"></view>
          </view>
        </view>
        <text class="empty-title">开始创建您的数字形象</text>
        <text class="empty-description">创建您自己的数字人形象，体验AI视频和语音合成</text>
        <view class="empty-action" @click="createNewAvatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          <text>立即创建</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const avatars = ref([
  {
    id: 1,
    name: '商务形象',
    image: '/static/images/avatar1.jpg',
    status: 'ready',
    createTime: '2023-05-20T10:30:00'
  },
  {
    id: 2,
    name: '休闲形象',
    image: '/static/images/avatar2.jpg',
    status: 'ready',
    createTime: '2023-06-15T14:20:00'
  },
  {
    id: 3,
    name: '专业讲师',
    image: '/static/images/avatar3.jpg',
    status: 'processing',
    createTime: '2023-07-10T09:15:00'
  },
  {
    id: 4,
    name: '娱乐主播',
    image: '/static/images/avatar4.jpg',
    status: 'ready',
    createTime: '2023-08-05T16:45:00'
  }
])

onMounted(() => {
  // 这里可以调用API获取数字人列表
  console.log('数字人页面加载完成')
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const getStatusText = (status) => {
  const statusMap = {
    'ready': '可用',
    'processing': '处理中',
    'failed': '失败'
  }
  return statusMap[status] || status
}

const createNewAvatar = () => {
  router.push('/pages/avatar/create')
}

const viewAvatarDetail = (avatar) => {
  router.push({
    path: `/pages/avatar/detail`,
    query: { id: avatar.id }
  })
}

const editAvatar = (avatar) => {
  router.push({
    path: `/pages/avatar/edit`,
    query: { id: avatar.id }
  })
}

const useAvatar = (avatar) => {
  router.push({
    path: `/pages/avatar/use`,
    query: { id: avatar.id }
  })
}

const deleteAvatar = (avatar) => {
  // 这里可以添加确认提示
  if (confirm(`确定要删除"${avatar.name}"吗？`)) {
    // 这里应该调用API删除数字人
    avatars.value = avatars.value.filter(item => item.id !== avatar.id)
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
    background: radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(5, 150, 105, 0.06) 50%, transparent 70%);
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
  
  .bg-dots {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px);
    background-size: 28px 28px;
    opacity: 0.2;
  }
  
  .bg-line {
    position: absolute;
    top: 0;
    left: 30%;
    width: 1px;
    height: 100%;
    background: linear-gradient(to bottom, 
      transparent 5%, 
      rgba(16, 185, 129, 0.05) 20%, 
      rgba(16, 185, 129, 0.1) 50%, 
      rgba(16, 185, 129, 0.05) 80%, 
      transparent 95%);
  }
  
  .bg-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    
    &.glow1 {
      top: -10%;
      left: -15%;
      width: 50%;
      height: 40%;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%);
      animation: pulseSlow 15s infinite alternate;
    }
    
    &.glow2 {
      bottom: -20%;
      right: -10%;
      width: 40%;
      height: 50%;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
      animation: pulseSlow 12s infinite alternate-reverse;
    }
  }
  
  .bg-circle {
    position: absolute;
    border-radius: 50%;
    
    &.circle1 {
      top: 10%;
      left: -10%;
      width: 40%;
      height: 40%;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%);
      filter: blur(50px);
    }
    
    &.circle2 {
      bottom: -20%;
      right: -5%;
      width: 50%;
      height: 50%;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%);
      filter: blur(60px);
    }
  }
}

/* 内容样式 */
.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 28px 16px;
  max-width: 640px;
  margin: 0 auto;
}

/* 导航头部 */
.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  
  .header-title {
    .title-text {
      display: block;
      font-size: 30px;
      font-weight: 700;
      background: linear-gradient(to right, #fff, #10b981);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 6px;
      letter-spacing: -0.5px;
    }
    
    .title-sub {
      display: block;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      letter-spacing: 0.2px;
    }
  }
  
  .create-button {
    .button-inner {
      display: flex;
      align-items: center;
      padding: 12px 22px;
      background: linear-gradient(135deg, #10b981, #0ea5e9);
      border-radius: 30px;
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.25);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        animation: shine 3s infinite;
      }
      
      &:active {
        transform: translateY(2px);
        box-shadow: 0 2px 6px rgba(16, 185, 129, 0.2);
      }
      
      svg {
        margin-right: 8px;
        color: rgba(255, 255, 255, 0.9);
      }
      
      text {
        font-size: 15px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
}

/* 数字人列表 */
.avatar-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 40px;
  
  .avatar-card {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    background: rgba(17, 24, 39, 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.3s ease;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    height: 320px;
    
    &:hover {
      transform: translateY(-5px);
      border-color: rgba(16, 185, 129, 0.3);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
      
      .card-glow {
        opacity: 0.8;
      }
      
      .preview-image {
        transform: scale(1.05);
      }
      
      .preview-overlay {
        opacity: 1;
      }
      
      .delete-button {
        opacity: 1;
      }
    }
    
    .card-inner {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .avatar-preview {
      height: 180px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      
      .preview-image {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.8));
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.5s ease;
        
        .placeholder-icon {
          color: rgba(255, 255, 255, 0.4);
        }
      }
      
      .preview-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(16, 185, 129, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        
        text {
          color: #fff;
          font-weight: 600;
          padding: 8px 16px;
          background: rgba(16, 185, 129, 0.6);
          border-radius: 20px;
          font-size: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
      }
    }
    
    .card-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
      position: relative;
      
      .avatar-name {
        font-size: 18px;
        font-weight: 600;
        color: #fff;
        margin-bottom: 6px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        padding-right: 30px; /* 为删除按钮留出空间 */
      }
      
      .creation-date {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        margin-bottom: 8px;
      }
      
      .delete-button {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.25s ease;
        opacity: 0.7;
        z-index: 2;
        
        svg {
          color: rgba(239, 68, 68, 0.9);
        }
        
        &:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: scale(1.05);
        }
        
        &:active {
          transform: scale(0.95);
        }
      }
      
      .action-buttons {
        display: flex;
        flex-direction: column;
        margin-top: auto;
        
        .action-button {
          height: 36px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
          
          svg {
            width: 14px;
            height: 14px;
            margin-right: 4px;
          }
          
          text {
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
          }
          
          &:active {
            transform: scale(0.98);
          }
          
          &.use {
            background: linear-gradient(to right, #10b981, #0ea5e9);
            color: rgba(255, 255, 255, 0.95);
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
            position: relative;
            overflow: hidden;
            width: 70%;
            margin: 0 auto;
            margin-top: 4px;
            
            &::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 50%;
              height: 100%;
              background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent
              );
              animation: shine 3s infinite;
            }
            
            &:active {
              box-shadow: 0 1px 4px rgba(16, 185, 129, 0.2);
            }
          }
        }
      }
    }
    
    .card-glow {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 60%;
      background: linear-gradient(to top, rgba(16, 185, 129, 0.15), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 0;
    }
  }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  
  .empty-animation {
    margin-bottom: 30px;
    
    .empty-icon-wrapper {
      position: relative;
      width: 130px;
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        position: relative;
        z-index: 2;
        color: #10b981;
        opacity: 0.9;
      }
      
      .pulse-circle {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%);
        animation: pulse 2s infinite;
        z-index: 1;
      }
    }
  }
  
  .empty-title {
    font-size: 28px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 16px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    background: linear-gradient(to right, #fff, #10b981);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .empty-description {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.6);
    max-width: 280px;
    margin: 0 auto 40px;
    line-height: 1.6;
  }
  
  .empty-action {
    display: flex;
    align-items: center;
    padding: 16px 32px;
    background: linear-gradient(135deg, #10b981, #0ea5e9);
    border-radius: 30px;
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      animation: shine 3s infinite;
    }
    
    &:active {
      transform: translateY(3px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
    }
    
    svg {
      margin-right: 10px;
      color: rgba(255, 255, 255, 0.9);
    }
    
    text {
      font-size: 16px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
    }
  }
}

/* 动画 */
@keyframes pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.6;
  }
}

@keyframes pulseSlow {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }
  100% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

@keyframes shine {
  0% {
    left: -100%;
  }
  20% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}

/* 响应式调整 */
@media (max-width: 375px) {
  .nav-header {
    flex-direction: column;
    align-items: flex-start;
    
    .create-button {
      margin-top: 16px;
      align-self: flex-start;
    }
  }
  
  .avatar-list {
    grid-template-columns: 1fr;
  }
}
</style>
