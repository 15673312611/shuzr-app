<template>
  <div class="page-container">
    <!-- 背景层 -->
    <div class="background-layer">
      <!-- 去掉了可能影响标题可见性的气泡 -->
      <div class="bubble bubble2"></div>
      <div class="bubble bubble3"></div>
      <div class="grid-background"></div>
    </div>

    <!-- 主内容区 -->
    <div class="main-container">
      <!-- 页面头部 -->
      <div class="header">
        <div class="nav-buttons">
          <div class="back-button" @click="goBack">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 18l-6-6 6-6"></path>
            </svg>
          </div>
          <div class="home-button" @click="goHome">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
        </div>
        <div class="page-title">形象克隆</div>
        <div class="placeholder-div"></div>
      </div>

      <!-- 应用内容区 - 居中优化 -->
      <div class="app-content-wrapper">
        <div class="app-content">
          <!-- 内容卡片 -->
          <div class="content-card">
            <!-- 上传区域 -->
            <div class="upload-container" @click="selectVideo">
              <div class="upload-inner" :class="{ 'has-preview': videoFile }">
                <template v-if="!videoFile">
                  <div class="upload-icon-container">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <div class="upload-text">点击上传视频</div>
                  <div class="upload-desc">请上传符合要求的视频文件，大小不超过100MB</div>
                </template>

                <template v-else>
                  <div class="upload-preview">
                    <video ref="previewVideoRef" class="preview-video" :src="videoUrl"></video>
                    <div class="video-info">
                      <div class="video-name">{{ videoFile.name }}</div>
                      <div class="video-size">{{ formatFileSize(videoFile.size) }}</div>
                    </div>
                    <div class="video-actions">
                      <div class="video-action-btn" @click.stop="playVideoPreview">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        预览
                      </div>
                      <div class="video-action-btn delete" @click.stop="deleteVideo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        删除
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- 作品名称输入框 -->
            <div class="name-input-container">
              <label class="input-label">作品名称</label>
              <input 
                type="text" 
                v-model="workName" 
                class="name-input" 
                placeholder="请输入作品名称（必填）"
              />
            </div>

            <!-- 视频录制要求提示 -->
            <div class="requirements-hint" @click="showRequirements = true">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>查看视频录制要求</span>
            </div>

            <!-- 协议同意 -->
            <div class="agreement-section">
              <label class="checkbox-container">
                <input type="checkbox" v-model="agreed" />
                <span class="checkmark"></span>
                <span class="agreement-text">
                  我已阅读并同意
                  <span class="agreement-link" @click.prevent="showAgreement = true">《形象克隆使用协议》</span>
                </span>
              </label>
            </div>

            <!-- 提交按钮 -->
            <button class="submit-button" :class="{ 'disabled': !canSubmit }" :disabled="!canSubmit" @click="submitVideo">
              {{ isUploading ? '上传中...' : '提交' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 视频录制要求模态框 -->
    <div class="requirements-modal" v-if="showRequirements">
      <div class="modal-mask" @click="showRequirements = false"></div>
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">视频录制要求</div>
          <div class="modal-close" @click="showRequirements = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>
        <div class="modal-body">
          <p class="requirement-title">
            为了获得最佳的克隆效果，请严格按照以下要求录制视频
          </p>
          <div class="requirements-list">
            <div class="requirement-item">
              <div class="requirement-dot"></div>
              <div>请确保环境光线充足均匀，避免过暗或强光直射</div>
            </div>
            <div class="requirement-item">
              <div class="requirement-dot"></div>
              <div>请面对摄像头，保持头部和肩膀在画面中，并尽量减少头部移动</div>
            </div>
            <div class="requirement-item">
              <div class="requirement-dot"></div>
              <div>请使用清晰的声音和正常语速朗读文本，避免背景噪音</div>
            </div>
            <div class="requirement-item">
              <div class="requirement-dot"></div>
              <div>视频时长建议保持在30秒至2分钟之间</div>
            </div>
            <div class="requirement-item">
              <div class="requirement-dot"></div>
              <div>请避免佩戴会遮挡面部的物品，如太阳镜、口罩等</div>
            </div>
            <div class="requirement-item">
              <div class="requirement-dot"></div>
              <div>视频分辨率建议不低于720p（1280×720）</div>
            </div>
            <div class="requirement-item">
              <div class="requirement-dot"></div>
              <div>请确保视频中只有您一人出现，避免有其他人入镜</div>
            </div>
          </div>
        </div>
        <div class="safe-area-bottom"></div>
      </div>
    </div>

    <!-- 视频预览模态框 -->
    <div class="video-modal" v-if="showVideoPreview">
      <div class="modal-mask" @click="showVideoPreview = false"></div>
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">视频预览</div>
          <div class="modal-close" @click="showVideoPreview = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>
        <div class="modal-body">
          <video ref="modalVideo" class="modal-video" controls :src="videoUrl"></video>
        </div>
        <div class="safe-area-bottom"></div>
      </div>
    </div>

    <!-- 形象克隆使用协议模态框 -->
    <div class="agreement-modal" v-if="showAgreement">
      <div class="modal-mask" @click="showAgreement = false"></div>
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">形象克隆使用协议</div>
          <div class="modal-close" @click="showAgreement = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>
        <div class="modal-body agreement-content">
          <h3>形象克隆服务协议</h3>
          <p class="agreement-date">生效日期：2023年12月1日</p>
          
          <section class="agreement-section-content">
            <h4>1. 服务说明</h4>
            <p>1.1 形象克隆服务（以下简称"本服务"）是由我们提供的一项基于人工智能技术，通过用户上传的视频素材创建数字人形象的服务。</p>
            <p>1.2 用户通过本服务可以创建与自己相似的数字形象，并用于后续的视频合成等功能。</p>
          </section>
          
          <section class="agreement-section-content">
            <h4>2. 用户授权与隐私</h4>
            <p>2.1 用户同意并授权我们使用其上传的视频素材，用于创建和训练数字人形象模型。</p>
            <p>2.2 我们承诺仅将用户提供的视频素材用于为用户提供形象克隆服务，不会将其用于其他商业用途。</p>
            <p>2.3 我们将采取合理措施保护用户的个人信息和上传内容的安全。</p>
          </section>
          
          <section class="agreement-section-content">
            <h4>3. 用户责任与保证</h4>
            <p>3.1 用户保证其上传的视频素材不含有违法、侵权或不良内容。</p>
            <p>3.2 用户保证对其上传的视频素材拥有合法权利，或已获得必要的授权。</p>
            <p>3.3 用户应对使用本服务生成的数字人形象的使用行为负责，不得将其用于违法、侵权或其他不当用途。</p>
          </section>
          
          <section class="agreement-section-content">
            <h4>4. 知识产权</h4>
            <p>4.1 用户通过本服务生成的数字人形象的使用权归用户所有。</p>
            <p>4.2 本服务的相关技术、算法等知识产权归我们所有。</p>
          </section>
          
          <section class="agreement-section-content">
            <h4>5. 免责声明</h4>
            <p>5.1 我们不对因用户提供的视频素材质量问题导致的数字人形象效果不佳承担责任。</p>
            <p>5.2 我们不对用户使用生成的数字人形象所产生的任何后果承担责任。</p>
          </section>
          
          <section class="agreement-section-content">
            <h4>6. 协议修改</h4>
            <p>我们保留随时修改本协议的权利，修改后的协议将在平台上公布。用户继续使用本服务即表示同意接受修改后的协议。</p>
          </section>
          
          <section class="agreement-section-content">
            <h4>7. 法律适用</h4>
            <p>本协议的订立、执行和解释及争议的解决均应适用中国法律。</p>
          </section>
        </div>
        <div class="safe-area-bottom"></div>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="video/*"
      style="display: none"
      @change="onFileChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { uploadFileToOss } from '../../utils/oss'
import { avatarApi } from '../../api/services'

const showRequirements = ref(false)
const showAgreement = ref(false)
const agreed = ref(false)
const fileInput = ref(null)
const videoFile = ref(null)
const videoUrl = ref('')
const showVideoPreview = ref(false)
const previewVideoRef = ref(null)
const modalVideo = ref(null)
const isUploading = ref(false)
const workName = ref('')

// 是否可以提交
const canSubmit = computed(() => {
  return videoFile.value && agreed.value && !isUploading.value && workName.value.trim() !== ''
})

// 选择视频
function selectVideo() {
  fileInput.value.click()
}

// 文件改变事件
function onFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    // 验证文件类型
    if (!file.type.startsWith('video/')) {
      alert('请选择视频文件')
      return
    }
    
    // 验证文件大小（最大100MB）
    if (file.size > 100 * 1024 * 1024) {
      alert('视频大小不能超过100MB')
      return
    }
    
    videoFile.value = file
    videoUrl.value = URL.createObjectURL(file)
  }
}

// 预览视频
function playVideoPreview(e) {
  e.stopPropagation()
  showVideoPreview.value = true
  setTimeout(() => {
    modalVideo.value.play()
  }, 300)
}

// 关闭视频预览
function closeVideoPreview() {
  showVideoPreview.value = false
  modalVideo.value.pause()
}

// 删除视频
function deleteVideo(e) {
  e.stopPropagation()
  if (videoUrl.value) {
    URL.revokeObjectURL(videoUrl.value)
  }
  videoFile.value = null
  videoUrl.value = ''
}

// 返回上一页
function goBack() {
  window.history.back()
}

// 返回首页
function goHome() {
  window.location.href = '/'
}

// 提交视频
async function submitVideo() {
  if (!canSubmit.value) {
    if (!videoFile.value) {
      alert('请上传视频')
    } else if (!workName.value.trim()) {
      alert('请输入作品名称')
    } else if (!agreed.value) {
      alert('请阅读并同意使用协议')
    }
    return
  }
  
  try {
    isUploading.value = true
    
    // 创建加载提示
    const loadingToast = document.createElement('div')
    loadingToast.className = 'loading-toast'
    loadingToast.innerHTML = `
      <div class="loading-spinner"></div>
      <div class="loading-text">上传中...</div>
    `
    document.body.appendChild(loadingToast)
    
    // 上传视频到OSS并获取访问URL
    const fileUrl = await uploadFileToOss(videoFile.value, 'digital-human/videos')
    
    // 构建请求体
    const payload = {
      fileUrl,
      name: workName.value,
      description: '通过移动端上传的数字人视频'
    }
    
    // 提交创建请求
    const response = await avatarApi.create(payload)
    
    // 移除加载提示
    document.body.removeChild(loadingToast)
    
    if (response && response.id) {
      // 创建成功提示
      const successToast = document.createElement('div')
      successToast.className = 'success-toast'
      successToast.textContent = '上传成功'
      document.body.appendChild(successToast)
      
      // 2秒后移除提示
      setTimeout(() => {
        document.body.removeChild(successToast)
      }, 2000)
      
      // 上传成功后跳转到资产页面
      setTimeout(() => {
        window.location.href = '/pages/asset/index'
      }, 1500)
    } else {
      throw new Error(response?.message || '上传失败')
    }
  } catch (error) {
    console.error('上传视频失败:', error)
    
    // 移除可能存在的加载提示
    const loadingToast = document.querySelector('.loading-toast')
    if (loadingToast) {
      document.body.removeChild(loadingToast)
    }
    
    // 创建错误提示
    const errorToast = document.createElement('div')
    errorToast.className = 'error-toast'
    errorToast.textContent = error.message || '上传失败，请重试'
    document.body.appendChild(errorToast)
    
    // 2秒后移除提示
    setTimeout(() => {
      document.body.removeChild(errorToast)
    }, 2000)
  } finally {
    isUploading.value = false
  }
}

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

onMounted(() => {
  // 页面加载完成后的逻辑
})
</script>

<style scoped lang="scss">
.page-container {
  width: 100%;
  min-height: 100vh;
  background: #0c111a;
  position: relative;
  display: flex;
  flex-direction: column;
  color: #fff;
  overflow: hidden;
}

.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
}

.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(42, 67, 101, 0.15) 1px, transparent 1px), 
    linear-gradient(90deg, rgba(42, 67, 101, 0.15) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.3;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  z-index: -1;
  
  &.bubble2 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(129, 103, 242, 0.2), rgba(67, 56, 202, 0.1));
    bottom: -80px;
    right: -80px;
    animation: float 20s ease-in-out infinite alternate;
  }
  
  &.bubble3 {
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(29, 223, 197, 0.2), rgba(16, 185, 129, 0.1));
    bottom: 20%;
    left: -80px;
    animation: float 18s ease-in-out infinite alternate-reverse;
  }
}

@keyframes float {
  0% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(40px, -30px) scale(1.05);
  }
  100% {
    transform: translate(-20px, 20px) scale(0.95);
  }
}

.main-container {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  max-width: 480px;
  margin: 0 auto;
  width: 100%;
}

.nav-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.back-button, .home-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  
  &:active {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(0.95);
  }
}

.page-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 1px;
  /* 确保标题不被背景遮挡 */
  z-index: 2; 
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.placeholder-div {
  width: 40px;
}

/* 内容区域居中优化 */
.app-content-wrapper {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0;
}

.app-content {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 16px 16px 40px;
}

.content-card {
  background: rgba(20, 30, 48, 0.5);
  border-radius: 24px;
  padding: 24px;
  margin-top: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.2),
    0 1px 3px rgba(0, 0, 0, 0.05);
}

.upload-container {
  margin-bottom: 20px;
  width: 100%;
  cursor: pointer;
}

.upload-inner {
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 0.2s ease;
  
  &:active {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  &.has-preview {
    border-style: solid;
    border-color: rgba(255, 255, 255, 0.1);
    padding: 12px;
  }
}

.upload-icon-container {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.5), rgba(79, 70, 229, 0.5));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: #fff;
  box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
}

.upload-text {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #fff;
}

.upload-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  max-width: 280px;
}

.name-input-container {
  margin: 20px 0;
  padding: 0 4px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
  padding-left: 2px;
}

.name-input {
  width: 100%;
  height: 46px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0 14px;
  font-size: 15px;
  color: white;
  transition: all 0.2s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: rgba(99, 102, 241, 0.6);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
}

.requirements-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 16px 0;
  padding: 10px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
  
  &:active {
    background: rgba(255, 255, 255, 0.08);
  }
  
  svg {
    color: rgba(255, 255, 255, 0.9);
  }
}

.agreement-section {
  margin: 20px 0;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding-left: 30px;
  user-select: none;
  
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:after {
      content: "";
      position: absolute;
      display: none;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      top: 2px;
    }
  }
  
  input:checked ~ .checkmark {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border-color: #4f46e5;
    
    &:after {
      display: block;
    }
  }
  
  .agreement-text {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    
    .agreement-link {
      color: #6366f1;
      text-decoration: none;
    }
  }
}

.submit-button {
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 16px;
  margin-top: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(to right, #6366f1, #4f46e5);
  box-shadow: 
    0 10px 20px rgba(79, 70, 229, 0.4),
    0 3px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:active:not(.disabled) {
    transform: translateY(1px);
    box-shadow: 0 5px 15px rgba(79, 70, 229, 0.3);
  }
  
  &.disabled {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.5);
    box-shadow: none;
    cursor: not-allowed;
  }
}

.requirements-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 480px;
  max-height: 85vh;
  background: #141e30;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 101;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  animation: modal-in 0.3s ease-out;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.modal-close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.requirement-title {
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 20px;
  line-height: 1.5;
}

.requirements-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.requirement-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
}

.requirement-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6366f1;
  margin-top: 6px;
  flex-shrink: 0;
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom, 0);
  min-height: 8px;
}

.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-video {
  width: 100%;
  max-height: 60vh;
  border-radius: 8px;
  background: #000;
}

/* 上传预览区域样式 */
.upload-preview {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-video {
  width: 100%;
  height: 180px;
  object-fit: contain;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
}

.video-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.video-name {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-size {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.video-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.video-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:active {
    background: rgba(255, 255, 255, 0.15);
  }
  
  &.delete {
    color: rgba(239, 68, 68, 0.9);
  }
}

.agreement-content {
  color: rgba(255, 255, 255, 0.9);
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    text-align: center;
  }
  
  .agreement-date {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 20px;
    text-align: center;
  }
  
  .agreement-section-content {
    margin-bottom: 20px;
    
    h4 {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #6366f1;
    }
    
    p {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 8px;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.agreement-link {
  color: #6366f1;
  text-decoration: none;
  cursor: pointer;
  
  &:active {
    opacity: 0.8;
  }
}

.agreement-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 提示样式 */
.loading-toast,
.success-toast,
.error-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 15px 20px;
  border-radius: 8px;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-toast {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  min-width: 120px;
  min-height: 120px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
}

.success-toast {
  background: rgba(39, 174, 96, 0.9);
  color: white;
  padding: 12px 20px;
}

.error-toast {
  background: rgba(231, 76, 60, 0.9);
  color: white;
  padding: 12px 20px;
}

/* 响应式适配 */
/* 小屏幕设备 (iPhone SE 等) */
@media screen and (max-width: 375px) {
  .page-container {
    .main-container {
      padding: 12px;
      
      .header {
        margin-bottom: 16px;
        
        .page-title {
          font-size: 18px;
        }
        
        .nav-buttons {
          .back-button, .home-button {
            width: 36px;
            height: 36px;
          }
        }
      }
      
      .app-content {
        .content-card {
          padding: 16px;
          
          .upload-container {
            .upload-inner {
              padding: 16px;
              
              .upload-icon-container {
                margin-bottom: 12px;
                
                svg {
                  width: 28px;
                  height: 28px;
                }
              }
              
              .upload-text {
                font-size: 16px;
                margin-bottom: 8px;
              }
              
              .upload-desc {
                font-size: 12px;
              }
              
              .upload-preview {
                .video-info {
                  .video-name {
                    font-size: 14px;
                  }
                  
                  .video-size {
                    font-size: 12px;
                  }
                }
                
                .video-actions {
                  .video-action-btn {
                    padding: 6px 10px;
                    font-size: 12px;
                  }
                }
              }
            }
          }
          
          .name-input-container {
            margin-top: 16px;
            
            .input-label {
              font-size: 14px;
              margin-bottom: 6px;
            }
            
            .name-input {
              height: 44px;
              font-size: 14px;
            }
          }
          
          .requirements-hint {
            margin-top: 14px;
            font-size: 13px;
          }
          
          .agreement-section {
            margin-top: 16px;
            
            .agreement-text {
              font-size: 13px;
            }
          }
          
          .submit-button {
            height: 46px;
            font-size: 15px;
            margin-top: 20px;
          }
        }
      }
    }
  }
  
  .modal-content {
    width: 90%;
    padding: 16px;
    
    .modal-header {
      padding-bottom: 12px;
      margin-bottom: 12px;
      
      .modal-title {
        font-size: 16px;
      }
    }
    
    .modal-body {
      .requirement-title {
        font-size: 14px;
        margin-bottom: 12px;
      }
      
      .requirements-list {
        .requirement-item {
          font-size: 13px;
          margin-bottom: 8px;
        }
      }
    }
  }
}

/* 中等屏幕设备 (iPhone X, 11, 12, 13 等) */
@media screen and (min-width: 376px) and (max-width: 428px) {
  .page-container {
    .main-container {
      padding: 16px;
      
      .app-content {
        .content-card {
          padding: 20px;
        }
      }
    }
  }
  
  .modal-content {
    width: 85%;
    padding: 20px;
  }
}

/* 大屏幕设备 (iPhone 14 Pro Max 等) */
@media screen and (min-width: 429px) {
  .page-container {
    .main-container {
      padding: 20px;
      
      .app-content-wrapper {
        max-width: 500px;
        margin: 0 auto;
      }
      
      .app-content {
        .content-card {
          padding: 24px;
          
          .upload-container {
            .upload-inner {
              padding: 24px;
            }
          }
          
          .submit-button {
            height: 52px;
            font-size: 16px;
          }
        }
      }
    }
  }
  
  .modal-content {
    width: 80%;
    max-width: 450px;
    padding: 24px;
  }
}
</style> 