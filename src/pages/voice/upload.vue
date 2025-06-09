<template>
  <view class="page-container">
    <!-- 头部导航 -->
    <view class="header">
      <view class="back-button" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </view>
      <view class="page-title">声音克隆</view>
      <view class="right-actions">
        <!-- 移除了新建声音按钮 -->
      </view>
    </view>

    <div class="app-content-wrapper">
      <div class="app-content">
        <!-- 标签切换 -->
        <view class="tabs">
          <view 
            class="tab-item" 
            :class="{ active: activeTab === 'record' }" 
            @click="switchTab('record')"
          >
            录制音频
          </view>
          <view 
            class="tab-item" 
            :class="{ active: activeTab === 'upload' }" 
            @click="switchTab('upload')"
          >
            上传音频
          </view>
        </view>

        <!-- 声音名称输入框（移到顶部） -->
        <view class="name-input-container top-name-input">
          <view class="input-label">声音名称</view>
          <input 
            type="text" 
            v-model="voiceName" 
            class="name-input" 
            placeholder="请输入声音名称（必填）"
          />
        </view>

        <!-- 录音界面 -->
        <view class="tab-content" v-if="activeTab === 'record'">
          <!-- 录音状态显示 -->
          <view class="record-status">
            <view class="status-text">{{ recordStatus }}</view>
            <view class="time-counter" v-if="isRecording || (activeTab === 'record' && recordedAudioUrl)">{{ formatTime(recordDuration) }}</view>
          </view>

          <!-- 波形图 -->
          <view class="waveform-container">
            <view class="waveform" v-if="isRecording">
              <view 
                class="wave-bar" 
                v-for="(height, index) in waveHeights" 
                :key="index" 
                :style="{ height: height + 'px' }"
              ></view>
            </view>
            <view class="empty-waveform" v-else-if="!recordedAudioUrl || activeTab !== 'record'">
              <view class="empty-text">录音开始后将显示波形图</view>
            </view>
            <view class="custom-audio-player" v-else-if="activeTab === 'record' && recordedAudioUrl">
              <view class="play-button" @click="togglePlay">
                <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              </view>
              <view class="progress-container">
                <view class="progress-bar" @click="seekAudio">
                  <view class="progress-fill" :style="{ width: `${audioProgress}%` }"></view>
                </view>
                <view class="time-display">{{ currentTimeFormatted }} / {{ durationFormatted }}</view>
              </view>
              <audio 
                ref="audioElement"
                :src="recordedAudioUrl" 
                class="hidden-audio"
                @timeupdate="onTimeUpdate"
                @loadedmetadata="onAudioLoaded"
                @ended="onAudioEnded"
              ></audio>
            </view>
          </view>

          <!-- 录音控制按钮 -->
          <view class="record-controls">
            <view 
              class="record-btn" 
              :class="{ recording: isRecording }"
              @click="toggleRecording"
            >
              <view class="record-btn-inner">
                <view class="record-icon" v-if="!isRecording"></view>
                <view class="stop-icon" v-else></view>
              </view>
            </view>
            <view class="record-label">{{ isRecording ? '停止录音' : '开始录音' }}</view>
          </view>

          <!-- 录音提示 -->
          <view class="record-tips">
            <view class="tip-title-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z"/>
              </svg>
            </view>
            <view class="tip-title">录音提示</view>
            <view class="tip-content">
              <view class="tip-item">请确保环境安静，避免背景噪音</view>
              <view class="tip-item">请以正常语速和音量说话</view>
              <view class="tip-item">请录制至少15秒以上的音频</view>
            </view>
          </view>
        </view>

        <!-- 上传界面 -->
        <view class="tab-content upload-tab-content" v-if="activeTab === 'upload'">
          <!-- 上传成功后只显示音频预览和控制选项 -->
          <view class="uploaded-content" v-if="audioFile && uploadedAudioUrl">
            <view class="file-info">
              <view class="file-size">{{ formatFileSize(audioFile.size) }}</view>
            </view>
            <!-- 自定义音频播放器 -->
            <view class="custom-audio-player">
              <view class="play-button" @click="togglePlay">
                <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              </view>
              <view class="progress-container">
                <view class="progress-bar" @click="seekAudio">
                  <view class="progress-fill" :style="{ width: `${audioProgress}%` }"></view>
                </view>
                <view class="time-display">{{ currentTimeFormatted }} / {{ durationFormatted }}</view>
              </view>
              <!-- 隐藏的原始audio元素用于控制 -->
              <audio 
                ref="audioElement"
                :src="uploadedAudioUrl" 
                class="hidden-audio"
                @timeupdate="onTimeUpdate"
                @loadedmetadata="onAudioLoaded"
                @ended="onAudioEnded"
              ></audio>
            </view>
            <!-- 删除按钮 -->
            <view class="file-actions">
              <view class="file-action-btn delete" @click="removeAudioFile">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                <text>删除</text>
              </view>
            </view>
          </view>

          <!-- 未上传时显示上传组件 -->
          <view class="upload-container" @click="selectAudioFile" v-else>
            <view class="upload-inner">
              <view class="upload-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
              </view>
              <view class="upload-text">点击上传音频文件</view>
              <view class="upload-desc">支持MP3、WAV格式，大小不超过50MB</view>
            </view>
          </view>

          <!-- 上传提示 -->
          <view class="upload-tips">
            <view class="tip-title-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z"/>
              </svg>
            </view>
            <view class="tip-title">上传提示</view>
            <view class="tip-content">
              <view class="tip-item">请上传清晰的人声音频</view>
              <view class="tip-item">避免背景音乐和噪音</view>
              <view class="tip-item">建议15-60秒，效果最佳</view>
              <view class="tip-item">支持MP3、WAV格式，小于50MB</view>
            </view>
          </view>
        </view>

        <!-- 协议确认 -->
        <view class="agreement-section">
          <view class="agreement-checkbox" :class="{ checked: agreeTerms }" @click="agreeTerms = !agreeTerms">
            <view class="checkbox-inner" v-if="agreeTerms"></view>
          </view>
          <text class="agreement-text">同意并且确认<span class="agreement-link" @click="showAgreement = true">《使用者承诺须知》</span></text>
        </view>

        <!-- 协议弹窗 -->
        <div class="agreement-modal" v-if="showAgreement" @click.self="showAgreement = false">
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-title">使用者承诺须知</div>
              <div class="close-btn" @click="showAgreement = false">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </div>
            </div>
            <div class="agreement-content">
              <div class="agreement-section">
                <div class="agreement-section-title">1. 服务描述</div>
                <p>声音克隆服务允许用户上传音频样本，并利用AI技术创建模仿用户声音特征的合成语音。用户理解并接受，该技术仅用于合法、正当的个人或商业用途。</p>
              </div>
              
              <div class="agreement-section">
                <div class="agreement-section-title">2. 用户授权与隐私</div>
                <p>用户通过上传音频样本，授权我们处理该音频数据以创建声音克隆模型。我们将按照隐私政策保护用户数据，不会未经授权将用户声音用于其他商业目的。</p>
              </div>
              
              <div class="agreement-section">
                <div class="agreement-section-title">3. 用户责任</div>
                <p>用户承诺：</p>
                <p>- 不使用声音克隆技术从事任何违法活动或欺诈行为</p>
                <p>- 不侵犯他人隐私或未经授权克隆他人声音</p>
                <p>- 不利用声音克隆传播虚假信息、仇恨言论或有害内容</p>
                <p>- 在使用合成声音时，适当披露其AI合成性质</p>
              </div>
              
              <div class="agreement-section">
                <div class="agreement-section-title">4. 知识产权</div>
                <p>用户保留其原始音频样本的权利。通过我们的服务生成的合成语音，其使用权归用户所有，但技术和服务的知识产权归我们所有。</p>
              </div>
              
              <div class="agreement-section">
                <div class="agreement-section-title">5. 免责声明</div>
                <p>我们不对用户利用声音克隆技术可能造成的任何损失、损害或法律后果承担责任。服务按"现状"提供，不提供任何明示或暗示的保证。</p>
              </div>
              
              <div class="agreement-section">
                <div class="agreement-section-title">6. 协议修改</div>
                <p>我们保留随时修改本协议的权利。修改后的协议将在网站上公布，继续使用我们的服务即表示接受修改后的条款。</p>
              </div>
              
              <div class="agreement-section">
                <div class="agreement-section-title">7. 适用法律</div>
                <p>本协议受中华人民共和国法律管辖，任何争议应通过友好协商解决。</p>
              </div>
            </div>
            <button class="confirm-btn" @click="showAgreement = false">我已阅读并同意</button>
          </div>
        </div>

        <!-- 提交按钮 -->
        <view class="submit-button-container">
          <view class="submit-button" :class="{ disabled: !canSubmit }" @click="submitVoice">
            确认提交
          </view>
        </view>
      </div>
    </div>

    <!-- 添加自定义提示组件到模板底部 -->
    <!-- 自定义提示弹窗 -->
    <div class="custom-toast" v-if="showToast" :class="{ error: toastType === 'error', success: toastType === 'success' }">
      <div class="toast-icon" v-if="toastType === 'error'">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      </div>
      <div class="toast-icon" v-else>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <div class="toast-message">{{ toastMessage }}</div>
    </div>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { voiceApi } from '../../api/services';

const router = useRouter();
const activeTab = ref('record');
const audioFile = ref(null);
const audioUrl = ref('');
const audioBlob = ref(null);
const agreeTerms = ref(false);
const voiceName = ref('');
const showAgreement = ref(false);

// 录制的音频URL
const recordedAudioUrl = ref('');
// 上传的音频URL
const uploadedAudioUrl = ref('');

// 获取当前活动的音频URL
const getCurrentAudioUrl = computed(() => {
  return activeTab.value === 'record' ? recordedAudioUrl.value : uploadedAudioUrl.value;
});

// 录音相关变量
const isRecording = ref(false);
const recordStatus = ref('准备录音');
const recordDuration = ref(0);
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const recordTimer = ref(null);
const waveHeights = ref(Array(30).fill(5)); // 初始波形高度

// 音频播放器相关变量
const audioElement = ref(null);
const isPlaying = ref(false);
const audioProgress = ref(0);
const currentTime = ref(0);
const duration = ref(0);

// 音频时间格式化
const formatAudioTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const currentTimeFormatted = computed(() => {
  return formatAudioTime(currentTime.value);
});

const durationFormatted = computed(() => {
  return formatAudioTime(duration.value);
});

// 播放/暂停切换
const togglePlay = () => {
  try {
    if (!audioElement.value) return;
    
    if (isPlaying.value) {
      audioElement.value.pause();
    } else {
      // 设置音量防止过大声音
      audioElement.value.volume = 0.75;
      const playPromise = audioElement.value.play();
      
      // 处理播放的Promise对象
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('播放错误:', error);
          isPlaying.value = false;
        });
      }
    }
    isPlaying.value = !isPlaying.value;
  } catch (error) {
    console.error('音频控制错误:', error);
    isPlaying.value = false;
  }
};

// 音频事件处理
const onTimeUpdate = () => {
  try {
    if (!audioElement.value) return;
    
    currentTime.value = audioElement.value.currentTime;
    if (duration.value > 0) {
      audioProgress.value = (currentTime.value / duration.value) * 100;
    }
  } catch (error) {
    console.error('更新时间错误:', error);
  }
};

const onAudioLoaded = () => {
  try {
    if (!audioElement.value) return;
    
    duration.value = audioElement.value.duration || 0;
  } catch (error) {
    console.error('加载音频错误:', error);
    duration.value = 0;
  }
};

const onAudioEnded = () => {
  isPlaying.value = false;
  audioProgress.value = 0;
  currentTime.value = 0;
};

// 计算属性：是否可以提交
const canSubmit = computed(() => {
  return ((activeTab.value === 'record' && recordedAudioUrl.value) || 
         (activeTab.value === 'upload' && audioFile.value)) && 
         agreeTerms.value && voiceName.value.trim() !== '';
});

// 格式化时间显示 (秒 -> mm:ss)
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 切换录音状态
const toggleRecording = async () => {
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
};

// 添加录音相关变量
const audioContext = ref(null);
const audioInput = ref(null);
const audioProcessor = ref(null);
const audioData = ref([]);
const audioBufferSize = 4096;
const audioWorker = ref(null);
const audioRecording = ref(false);

// 开始录音 - 使用AudioContext API
const startRecording = async () => {
  try {
    // 重置音频数据
    audioData.value = [];
    
    // 获取音频流
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 44100,
        echoCancellation: true,
        noiseSuppression: true
      }
    });

    // 使用AudioContext进行录音
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 44100,
    });
    
    // 从流创建源节点
    audioInput.value = audioContext.value.createMediaStreamSource(stream);
    
    // 创建处理器节点
    audioProcessor.value = audioContext.value.createScriptProcessor(audioBufferSize, 1, 1);
    
    // 连接节点
    audioInput.value.connect(audioProcessor.value);
    audioProcessor.value.connect(audioContext.value.destination);
    
    // 记录流，以便停止时使用
    audioProcessor.value.stream = stream;

    // 启动录制状态管理
    audioRecording.value = true;
    isRecording.value = true;
    recordStatus.value = '正在录音...';
    recordDuration.value = 0;
    
    // 处理音频数据
    audioProcessor.value.onaudioprocess = (e) => {
      if (!audioRecording.value) return;
      
      // 获取单声道数据
      const buffer = e.inputBuffer.getChannelData(0);
      const data = new Float32Array(buffer);
      audioData.value.push(new Float32Array(data));
    };
    
    // 开始计时和波形显示
    recordTimer.value = setInterval(() => {
      recordDuration.value++;
      // 生成随机波形高度
      waveHeights.value = waveHeights.value.map(() => 5 + Math.random() * 30);
    }, 1000);
    
    console.log('录音已启动，采样率:', audioContext.value.sampleRate);
    
  } catch (error) {
    console.error('无法启动录音:', error);
    recordStatus.value = '录音失败';
    showCustomToast('无法获取麦克风权限，请确认您已授权此网站使用您的麦克风');
  }
};

// 停止录音并处理数据
const stopRecording = () => {
  if (!audioRecording.value) return;
  
  // 停止录音状态
  audioRecording.value = false;
  isRecording.value = false;
  clearInterval(recordTimer.value);
  recordStatus.value = '处理录音数据...';
  
  try {
    // 停止并断开audioProcessor
    if (audioProcessor.value) {
      audioProcessor.value.disconnect();
      audioProcessor.value.onaudioprocess = null;
      
      // 停止所有音轨
      if (audioProcessor.value.stream) {
        audioProcessor.value.stream.getTracks().forEach(track => track.stop());
      }
    }
    
    // 检查是否有录音数据
    if (!audioData.value.length) {
      recordStatus.value = '录音失败，未检测到音频';
      showCustomToast('录音失败，未检测到有效音频数据');
      return;
    }
    
    // 合并所有音频数据
    const dataLength = audioData.value.reduce((length, data) => length + data.length, 0);
    const mergedData = new Float32Array(dataLength);
    let offset = 0;
    
    for (let i = 0; i < audioData.value.length; i++) {
      mergedData.set(audioData.value[i], offset);
      offset += audioData.value[i].length;
    }
    
    console.log(`合并了${audioData.value.length}块音频数据，总长度:${dataLength}`);
    
    // 准备转换为WAV格式
    const wavData = encodeWAV(mergedData, audioContext.value.sampleRate);
    audioBlob.value = new Blob([wavData], { type: 'audio/wav' });
    
    console.log(`生成WAV文件，大小:${audioBlob.value.size}字节，时长:${recordDuration.value}秒`);
    
    // 如果文件太小，可能是录制失败
    if (audioBlob.value.size < 1000 || recordDuration.value < 1) {
      recordStatus.value = '录音太短或无效';
      showCustomToast('录音太短或无效，请重新录制');
      return;
    }
    
    // 创建预览URL
    recordedAudioUrl.value = URL.createObjectURL(audioBlob.value);
    recordStatus.value = '录音已完成';
    
    console.log('录音处理完成，可以预览');
    
  } catch (error) {
    console.error('处理录音时出错:', error);
    recordStatus.value = '录音处理失败';
    showCustomToast('处理录音数据时出错');
  }
};

// 编码WAV文件 - 这比MP3更可靠且无需额外库
const encodeWAV = (samples, sampleRate) => {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  
  // RIFF标识
  writeString(view, 0, 'RIFF');
  // RIFF块大小
  view.setUint32(4, 36 + samples.length * 2, true);
  // RIFF类型
  writeString(view, 8, 'WAVE');
  // 格式块标识
  writeString(view, 12, 'fmt ');
  // 格式块大小
  view.setUint32(16, 16, true);
  // 采样格式（PCM）
  view.setUint16(20, 1, true);
  // 通道数
  view.setUint16(22, 1, true);
  // 采样率
  view.setUint32(24, sampleRate, true);
  // 字节率
  view.setUint32(28, sampleRate * 2, true);
  // 块对齐
  view.setUint16(32, 2, true);
  // 采样位数
  view.setUint16(34, 16, true);
  // 数据块标识
  writeString(view, 36, 'data');
  // 数据块大小
  view.setUint32(40, samples.length * 2, true);
  
  // 写入PCM采样数据
  floatTo16BitPCM(view, 44, samples);
  
  return buffer;
};

// 辅助函数：写入字符串
const writeString = (view, offset, string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

// 辅助函数：Float32转为16位PCM
const floatTo16BitPCM = (output, offset, input) => {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
};

// 选择音频文件
const selectAudioFile = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'audio/mp3,audio/wav';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 检查文件大小
      if (file.size > 50 * 1024 * 1024) { // 50MB
        alert('音频文件不能超过50MB');
        return;
      }
      
      // 检查文件类型
      if (!['audio/mp3', 'audio/wav', 'audio/mpeg'].includes(file.type)) {
        alert('请上传MP3或WAV格式的音频文件');
        return;
      }
      
      audioFile.value = file;
      uploadedAudioUrl.value = URL.createObjectURL(file);
    }
  };
  input.click();
};

// 移除音频文件
const removeAudioFile = () => {
  audioFile.value = null;
  
  if (activeTab.value === 'upload' && uploadedAudioUrl.value) {
    URL.revokeObjectURL(uploadedAudioUrl.value);
    uploadedAudioUrl.value = '';
  }
};

// 重置表单
const resetForm = () => {
  if (isRecording.value) {
    stopRecording();
  }
  
  if (isPlaying.value && audioElement.value) {
    audioElement.value.pause();
    isPlaying.value = false;
  }
  
  audioFile.value = null;
  
  // 清理录制的音频URL
  if (recordedAudioUrl.value) {
    URL.revokeObjectURL(recordedAudioUrl.value);
    recordedAudioUrl.value = '';
  }
  
  // 清理上传的音频URL
  if (uploadedAudioUrl.value) {
    URL.revokeObjectURL(uploadedAudioUrl.value);
    uploadedAudioUrl.value = '';
  }
  
  audioProgress.value = 0;
  currentTime.value = 0;
  duration.value = 0;
  
  voiceName.value = '';
  recordStatus.value = '准备录音';
  recordDuration.value = 0;
  waveHeights.value = Array(30).fill(5);
};

// 提示相关变量
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('error'); // 'error' 或 'success'
const toastTimer = ref(null);

// 显示自定义提示
const showCustomToast = (message, type = 'error') => {
  // 如果已有提示在显示，先清除定时器
  if (toastTimer.value) {
    clearTimeout(toastTimer.value);
  }
  
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  
  // 3秒后自动关闭
  toastTimer.value = setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// 修改提交函数中的录音文件处理部分
const submitVoice = async () => {
  if (!canSubmit.value) {
    if ((activeTab.value === 'record' && !recordedAudioUrl.value) || 
        (activeTab.value === 'upload' && !audioFile.value)) {
      showCustomToast('请录制或上传音频');
    } else if (!voiceName.value.trim()) {
      showCustomToast('请输入声音名称');
    } else if (!agreeTerms.value) {
      showCustomToast('请阅读并同意使用者承诺须知');
    }
    return;
  }

  try {
    // 创建FormData对象
    const formData = new FormData();
    formData.append('name', voiceName.value);
    
    if (activeTab.value === 'record' && audioBlob.value) {
      // 直接使用录制好的WAV格式文件
      const fileName = `recording_${Date.now()}.wav`;
      const recordedFile = new File([audioBlob.value], fileName, { 
        type: 'audio/wav',
        lastModified: Date.now()
      });
      
      console.log(`准备提交录音文件: ${fileName}, 大小: ${recordedFile.size} bytes, 类型: ${recordedFile.type}, 时长: ${recordDuration.value}秒`);
      formData.append('file', recordedFile);
      
    } else if (activeTab.value === 'upload' && audioFile.value) {
      console.log(`准备提交上传文件: ${audioFile.value.name}, 大小: ${audioFile.value.size} bytes, 类型: ${audioFile.value.type}`);
      formData.append('file', audioFile.value);
    }

    // 显示正在提交提示
    showCustomToast('正在提交...', 'info');
    
    // 调用上传声音接口
    const response = await voiceApi.uploadSample(formData);
    
    // 检查响应是否有效
    if (!response) {
      throw new Error('服务器未返回任何数据');
    }
    
    showCustomToast('提交成功', 'success');
    
    // 提交成功后延迟跳转，让用户看到成功提示
    setTimeout(() => {
      // 使用完整的导航对象，并强制重新加载组件
      router.replace({
        path: '/pages/asset/index',
        query: { tab: 'voice' },
        force: true
      });
    }, 1500);
    
  } catch (error) {
    console.error('提交失败:', error);
    // 处理各种错误情况
    let errorMessage = '提交失败，请重试';
    
    // 如果有错误响应数据
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    showCustomToast(errorMessage);
  }
};

// 点击进度条改变播放位置
const seekAudio = (event) => {
  try {
    if (!audioElement.value || !duration.value) return;
    
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const percentage = clickPosition / rect.width;
    
    // 确保百分比在有效范围内
    const validPercentage = Math.max(0, Math.min(percentage, 1));
    
    // 设置新的播放位置
    audioElement.value.currentTime = validPercentage * duration.value;
    
    // 更新进度
    audioProgress.value = validPercentage * 100;
    currentTime.value = validPercentage * duration.value;
  } catch (error) {
    console.error('跳转播放位置错误:', error);
  }
};

// 标签切换处理
const switchTab = (tab) => {
  // 如果正在录音，先停止录音
  if (activeTab.value === 'record' && isRecording.value && tab !== 'record') {
    stopRecording();
  }
  
  // 如果正在播放音频，停止播放
  if (isPlaying.value && audioElement.value) {
    audioElement.value.pause();
    isPlaying.value = false;
  }
  
  // 切换标签
  activeTab.value = tab;
};

// 在组件销毁前释放资源
onBeforeUnmount(() => {
  if (isRecording.value) {
    stopRecording();
  }
  
  if (audioContext.value) {
    audioContext.value.close().catch(console.error);
  }
  
  if (audioProcessor.value) {
    audioProcessor.value.disconnect();
  }
  
  // 清理录制的音频URL
  if (recordedAudioUrl.value) {
    URL.revokeObjectURL(recordedAudioUrl.value);
  }
  
  // 清理上传的音频URL
  if (uploadedAudioUrl.value) {
    URL.revokeObjectURL(uploadedAudioUrl.value);
  }
  
  if (recordTimer.value) {
    clearInterval(recordTimer.value);
  }
  
  // 停止音频播放
  if (audioElement.value && !audioElement.value.paused) {
    audioElement.value.pause();
    audioElement.value.currentTime = 0;
  }
});
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
}

/* 背景装饰元素 */
.page-container::before {
  content: '';
  position: absolute;
  top: -150px;
  right: -150px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(56, 189, 248, 0) 70%);
  filter: blur(50px);
  z-index: 0;
}

.page-container::after {
  content: '';
  position: absolute;
  bottom: -150px;
  left: -150px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0) 70%);
  filter: blur(50px);
  z-index: 0;
}

/* 添加浮动粒子效果 */
@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

@keyframes float2 {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(20px) rotate(-5deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

.app-content-wrapper {
  position: relative;
  padding: 0 2px 2px;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 85px);
  overflow-y: auto;
}

.app-content-wrapper::before {
  content: '';
  position: absolute;
  top: 10%;
  right: 10%;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(244, 114, 182, 0.15) 0%, rgba(244, 114, 182, 0) 70%);
  border-radius: 50%;
  filter: blur(30px);
  animation: float 8s ease-in-out infinite;
  z-index: -1;
}

.app-content-wrapper::after {
  content: '';
  position: absolute;
  bottom: 15%;
  left: 15%;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, rgba(34, 211, 238, 0) 70%);
  border-radius: 50%;
  filter: blur(40px);
  animation: float2 10s ease-in-out infinite;
  z-index: -1;
}

.app-content {
  width: 100%;
  max-width: 500px;
  background: rgba(30, 41, 59, 0.75);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 4px 15px 25px;
  box-shadow: 0 15px 20px -5px rgba(0, 0, 0, 0.15), 0 8px 8px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  margin-bottom: 0;
}

.app-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #38bdf8, #8b5cf6);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  padding-top: calc(12px + env(safe-area-inset-top, 0px));
  position: relative;
  z-index: 10;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.back-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  transition: all 0.3s ease;
}

.back-button:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.2);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}

.tabs {
  display: flex;
  margin: 0 -4px 18px -4px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.6);
  padding: 3px;
  position: relative;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  position: relative;
  border-radius: 11px;
  transition: all 0.3s ease;
  
  &.active {
    color: #fff;
    background: rgba(56, 189, 248, 0.25);
    box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 2px 3px -1px rgba(0, 0, 0, 0.05);
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 25%;
      width: 50%;
      height: 2px;
      background: linear-gradient(90deg, #38bdf8, #8b5cf6);
      border-radius: 2px 2px 0 0;
    }
  }
}

.tab-content {
  padding: 0;
  margin-bottom: 18px;
}

/* 增加上传界面的顶部间距，让名称输入框和上传框有更多分隔 */
.tab-content[v-if="activeTab === 'upload'"], .upload-tab-content {
  margin-top: 30px; /* 从20px增加到30px，大幅增加间距 */
}

/* 使用这种选择器也能生效，保留之前的尝试 */
.upload-tab-content {
  padding-top: 10px; /* 从5px增加到10px，增加额外内边距 */
}

.record-status {
  text-align: center;
  margin-bottom: 15px;
}

.status-text {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #38bdf8;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.time-counter {
  font-size: 24px;
  font-weight: 700;
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  letter-spacing: 1.5px;
}

.waveform-container {
  height: 110px;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.15);
}

.waveform {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  height: 100%;
  padding: 0 20px;
}

.wave-bar {
  width: 4px;
  background: linear-gradient(to top, #38bdf8, #8b5cf6);
  border-radius: 2px;
  transition: height 0.2s ease;
}

.empty-waveform {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.empty-text {
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
}

.audio-player {
  width: 100%;
  height: 45px;
  margin: 8px 0;
}

.record-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 18px;
}

.record-btn {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: rgba(56, 189, 248, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  box-shadow: 0 8px 12px -3px rgba(0, 0, 0, 0.15), 0 3px 5px -2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
  }
  
  &.recording {
    animation: pulse 1.5s infinite;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(56, 189, 248, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(56, 189, 248, 0);
  }
}

.record-btn-inner {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #38bdf8, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.record-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
}

.stop-icon {
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 2px;
}

.record-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
}

.record-tips, .upload-tips {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tip-title-icon {
  margin-bottom: 8px;
  color: #38bdf8;
}

.tip-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #fff;
  text-align: center;
}

.tip-content {
  color: rgba(255, 255, 255, 0.75);
  width: 100%;
}

.tip-item {
  margin-bottom: 6px;
  font-size: 13px;
  line-height: 1.5;
  position: relative;
  padding-left: 16px;
  text-align: left;
  
  &:before {
    content: '●';
    position: absolute;
    left: 0;
    top: 0;
    color: #38bdf8;
    font-size: 13px;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.upload-container {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  overflow: hidden;

  margin-bottom: 18px;
  box-shadow: 0 8px 16px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.upload-container:active {
  transform: scale(0.98);
  border-color: rgba(56, 189, 248, 0.8);
  box-shadow: 0 4px 8px -1px rgba(0, 0, 0, 0.2);
}

.upload-inner {
  padding: 25px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(139, 92, 246, 0.08));
  min-height: 140px;
  position: relative;
  overflow: hidden;
}

.upload-inner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #38bdf8, #8b5cf6);
  box-shadow: 0 0 8px 2px rgba(56, 189, 248, 0.3);
}

.upload-icon {
  margin-bottom: 16px;
  color: #38bdf8;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  animation: float 6s ease-in-out infinite;
  transform: scale(1.1);
}

.upload-text {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #38bdf8;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.5px;
}

.upload-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  text-align: center;
  max-width: 85%;
}

.audio-preview {
  padding: 15px;
  background: rgba(15, 23, 42, 0.75);
}

.file-info {
  margin-bottom: 10px;
}

.file-size {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
}

.file-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.file-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  color: #fff;
  font-size: 13px;
  
  svg {
    margin-right: 4px;
    width: 16px;
    height: 16px;
  }
  
  &.delete {
    background: rgba(244, 63, 94, 0.15);
    color: #f43f5e;
    
    &:active {
      background: rgba(244, 63, 94, 0.25);
    }
  }
  
  &:active {
    transform: scale(0.95);
  }
}

/* 顶部声音名称输入样式 */
.name-input-container {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.input-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #38bdf8;
  display: flex;
  align-items: center;
  
  &:before {
    content: '';
    display: inline-block;
    width: 7px;
    height: 7px;
    background: linear-gradient(135deg, #38bdf8, #8b5cf6);
    border-radius: 50%;
    margin-right: 6px;
  }
}

.name-input {
  width: 95%;
  padding: 10px;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(56, 189, 248, 0.15);
  border-radius: 10px;
  color: #fff;
  font-size: 15px;
  transition: all 0.3s ease;
  outline: none;
  
  &:focus {
    border-color: rgba(56, 189, 248, 0.4);
    box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.15);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }
}

/* 顶部声音名称输入框样式特殊处理 */
.top-name-input {
  margin-bottom: 25px; /* 从18px增加到25px */
  padding: 0px;
  position: relative;
}

/* 添加视觉分隔线增强区分 */
.top-name-input:after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 10%;
  width: 80%;
  height: 1px;
}

.top-name-input .input-label {
  margin-bottom: 6px;
  font-size: 13px;
}

.top-name-input .name-input {
  padding: 8px;
}

.agreement-section {
  padding: 12px 15px;
  display: flex;
  align-items: center;
  background: rgba(15, 23, 42, 0.75);
  border-radius: 12px;
  margin-bottom: 22px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.agreement-checkbox {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1.5px solid rgba(56, 189, 248, 0.5);
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
  background: rgba(56, 189, 248, 0.1);
  box-shadow: 0 0 8px rgba(56, 189, 248, 0.2);
  
  &.checked {
    background: linear-gradient(135deg, #38bdf8, #8b5cf6);
    border-color: transparent;
    box-shadow: 0 1px 3px rgba(56, 189, 248, 0.25);
  }
}

.checkbox-inner {
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 2px;
}

.agreement-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.4;
}

.agreement-link {
  color: #38bdf8;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-shadow: 0 0 5px rgba(56, 189, 248, 0.3);
}

/* 协议弹窗样式 */
.agreement-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
  backdrop-filter: blur(5px);
}

.modal-content {
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  background: rgba(15, 23, 42, 0.95);
  border-radius: 15px;
  padding: 20px;
  overflow-y: auto;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(56, 189, 248, 0.2);
  position: relative;
}

.modal-header {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.agreement-content {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.6;
}

.agreement-section {
  margin-bottom: 15px;
}

.agreement-section-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: #38bdf8;
}

.confirm-btn {
  background: linear-gradient(135deg, #38bdf8, #8b5cf6);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: block;
  margin: 20px auto 0;
  width: 50%;
  text-align: center;
}

.submit-button-container {
  display: flex;
  justify-content: center;
  margin-top: 22px;
  margin-bottom: 0;
}

.submit-button {
  width: 60%;
  max-width: 260px;
  padding: 12px;
  background: linear-gradient(135deg, #38bdf8, #8b5cf6);
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  color: #fff;
  box-shadow: 0 7px 13px rgba(56, 189, 248, 0.18);
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.4px;
  
  &:active:not(.disabled) {
    transform: translateY(1px) scale(0.98);
    box-shadow: 0 3px 7px rgba(56, 189, 248, 0.12);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.22), transparent);
    animation: shine 2.5s infinite 0.5s;
  }
  
  &.disabled {
    opacity: 0.6;
    background: linear-gradient(135deg, #525c6b, #3f4a59);
    box-shadow: none;
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

/* Adjustments for smaller screens to further reduce height */
@media (max-height: 700px) {
  .app-content-wrapper {
    padding-top: 5px;
    padding-bottom: 5px;
    align-items: flex-start;
  }
  .app-content {
    padding: 10px 12px 20px;
  }
  .waveform-container {
    height: 100px;
  }
  .upload-inner {
    min-height: 130px;
    padding: 20px 8px;
  }
  .tab-item {
    padding: 7px 0;
    font-size: 13px;
  }
   .record-tips, .upload-tips, .name-input-container, .agreement-section {
    padding: 8px;
    margin-bottom: 10px;
  }
  .tip-item {
    font-size: 11px;
    padding-left: 14px;
    &:before { font-size: 11px; }
  }
  .submit-button-container {
    margin-top: 15px;
  }
  .audio-player {
    height: 35px;
  }
  .name-input-container {
    padding: 10px;
    margin-bottom: 15px;
  }
  .name-input-container .input-label {
    margin-bottom: 5px;
  }
  .tabs {
    margin-bottom: 15px;
  }
  .tab-content {
    margin-bottom: 15px;
  }
  .waveform-container {
    height: 100px;
    margin-bottom: 15px;
  }
  .record-controls, .record-tips, .upload-tips, .upload-container {
    margin-bottom: 15px;
  }
}

@media (max-height: 640px) {
  .app-content {
    padding: 8px 10px 15px;
  }
  .tabs {
    margin-bottom: 10px;
  }
  .waveform-container {
    height: 90px;
  }
  .record-controls, .upload-container, .name-input-container, .agreement-section, .record-tips, .upload-tips {
    margin-bottom: 10px;
  }
  .record-btn {
    width: 50px;
    height: 50px;
  }
  .record-btn-inner {
    width: 40px;
    height: 40px;
  }
  .upload-inner {
    min-height: 110px;
  }
  .status-text {
    font-size: 13px;
  }
  .time-counter {
    font-size: 20px;
  }
  .tip-title {
    font-size: 14px;
  }
  .submit-button-container {
    margin-top: 10px;
  }
   .submit-button {
    padding: 8px;
    font-size: 14px;
  }
  .name-input-container {
    padding: 8px;
    margin-bottom: 10px;
  }
  .name-input-container .input-label {
    margin-bottom: 4px;
  }
}

/* 自定义音频播放器样式 - 添加更具体的作用域 */
.page-container .custom-audio-player {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  background: rgba(15, 23, 42, 0.75);
  border-radius: 10px;
  margin: 5px 0;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-sizing: border-box;
}

.page-container .play-button {
  width: 36px;
  height: 36px;
  min-width: 36px; /* 确保不会被压缩 */
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.4), rgba(139, 92, 246, 0.4));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  color: white;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-container .play-button:active {
  transform: scale(0.95);
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.6), rgba(139, 92, 246, 0.6));
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
}

.page-container .progress-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
  width: calc(100% - 46px); /* 减去按钮宽度和边距 */
  overflow: hidden;
}

.page-container .progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.page-container .progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #8b5cf6);
  border-radius: 2px;
  transition: width 0.1s linear;
}

.page-container .time-display {
  font-size: 11px;
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
  padding-right: 2px;
  white-space: nowrap;
}

.page-container .hidden-audio {
  display: none;
}

/* 修改波形容器和上传预览样式，适配新播放器 */
.page-container .waveform-container .custom-audio-player {
  width: calc(100% - 16px);
  margin: 0 8px;
}

.page-container .audio-preview {
  padding: 12px;
  background: rgba(15, 23, 42, 0.75);
}

/* 添加已上传内容的样式 */
.page-container .uploaded-content {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  margin-bottom: 18px;
  padding: 0px;
  box-shadow: 0 8px 16px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.page-container .uploaded-content .file-info {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.page-container .file-size {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  background: rgba(0, 0, 0, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
}

/* 自定义提示组件样式 */
.custom-toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 200px;
  max-width: 80%;
  background: rgba(15, 23, 42, 0.95);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: toast-in 0.3s ease-out forwards;
}

.custom-toast.error {
  border-left: 4px solid #f43f5e;
}

.custom-toast.success {
  border-left: 4px solid #10b981;
}

.toast-icon {
  margin-right: 12px;
  flex-shrink: 0;
}

.custom-toast.error .toast-icon {
  color: #f43f5e;
}

.custom-toast.success .toast-icon {
  color: #10b981;
}

.toast-message {
  font-size: 14px;
  color: #fff;
  line-height: 1.4;
}

@keyframes toast-in {
  0% {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
</style> 