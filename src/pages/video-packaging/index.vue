<template>
  <view class="video-packaging-container">
    <!-- 背景元素 -->
    <view class="bg-gradient"></view>
    <view class="bg-grid"></view>
    
    <!-- 页面标题 -->
    <view class="page-header">
      <view @click="goBack" class="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#ffffff"/>
        </svg>
      </view>
      <text class="page-title">一键包装</text>
    </view>
    
    <!-- 隐藏的文件选择器 -->
    <input 
      type="file" 
      ref="fileInput"
      accept="video/*"
      style="display: none;"
      @change="handleFileChange"
    />
    
    <!-- 主要内容区域 -->
    <view class="content-wrap">
      <!-- 步骤指示器 -->
      <view class="steps-indicator">
        <view 
          v-for="(step, index) in steps" 
          :key="index" 
          class="step" 
          :class="{ 'active': currentStep >= index, 'completed': currentStep > index }"
        >
          <view class="step-circle">{{ index + 1 }}</view>
          <text class="step-name">{{ step.name }}</text>
        </view>
      </view>
      
      <!-- 上传视频步骤 -->
      <view v-if="currentStep === 0" class="step-content upload-step">
        <view class="upload-area" @click="selectVideo" :class="{'has-video': videoFile}">
          <template v-if="!videoFile">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" fill="rgba(255, 255, 255, 0.7)"/>
            </svg>
            <text class="upload-text">点击上传视频</text>
            <text class="upload-desc">支持MP4、MOV、AVI等格式 (最大100MB)</text>
          </template>
          <template v-else>
            <video 
              v-if="videoUrl" 
              class="video-preview" 
              :src="videoUrl" 
              object-fit="contain"
              controls
            ></video>
            <view class="video-info">
              <text class="video-name">{{ videoFile.name }}</text>
              <text class="video-size">{{ formatFileSize(videoFile.size) }}</text>
            </view>
            <view class="video-actions">
              <view class="action-btn" @click.stop="selectVideo">
                <text>更换视频</text>
              </view>
            </view>
          </template>
        </view>
        
        <view class="next-step-btn" :class="{'disabled': !videoFile}" @click="goToNextStep">
          <text>下一步</text>
        </view>
      </view>
      
      <!-- 风格选择步骤 -->
      <view v-if="currentStep === 1" class="step-content style-step">
        <view class="style-selection">
          <text class="style-title">选择字幕风格</text>
          
          <scroll-view scroll-x class="styles-scroll" show-scrollbar="false">
            <view 
              v-for="(style, index) in subtitleStyles" 
              :key="index"
              class="style-card"
              :class="{'selected': selectedStyle === index}"
              @click="selectStyle(index)"
            >
              <image class="style-preview" :src="style.preview" mode="aspectFill"></image>
              <text class="style-name">{{ style.name }}</text>
            </view>
          </scroll-view>
          
          <text class="style-title">选择特效强度</text>
          <view class="effect-slider">
            <text class="slider-label">简约</text>
            <slider 
              class="slider" 
              min="1" 
              max="10" 
              :value="effectIntensity" 
              @change="updateIntensity"
              activeColor="#00FFAA"
              backgroundColor="#333"
              block-color="#FFFFFF"
              block-size="24"
            />
            <text class="slider-label">炫酷</text>
          </view>
          
          <text class="style-title">视频质量</text>
          <view class="quality-options">
            <view 
              v-for="(option, index) in qualityOptions" 
              :key="index"
              class="quality-option"
              :class="{'selected': selectedQuality === index}"
              @click="selectQuality(index)"
            >
              <text class="quality-name">{{ option.name }}</text>
              <text class="quality-desc">{{ option.desc }}</text>
            </view>
          </view>
        </view>
        
        <view class="step-actions">
          <view class="action-btn back-btn" @click="goToPreviousStep">
            <text>上一步</text>
          </view>
          <view class="action-btn next-btn" @click="goToNextStep">
            <text>下一步</text>
          </view>
        </view>
      </view>
      
      <!-- 处理中步骤 -->
      <view v-if="currentStep === 2" class="step-content processing-step">
        <view class="processing-info">
          <view class="processing-circle">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#323842" stroke-width="8"/>
              <circle cx="50" cy="50" r="45" fill="none" stroke="#00FFAA" stroke-width="8"
                      stroke-dasharray="283" :stroke-dashoffset="283 - (283 * (processingProgress / 100))" 
                      transform="rotate(-90 50 50)"/>
            </svg>
            <text class="progress-text">{{ processingProgress }}%</text>
          </view>
          
          <text class="processing-status">{{ processingStatus }}</text>
          
          <view class="processing-steps">
            <view 
              v-for="(pStep, index) in processingSteps" 
              :key="index"
              class="processing-step-item"
              :class="{
                'active': currentProcessingStep === index,
                'completed': currentProcessingStep > index
              }"
            >
              <view class="step-circle">
                <svg v-if="currentProcessingStep > index" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#FFFFFF"/>
                </svg>
                <text v-else>{{ index + 1 }}</text>
              </view>
              <view class="step-info">
                <text class="step-name">{{ pStep.name }}</text>
                <text class="step-desc">{{ pStep.desc }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 成功完成步骤 -->
      <view v-if="currentStep === 3" class="step-content result-step">
        <view class="result-info">
          <view class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#00FFAA"/>
            </svg>
          </view>
          <text class="result-title">视频包装完成!</text>
          <text class="result-desc">您的视频已成功添加字幕和特效</text>
          
          <view class="result-video-container">
            <video 
              v-if="resultVideoUrl" 
              class="result-video" 
              :src="resultVideoUrl" 
              object-fit="contain"
              controls
            ></video>
          </view>
          
          <view class="result-actions">
            <view class="action-btn download-btn" @click="downloadVideo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
              </svg>
              <text>下载视频</text>
            </view>
            <view class="action-btn share-btn" @click="shareVideo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" fill="currentColor"/>
              </svg>
              <text>分享视频</text>
            </view>
          </view>
          
          <view class="home-btn" @click="goToHome">
            <text>返回首页</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 步骤数据
const steps = [
  { name: '上传视频' },
  { name: '选择风格' },
  { name: '处理中' },
  { name: '完成' }
];

const currentStep = ref(0);
const videoFile = ref(null);
const videoUrl = ref('');
const resultVideoUrl = ref('');
const selectedStyle = ref(0);
const effectIntensity = ref(5);
const selectedQuality = ref(1);
const processingProgress = ref(0);
const processingStatus = ref('正在处理您的视频...');
const currentProcessingStep = ref(0);

// 字幕风格选项
const subtitleStyles = [
  { 
    name: '抖音风格', 
    preview: 'https://example.com/douyin-style.jpg' 
  },
  { 
    name: '科技简约', 
    preview: 'https://example.com/tech-style.jpg' 
  },
  { 
    name: '活力青春', 
    preview: 'https://example.com/youth-style.jpg' 
  },
  { 
    name: '商务专业', 
    preview: 'https://example.com/business-style.jpg' 
  },
  { 
    name: '网红潮流', 
    preview: 'https://example.com/influencer-style.jpg' 
  },
];

// 质量选项
const qualityOptions = [
  { name: '标准清晰度', desc: '480p - 更快处理' },
  { name: '高清品质', desc: '720p - 推荐' },
  { name: '超清画质', desc: '1080p - 需更长处理时间' }
];

// 处理步骤
const processingSteps = [
  { name: '音频提取', desc: '正在从视频中提取音频...' },
  { name: '语音识别', desc: '正在分析音频内容...' },
  { name: '文本处理', desc: '正在标记关键词和句子...' },
  { name: '特效生成', desc: '正在应用动态字幕特效...' },
  { name: '视频渲染', desc: '正在合成最终视频...' }
];

// 文件输入引用
const fileInput = ref(null);

// 返回上一页
const goBack = () => {
  router.go(-1);
};

// 返回首页
const goToHome = () => {
  router.push('/pages/index/index');
};

// 选择视频文件
const selectVideo = () => {
  // 触发隐藏的文件输入
  fileInput.value.click();
};

// 处理文件选择变更
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // 检查文件类型
  if (!file.type.startsWith('video/')) {
    // Web环境下的提示
    alert('请选择视频文件');
    return;
  }
  
  // 检查文件大小（限制为100MB）
  if (file.size > 100 * 1024 * 1024) {
    alert('视频文件不能超过100MB');
    return;
  }
  
  // 创建文件URL
  const fileURL = URL.createObjectURL(file);
  
  videoFile.value = {
    name: file.name,
    size: file.size,
    type: file.type,
    path: fileURL,
    file: file  // 保存原始文件对象，用于上传
  };
  videoUrl.value = fileURL;
};

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 选择字幕风格
const selectStyle = (index) => {
  selectedStyle.value = index;
};

// 更新特效强度
const updateIntensity = (e) => {
  effectIntensity.value = e.detail.value;
};

// 选择视频质量
const selectQuality = (index) => {
  selectedQuality.value = index;
};

// 进入下一步
const goToNextStep = () => {
  if (currentStep.value === 0 && !videoFile.value) {
    return;
  }
  
  if (currentStep.value === 1) {
    // 开始处理视频 - 调用上传接口
    uploadVideoToServer();
    // 先进入处理中状态，显示上传进度
    currentStep.value = 2;
    return;
  }
  
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
};

// 返回上一步
const goToPreviousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

// 开始处理视频
const startProcessing = () => {
  // 模拟处理进度
  currentProcessingStep.value = 0;
  processingProgress.value = 0;
  
  const processSteps = async () => {
    for (let i = 0; i < processingSteps.length; i++) {
      currentProcessingStep.value = i;
      processingStatus.value = processingSteps[i].desc;
      
      // 模拟每个步骤的进度
      const startProgress = (i / processingSteps.length) * 100;
      const endProgress = ((i + 1) / processingSteps.length) * 100;
      
      await simulateProgress(startProgress, endProgress);
    }
    
    // 处理完成后设置结果视频
    resultVideoUrl.value = videoUrl.value; // 实际应该是处理后的视频URL
    setTimeout(() => {
      currentStep.value = 3; // 跳转到完成步骤
    }, 1000);
  };
  
  processSteps();
};

// 模拟进度增长
const simulateProgress = (start, end) => {
  return new Promise((resolve) => {
    const duration = 2000; // 每个步骤模拟2秒
    const interval = 100;
    const steps = duration / interval;
    const increment = (end - start) / steps;
    let currentProgress = start;
    let step = 0;
    
    const intervalId = setInterval(() => {
      step++;
      currentProgress += increment;
      processingProgress.value = Math.round(currentProgress);
      
      if (step >= steps) {
        clearInterval(intervalId);
        resolve();
      }
    }, interval);
  });
};

// 下载视频
const downloadVideo = () => {
  // Web环境下的下载实现
  if (resultVideoUrl.value) {
    const a = document.createElement('a');
    a.href = resultVideoUrl.value;
    a.download = '视频包装_' + new Date().getTime() + '.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    alert('下载失败，视频URL不存在');
  }
};

// 分享视频
const shareVideo = () => {
  // Web环境下的分享实现
  if (navigator.share && resultVideoUrl.value) {
    navigator.share({
      title: '我的网感视频',
      text: '使用一键包装制作的视频',
      url: resultVideoUrl.value
    }).then(() => {
      console.log('分享成功');
    }).catch((error) => {
      console.log('分享失败', error);
      alert('分享失败，请手动复制链接分享');
    });
  } else {
    // 不支持navigator.share的浏览器，显示链接让用户手动复制
    alert('请复制链接分享: ' + (resultVideoUrl.value || window.location.href));
  }
};

// 上传视频到服务器
const uploadVideoToServer = () => {
  // 创建FormData对象
  const formData = new FormData();
  formData.append('video', videoFile.value.file); // 使用'video'作为参数名，与后端一致
  formData.append('styleId', selectedStyle.value);
  formData.append('intensity', effectIntensity.value);
  formData.append('quality', qualityOptions[selectedQuality.value].name);
  
  // 使用fetch API上传
  fetch('/tms/api/video-packaging/upload', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    if (data.code === 0) {
      // 处理成功，获取任务ID进行轮询
      pollProcessingStatus(data.data.taskId);
    } else {
      // 处理失败
      alert('上传失败: ' + data.message);
    }
  })
  .catch(error => {
    console.error('上传错误:', error);
    alert('网络错误，请重试');
  });
};

// 轮询处理状态
const pollProcessingStatus = (taskId) => {
  const intervalId = setInterval(() => {
    fetch(`/tms/api/video-packaging/status?taskId=${taskId}`)
      .then(response => response.json())
      .then(data => {
        if (data.code === 0) {
          const statusData = data.data;
          processingProgress.value = statusData.progress;
          processingStatus.value = statusData.statusText;
          currentProcessingStep.value = statusData.currentStep;
          
          if (statusData.status === 'completed') {
            clearInterval(intervalId);
            resultVideoUrl.value = statusData.resultVideoUrl;
            currentStep.value = 3; // 进入完成步骤
          } else if (statusData.status === 'failed') {
            clearInterval(intervalId);
            alert('处理失败: ' + statusData.message);
          }
        } else {
          clearInterval(intervalId);
          alert('获取状态失败: ' + data.message);
        }
      })
      .catch(error => {
        console.error('轮询错误:', error);
        clearInterval(intervalId);
        alert('网络错误，请重试');
      });
  }, 2000);
};
</script>

<style lang="scss" scoped>
.video-packaging-container {
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
}

.page-header {
  position: relative;
  z-index: 10;
  padding: 20px 16px;
  display: flex;
  align-items: center;
}

.back-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
}

.content-wrap {
  position: relative;
  z-index: 5;
  padding: 0 16px 32px;
  max-width: 480px;
  margin: 0 auto;
}

.steps-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 16px;
    left: 10%;
    width: 80%;
    height: 2px;
    background-color: rgba(255, 255, 255, 0.2);
    z-index: 0;
  }
  
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
    flex: 1;
    
    &.active {
      .step-circle {
        background: linear-gradient(135deg, #00ffaa, #7fff00);
        color: #000;
      }
      
      .step-name {
        color: #00ffaa;
      }
    }
    
    &.completed {
      .step-circle {
        background: #00ffaa;
        color: #000;
      }
    }
    
    .step-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      margin-bottom: 8px;
      transition: all 0.3s ease;
    }
    
    .step-name {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      transition: all 0.3s ease;
    }
  }
}

.step-content {
  background-color: rgba(30, 32, 36, 0.5);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px;
  min-height: 400px;
}

.upload-step {
  .upload-area {
    height: 240px;
    border-radius: 12px;
    border: 2px dashed rgba(255, 255, 255, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-bottom: 24px;
    padding: 16px;
    
    &.has-video {
      border: none;
      background-color: rgba(0, 0, 0, 0.3);
    }
    
    .upload-text {
      font-size: 18px;
      font-weight: 600;
      margin: 16px 0 8px;
    }
    
    .upload-desc {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      text-align: center;
    }
    
    .video-preview {
      width: 100%;
      height: 180px;
      border-radius: 8px;
    }
    
    .video-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 8px 0;
      
      .video-name {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 4px;
      }
      
      .video-size {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }
    }
    
    .video-actions {
      display: flex;
      justify-content: center;
      margin-top: 8px;
      
      .action-btn {
        padding: 6px 12px;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        font-size: 14px;
      }
    }
  }
  
  .next-step-btn {
    height: 48px;
    background: linear-gradient(to right, #7fff00, #00ffaa);
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.8);
    box-shadow: 0 4px 12px rgba(0, 255, 170, 0.25);
    
    &.disabled {
      opacity: 0.5;
      background: #555;
      color: rgba(255, 255, 255, 0.5);
      box-shadow: none;
    }
  }
}

.style-step {
  .style-selection {
    margin-bottom: 24px;
    
    .style-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      display: block;
    }
  }
  
  .styles-scroll {
    white-space: nowrap;
    margin-bottom: 24px;
    
    .style-card {
      display: inline-block;
      margin-right: 12px;
      width: 120px;
      vertical-align: top;
      
      &.selected {
        .style-preview {
          border: 2px solid #00ffaa;
        }
        
        .style-name {
          color: #00ffaa;
        }
      }
      
      .style-preview {
        width: 120px;
        height: 80px;
        border-radius: 8px;
        background-color: rgba(0, 0, 0, 0.3);
        margin-bottom: 8px;
        border: 2px solid transparent;
      }
      
      .style-name {
        font-size: 14px;
        text-align: center;
      }
    }
  }
  
  .effect-slider {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    
    .slider-label {
      font-size: 14px;
      width: 40px;
    }
    
    .slider {
      flex: 1;
      margin: 0 16px;
    }
  }
  
  .quality-options {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
    
    .quality-option {
      padding: 16px;
      border-radius: 10px;
      background-color: rgba(255, 255, 255, 0.1);
      border: 1px solid transparent;
      transition: all 0.3s ease;
      
      &.selected {
        background-color: rgba(0, 255, 170, 0.1);
        border-color: rgba(0, 255, 170, 0.5);
      }
      
      .quality-name {
        font-size: 16px;
        font-weight: 600;
        display: block;
        margin-bottom: 4px;
      }
      
      .quality-desc {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
  
  .step-actions {
    display: flex;
    gap: 16px;
    
    .action-btn {
      flex: 1;
      height: 48px;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      
      &.back-btn {
        background-color: rgba(255, 255, 255, 0.1);
        color: #fff;
      }
      
      &.next-btn {
        background: linear-gradient(to right, #7fff00, #00ffaa);
        color: rgba(0, 0, 0, 0.8);
        box-shadow: 0 4px 12px rgba(0, 255, 170, 0.25);
      }
    }
  }
}

.processing-step {
  .processing-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .processing-circle {
      width: 120px;
      height: 120px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      
      svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
        
        circle {
          transition: stroke-dashoffset 0.5s ease;
        }
      }
      
      .progress-text {
        font-size: 24px;
        font-weight: 700;
        color: #00ffaa;
      }
    }
    
    .processing-status {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 32px;
    }
    
    .processing-steps {
      width: 100%;
      
      .processing-step-item {
        display: flex;
        align-items: flex-start;
        padding: 12px 0;
        opacity: 0.5;
        transition: all 0.3s ease;
        
        &.active, &.completed {
          opacity: 1;
        }
        
        &.active {
          .step-circle {
            background: linear-gradient(135deg, #00ffaa, #7fff00);
            color: #000;
          }
          
          .step-name {
            color: #00ffaa;
          }
        }
        
        &.completed {
          .step-circle {
            background: #00ffaa;
          }
        }
        
        .step-circle {
          width: 24px;
          height: 24px;
          min-width: 24px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          margin-right: 16px;
          margin-top: 2px;
        }
        
        .step-info {
          .step-name {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
          }
          
          .step-desc {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
          }
        }
      }
    }
  }
}

.result-step {
  .result-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .success-icon {
      margin-bottom: 16px;
    }
    
    .result-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .result-desc {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 24px;
    }
    
    .result-video-container {
      width: 100%;
      margin-bottom: 24px;
      border-radius: 12px;
      overflow: hidden;
      
      .result-video {
        width: 100%;
        height: 200px;
      }
    }
    
    .result-actions {
      display: flex;
      gap: 16px;
      width: 100%;
      margin-bottom: 24px;
      
      .action-btn {
        flex: 1;
        height: 48px;
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        gap: 8px;
        
        &.download-btn {
          background: linear-gradient(to right, #7fff00, #00ffaa);
          color: rgba(0, 0, 0, 0.8);
        }
        
        &.share-btn {
          background-color: rgba(66, 135, 245, 0.2);
          border: 1px solid rgba(66, 135, 245, 0.5);
          color: #4287f5;
        }
      }
    }
    
    .home-btn {
      width: 100%;
      height: 48px;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      background-color: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
  }
}
</style> 