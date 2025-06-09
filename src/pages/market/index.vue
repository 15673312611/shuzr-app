<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header-bar">
      <view class="back-button" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </view>
      <view class="header-title">
        <text>形象市场</text>
        </view>
      <view class="placeholder-space"></view>
      </view>
      
    <!-- 顶部横幅 -->
    <view class="banner-section">
      <view class="banner-content">
        <view class="banner-text">
          <text class="banner-title">形象市场</text>
          <text class="banner-subtitle">选择您喜欢的形象，快速生成专业视频</text>
          <view class="banner-features">
            
            <view class="feature-item">
              <view class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/>
              </svg>
            </view>
              <text class="feature-text">精选形象</text>
          </view>
            <view class="feature-item">
              <view class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" fill="currentColor"/>
                  </svg>
                </view>
              <text class="feature-text">快速生成</text>
              </view>
            </view>
          </view>
        <view class="banner-graphic">
          <view class="graphic-element">
            <view class="avatar-element-1"></view>
            <view class="avatar-element-2"></view>
              </view>
              </view>
            </view>
          </view>
    
    <!-- 分类选择部分 -->
    <view class="categories-section">
      <view class="section-header">
        <text class="section-title">选择分类</text>
          </view>
      
      <scroll-view class="categories-scroll" scroll-x="true" show-scrollbar="false">
        <view class="categories-list">
          <!-- 全部分类 -->
          <view 
            class="category-item" 
            :class="{ active: !selectedCategory && !selectedGender }"
            @click="selectCategory(null)"
          >
            <view class="category-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/>
              </svg>
        </view>
            <text class="category-name">全部</text>
      </view>
      
          <!-- 性别分类 -->
          <view 
            class="category-item" 
            :class="{ active: selectedGender === 1 }"
            @click="selectGender(1)"
          >
            <view class="category-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path d="M10 14c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2s2 .9 2 2v7c0 1.1-.9 2-2 2zm4-1v-3c0-1.66-1.34-3-3-3h-2c-1.66 0-3 1.34-3 3v3c0 1.1-.9 2-2 2v2h12v-2c-1.1 0-2-.9-2-2z" fill="currentColor"/>
              </svg>
            </view>
            <text class="category-name">男生</text>
          </view>
          
          <view 
            class="category-item" 
            :class="{ active: selectedGender === 2 }"
            @click="selectGender(2)"
          >
            <view class="category-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm7 7c-.53 0-1.04.21-1.41.59C17.21 14.96 17 15.47 17 16v4.34l-3-3V13c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v8.34l-3-3V16c0-.53-.21-1.04-.59-1.41C3.04 14.21 2.53 14 2 14v6h20v-6c-.53 0-1.04.21-1.41.59-.38.37-.59.88-.59 1.41z" fill="currentColor"/>
              </svg>
            </view>
            <text class="category-name">女生</text>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 形象列表 -->
    <view class="templates-section">
      <!-- 加载状态 -->
      <view v-if="loading" class="loading-state">
        <view class="loading-spinner"></view>
        <view class="loading-text">正在加载形象...</view>
        </view>
      
      <!-- 空状态 -->
      <view v-else-if="templates.length === 0" class="empty-state">
        <view class="empty-icon">🔍</view>
        <view class="empty-text">暂无形象</view>
        <view class="empty-desc">尝试选择其他分类或性别筛选</view>
        </view>
      
      <!-- 模板列表 -->
      <view v-else class="templates-grid">
        <view 
          v-for="template in templates" 
          :key="template.id"
          class="template-item"
          @click="previewVideo(template)"
        >
          <!-- 视频预览 -->
          <view class="template-media">
            <img 
              :src="getVideoThumbnail(template.videoUrl)" 
              class="template-image" 
              alt="视频缩略图"
              @error="handleImageError"
            />
            
            <!-- 性别标签 -->
            <view class="gender-tag" v-if="template.gender" :class="template.gender === 1 ? 'male' : 'female'">
              <text>{{ template.gender === 1 ? '男' : '女' }}</text>
          </view>
        </view>
          
          <!-- 播放指示器 - 放在卡片中央 -->
          <view class="play-indicator">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
              <path d="M8 5v14l11-7z" fill="currentColor"/>
            </svg>
      </view>
      
          <!-- 卡片内容 -->
          <view class="template-content">
            <view class="content-top">
              <text class="template-name">{{ template.name }}</text>
            </view>
            <view class="content-bottom">
              <view class="use-btn" @click.stop="handleUseTemplate(template)">
                <text>使用形象</text>
          </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      
    <!-- 视频预览弹窗 -->
    <view class="video-dialog" v-if="previewVisible">
      <view class="dialog-overlay" @click="closePreview"></view>
      <view class="dialog-content">
        <view class="dialog-header">
          <text class="dialog-title">视频预览</text>
          <view class="dialog-close" @click="closePreview">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
          </svg>
        </view>
        </view>
        <view class="dialog-body">
          <video 
            :src="currentTemplate?.videoUrl" 
            class="preview-video" 
            controls 
            autoplay
          ></video>
      </view>
        <view class="dialog-footer">
          <view class="dialog-button cancel" @click="closePreview">关闭</view>
          <view class="dialog-button confirm" @click="handleUseTemplate(currentTemplate)">使用</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()

// 状态变量
const loading = ref(false)
const templates = ref([])
const loadingCategories = ref(false)
const selectedCategory = ref(null)
const selectedGender = ref(null)
const previewVisible = ref(false)
const currentTemplate = ref(null)

// 获取模板列表
const fetchTemplates = async () => {
  try {
    loading.value = true
    
    // 构建请求参数
    const params = {}
    if (selectedGender.value) {
      params.gender = selectedGender.value
    }
    
    const response = await request.get('/api/template/list', { params })
    if (response) {
      templates.value = (response || []).map(item => ({
        ...item,
        imageLoading: true,
        imageError: false
      }))
    } else {
      console.error('获取模板列表失败:', response)
      templates.value = []
    }
  } catch (error) {
    console.error('获取模板列表异常:', error)
    templates.value = []
  } finally {
    loading.value = false
  }
}

// 选择性别
const selectGender = (gender) => {
  if (selectedGender.value === gender) {
    // 再次点击已选中的性别，取消选择
    selectedGender.value = null
  } else {
    selectedGender.value = gender
    selectedCategory.value = null // 清除分类选择
  }
  fetchTemplates()
}

// 选择分类
const selectCategory = (category) => {
  if (category === null) {
    // 点击"全部"按钮时，清除所有选择
    selectedCategory.value = null
    selectedGender.value = null
  } else {
    // 不再需要判断已选中的分类，直接设置为null，只使用性别过滤
    selectedCategory.value = null
  }
  fetchTemplates()
}

// 预览视频
const previewVideo = (template) => {
  currentTemplate.value = template
  previewVisible.value = true
}

// 关闭预览
const closePreview = () => {
  previewVisible.value = false
  // 小延迟后清空当前模板，避免关闭动画过程中视频突然消失
  setTimeout(() => {
    currentTemplate.value = null
  }, 300)
}

// 使用模板
const handleUseTemplate = (template) => {
  if (!template) return
  
  try {
    // 关闭预览弹窗（如果打开的话）
    if (previewVisible.value) {
      closePreview()
    }
    
    // 跳转到一键分身页面 - 使用与资产页面相同的跳转方式
    router.push({
      path: '/pages/avatar/clone',
      query: { 
        videoUrl: template.videoUrl,
        avatarName: template.name || '数字人形象'
      }
    })
  } catch (e) {
    console.error('跳转失败:', e)
    uni.showToast({
      title: '操作失败，请重试',
      icon: 'none'
    })
  }
}

// 加载初始数据
onMounted(() => {
  fetchTemplates()
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 获取视频缩略图
const getVideoThumbnail = (videoUrl) => {
  if (!videoUrl) return '/static/images/avatar-placeholder.png'
  try {
    // 移除URL中的查询参数部分
    const baseUrl = videoUrl.split('?')[0]
    // 添加OSS处理参数
    const thumbnailUrl = baseUrl + '?x-oss-process=video/snapshot,t_0'
    return thumbnailUrl
  } catch (error) {
    console.error('生成缩略图URL失败:', error)
    return '/static/images/avatar-placeholder.png'
  }
}

// 图片错误处理
const handleImageError = (e) => {
  // 避免死循环：如果当前图片已经是默认图片，则不再替换
  if (e.target.src.includes('avatar-placeholder.png')) return
  
  console.error('图片加载失败:', e.target.src)
  e.target.src = '/static/images/avatar-placeholder.png'
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
}

/* 顶部导航栏 */
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  padding-top: calc(12px + env(safe-area-inset-top, 0));
  position: relative;
  z-index: 10;
  
  .back-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    
    &:active {
      background: rgba(255, 255, 255, 0.2);
    }
  }
  
  .header-title {
    font-size: 18px;
    font-weight: 600;
      color: #fff;
    
    text {
      background: linear-gradient(to right, #fff, #a8c0ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  
  .placeholder-space {
    width: 36px;
  }
}

/* 顶部横幅 */
.banner-section {
  padding: 20px 16px;
  background: linear-gradient(135deg, #2c3e93, #4a0055);
  position: relative;
  border-radius: 0;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  
  /* 背景动态效果 */
  &::before {
    content: '';
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M0 0 L50 0 L0 50 Z" fill="%23ffffff09"/><path d="M100 0 L100 50 L50 0 Z" fill="%23ffffff09"/><path d="M100 100 L50 100 L100 50 Z" fill="%23ffffff09"/><path d="M0 100 L0 50 L50 100 Z" fill="%23ffffff09"/></svg>');
    background-size: 30px 30px;
    opacity: 0.3;
    animation: banner-pattern 60s linear infinite;
  }
  
  /* 光晕效果 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
    border-radius: 50%;
    transform: translate(50%, -50%);
  }
  
  .banner-content {
    position: relative;
    z-index: 1;
      display: flex;
      align-items: center;
    
    .banner-text {
      flex: 2;
      
      .banner-title {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 10px;
        display: block;
        background: linear-gradient(to right, #fff, #a8c0ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 2px 10px rgba(255, 255, 255, 0.1);
        letter-spacing: 0.5px;
      }
      
      .banner-subtitle {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 18px;
        display: block;
        line-height: 1.5;
      }
      
      .banner-features {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        
        .feature-item {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          padding: 6px 10px;
          backdrop-filter: blur(4px);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          
          &:active {
            transform: scale(0.95);
            background: rgba(255, 255, 255, 0.15);
          }
          
          .feature-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;
            color: rgba(255, 255, 255, 0.9);
          }
          
          .feature-text {
            font-size: 12px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
          }
        }
      }
    }
    
    .banner-graphic {
      flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      position: relative;
      
      .graphic-element {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, rgba(148, 187, 233, 0.5), rgba(54, 79, 107, 0.3));
        position: relative;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        
        /* 内部装饰圆环 */
        &::before {
          content: '';
          position: absolute;
          top: -15px;
          left: -15px;
          right: -15px;
          bottom: -15px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.1);
          animation: pulse 4s infinite ease-in-out;
        }
        
        /* 内部小圆点 */
        &::after {
          content: '';
          position: absolute;
          top: 20px;
          left: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          filter: blur(5px);
        }
        
        /* 装饰元素: 小形象1 */
        .avatar-element-1 {
          position: absolute;
          width: 35px;
          height: 35px;
          top: -15px;
          left: 10px;
          background: #4a5af9;
          border-radius: 8px;
          transform: rotate(-15deg);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          animation: float-element 6s ease-in-out infinite;
        }
        
        /* 装饰元素: 小形象2 */
        .avatar-element-2 {
          position: absolute;
          width: 30px;
          height: 30px;
          bottom: -10px;
          right: 5px;
          background: #ff3e9a;
          border-radius: 8px;
          transform: rotate(10deg);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          animation: float-element 7s ease-in-out infinite reverse;
        }
      }
    }
  }
}

/* 分类部分 */
.categories-section {
  padding: 0 16px;
  margin-bottom: 20px;
  
  .section-header {
    margin-bottom: 12px;
    
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      position: relative;
      padding-left: 12px;
      
      &::before {
          content: '';
          position: absolute;
        left: 0;
        top: 2px;
        bottom: 2px;
        width: 4px;
        background: linear-gradient(to bottom, #00ffaa, rgba(0, 255, 170, 0.5));
        border-radius: 2px;
      }
    }
  }
  
  .categories-scroll {
    .categories-list {
  display: flex;
      padding: 5px 0;
      
      .category-item {
        min-width: 80px;
        height: 36px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 18px;
    display: flex;
    align-items: center;
        justify-content: center;
        margin-right: 12px;
        padding: 0 12px;
        transition: all 0.3s ease;
    
    &.active {
          background: linear-gradient(to right, rgba(0, 255, 170, 0.8), rgba(66, 135, 245, 0.8));
          box-shadow: 0 2px 8px rgba(0, 255, 170, 0.3);
          
          .category-icon, .category-name {
            color: #000;
          }
        }
        
        .category-icon {
          color: rgba(255, 255, 255, 0.7);
          margin-right: 6px;
          transition: color 0.3s ease;
        }
        
        .category-name {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          transition: color 0.3s ease;
        }
      }
    }
  }
}

/* 形象列表部分 */
.templates-section {
  padding: 0 16px;
  
  .templates-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .template-item {
      position: relative;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      height: 130px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      display: flex;
      
      &:active {
        transform: scale(0.98);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
      
      .template-media {
      position: relative;
        width: 130px;
        height: 130px;
        flex-shrink: 0;
      
        .template-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 12px;
        background-color: #000;
      }
      
        &::after {
          content: '';
        position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to right, rgba(0, 0, 0, 0.2), transparent);
          z-index: 1;
        }
        
        .gender-tag {
          position: absolute;
          top: 10px;
          left: 10px;
        padding: 3px 8px;
          border-radius: 4px;
          font-size: 11px;
          z-index: 2;
          
          &.male {
            background: rgba(66, 135, 245, 0.9);
          }
          
          &.female {
            background: rgba(236, 72, 153, 0.9);
          }
          
          text {
            color: #fff;
            font-weight: 500;
          }
        }
      }
      
      .play-indicator {
        position: absolute;
        top: 50%;
        left: 65px; /* 位于视频中心点 */
        transform: translate(-50%, -50%);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        z-index: 5;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }
      
      .template-content {
        flex: 1;
        padding: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        
        .content-top {
          .template-name {
            font-size: 17px;
            font-weight: 600;
            color: #fff;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
        overflow: hidden;
            line-height: 1.3;
          }
      }
      
        .content-bottom {
        display: flex;
          justify-content: flex-end;
          
          .use-btn {
            background: linear-gradient(135deg, rgba(0, 255, 170, 0.9), rgba(0, 210, 255, 0.9));
            border-radius: 8px;
            padding: 8px 18px;
            box-shadow: 0 2px 8px rgba(0, 255, 170, 0.3);
            position: relative;
            z-index: 1;
            
            text {
              font-size: 14px;
              font-weight: 600;
              color: #000;
            }
            
            &:active {
              transform: scale(0.95);
              opacity: 0.9;
            }
        }
      }
    }
  }
}

  /* 加载状态 */
  .loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
    padding: 40px 0;
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s linear infinite;
      margin-bottom: 12px;
    }
    
    .loading-text {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
    }
  }
  
  /* 空状态 */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 20px;
    
    .empty-icon {
      font-size: 50px;
      margin-bottom: 16px;
  }
  
  .empty-text {
    font-size: 16px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 8px;
    }
    
    .empty-desc {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      text-align: center;
      line-height: 1.4;
    }
  }
}

/* 视频预览弹窗 */
.video-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .dialog-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
  }
  
  .dialog-content {
    position: relative;
    width: 90%;
    max-width: 360px;
    background: #0f1524;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    
    .dialog-header {
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      .dialog-title {
        font-size: 16px;
        font-weight: bold;
        color: #fff;
      }
      
      .dialog-close {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.8);
        
        &:active {
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
    
    .dialog-body {
      aspect-ratio: 16 / 9;
      background: #000;
      
      .preview-video {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    
    .dialog-footer {
      padding: 16px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      
      .dialog-button {
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        
        &.cancel {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          
          &:active {
            background: rgba(255, 255, 255, 0.2);
          }
        }
        
        &.confirm {
          background: linear-gradient(to right, #00ffaa, #00b3ff);
          color: #000;
          font-weight: bold;
          
          &:active {
            opacity: 0.9;
          }
        }
      }
    }
  }
}

/* 动画效果 */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes banner-pattern {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(-20%) rotate(10deg);
  }
}

@keyframes float-element {
  0%, 100% {
    transform: translateY(0) rotate(-15deg);
  }
  50% {
    transform: translateY(-8px) rotate(-10deg);
  }
}

/* 响应式适配 */
@media screen and (max-width: 375px) {
  .container {
    .header-bar {
      padding: 12px 14px;
      
      .header-title {
        font-size: 18px;
      }
    }
    
    .banner-section {
      padding: 16px 14px;
      
      .banner-content {
        .banner-text {
          .banner-title {
            font-size: 20px;
            margin-bottom: 6px;
          }
          
          .banner-subtitle {
            font-size: 13px;
            margin-bottom: 10px;
          }
          
          .banner-features {
            gap: 8px;
            
            .feature-item {
              padding: 6px 10px;
              
              .feature-text {
                font-size: 12px;
              }
            }
          }
        }
      }
    }
    
    .categories-section {
      padding: 12px 14px;
      
      .section-header {
        margin-bottom: 12px;
        
        .section-title {
          font-size: 16px;
        }
      }
      
      .categories-scroll {
        .categories-list {
          .category-item {
            padding: 8px 12px;
            margin-right: 8px;
            
            .category-name {
              font-size: 13px;
            }
          }
        }
      }
    }
    
    .templates-section {
      padding: 0 14px;
      
      .templates-grid {
        gap: 10px;
        
        .template-item {
          height: 120px;
          
          .template-media {
            width: 120px;
            height: 120px;
          }
          
          .template-content {
            padding: 14px;
            
            .content-top {
              .template-name {
                font-size: 15px;
              }
            }
            
            .content-bottom {
              .use-btn {
                padding: 7px 16px;
                
                text {
                  font-size: 13px;
                }
              }
            }
          }
        }
      }
    }
    
    .video-dialog {
      .dialog-content {
        width: 90%;
        
        .dialog-header {
          padding: 14px;
          
          .dialog-title {
            font-size: 16px;
          }
        }
        
        .dialog-body {
          .preview-video {
            height: 200px;
          }
        }
        
        .dialog-footer {
          padding: 14px;
          
          .dialog-button {
            font-size: 14px;
            padding: 8px 14px;
          }
        }
      }
    }
  }
}

@media screen and (min-width: 376px) and (max-width: 428px) {
  .container {
    .header-bar {
      padding: 14px 16px;
    }
    
    .banner-section {
      padding: 20px 16px;
      
      .banner-content {
        .banner-text {
          .banner-title {
            font-size: 22px;
          }
          
          .banner-subtitle {
            font-size: 14px;
          }
        }
      }
    }
    
    .categories-section {
      padding: 14px 16px;
    }
    
    .templates-section {
      padding: 0 16px;
      
      .templates-grid {
        gap: 12px;
        
        .template-item {
          height: 140px;
          
          .template-media {
            width: 140px;
            height: 140px;
          }
        }
      }
    }
    
    .video-dialog {
      .dialog-content {
        width: 85%;
        
        .dialog-body {
          .preview-video {
            height: 220px;
          }
        }
      }
    }
  }
}

@media screen and (min-width: 429px) {
  .container {
    .header-bar {
      padding: 16px 20px;
    }
    
    .banner-section {
      padding: 24px 20px;
      max-width: 500px;
      margin: 0 auto;
      
      .banner-content {
        .banner-text {
          .banner-title {
            font-size: 24px;
          }
          
          .banner-subtitle {
            font-size: 16px;
          }
          
          .banner-features {
            .feature-item {
              padding: 8px 16px;
              
              .feature-text {
                font-size: 14px;
              }
            }
          }
        }
      }
    }
    
    .categories-section {
      padding: 16px 20px;
      max-width: 500px;
      margin: 0 auto;
      
      .section-header {
        margin-bottom: 16px;
        
        .section-title {
          font-size: 18px;
        }
      }
    }
    
    .templates-section {
      padding: 0 20px;
      max-width: 500px;
      margin: 0 auto;
      
      .templates-grid {
        gap: 16px;
        
        .template-item {
          height: 160px;
          
          .template-media {
            width: 160px;
            height: 160px;
          }
          
          .template-content {
            padding: 16px;
            
            .content-top {
              .template-name {
                font-size: 16px;
              }
            }
            
            .content-bottom {
              .use-btn {
                padding: 8px 18px;
                
                text {
                  font-size: 14px;
                }
              }
            }
          }
        }
      }
    }
    
    .video-dialog {
      .dialog-content {
        width: 80%;
        max-width: 500px;
        
        .dialog-header {
          padding: 18px;
          
          .dialog-title {
            font-size: 18px;
          }
        }
        
        .dialog-body {
          .preview-video {
            height: 280px;
          }
        }
        
        .dialog-footer {
          padding: 18px;
          
          .dialog-button {
            font-size: 15px;
            padding: 10px 20px;
          }
        }
      }
    }
  }
}
</style> 