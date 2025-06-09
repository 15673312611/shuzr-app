<template>
  <view class="create-page-container">
    <!-- 顶部栏 -->
    <view class="header-bar">
      <view class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="#AEB8D6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </view>
      <text class="header-title">创建新作品</text>
    </view>

    <!-- 输入视频名称 -->
    <input class="input-title" v-model="videoName" maxlength="30" placeholder="请输入视频名称" />

    <!-- 视频列表横滑卡片 -->
    <view class="video-list-scroll">
      <scroll-view scroll-x class="video-scroll-view">
        <view class="video-card-list">
          <view
            v-for="video in videos"
            :key="video.id"
            class="video-card"
            :class="{ selected: selectedVideo && selectedVideo.id === video.id }"
            @click="selectVideo(video)"
          >
            <image :src="video.coverUrl" class="video-thumb" mode="aspectFill" />
            <view class="video-info">
              <text class="video-title">{{ video.title }}</text>
              <text class="video-duration">{{ formatDuration(video.duration) }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 配音Tab切换 -->
    <view class="tab-bar">
      <view
        class="tab-item"
        :class="{ active: tab === 'synth' }"
        @click="tab = 'synth'"
      >合成配音</view>
      <view
        class="tab-item"
        :class="{ active: tab === 'upload' }"
        @click="tab = 'upload'"
      >上传配音</view>
    </view>

    <!-- 合成配音区域 -->
    <view v-if="tab === 'synth'" class="synth-area">
      <textarea
        class="synth-textarea"
        v-model="synthText"
        maxlength="450"
        placeholder="请输入文案"
      />
      <view class="synth-bottom-bar">
        <view class="synth-btn" @click="chooseVoice">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 9v6h4l5 5V4L7 9H3z" stroke="#AEB8D6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <text>选择音色</text>
        </view>
        <text class="synth-count">{{ synthText.length }}/450</text>
        <view class="synth-btn" @click="writeText">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke="#AEB8D6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.5 3.5a2.121 2.121 0 113 3L7 19.5 3 21l1.5-4L16.5 3.5z" stroke="#AEB8D6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <text>写文案</text>
        </view>
      </view>
    </view>

    <!-- 上传配音区域 -->
    <view v-else class="upload-area">
      <view class="upload-btn" @click="uploadAudio">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#6f4cff" fill-opacity="0.15"/><path d="M12 8v8m0 0l-4-4m4 4l4-4" stroke="#6f4cff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <text>上传音频</text>
      </view>
      <view v-if="audioFile" class="audio-preview">
        <text>{{ audioFile.name }}</text>
        <view class="audio-delete" @click="removeAudio">删除</view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="footer-bar">
      <button class="create-btn" :disabled="!canCreate" @click="createWork">立即创建</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from '@/utils/toast'
import { videoApi } from '@/api/services'

const router = useRouter()

const videoName = ref('')
const videos = ref([])
const selectedVideo = ref(null)
const tab = ref('synth')
const synthText = ref('')
const audioFile = ref(null)

const canCreate = computed(() => {
  return videoName.value && selectedVideo.value && ((tab.value === 'synth' && synthText.value) || (tab.value === 'upload' && audioFile.value))
})

function goBack() {
  router.back()
}

function selectVideo(video) {
  selectedVideo.value = video
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function chooseVoice() {
  showToast('选择音色功能')
}

function writeText() {
  showToast('AI写文案功能')
}

function uploadAudio() {
  showToast('上传音频功能')
}

function removeAudio() {
  audioFile.value = null
}

function createWork() {
  showToast('创建成功！')
}

onMounted(async () => {
  // 获取视频列表
  const res = await videoApi.getMyList()
  if (Array.isArray(res)) {
    videos.value = res
    if (res.length) selectedVideo.value = res[0]
  }
})
</script>

<style lang="scss" scoped>
.create-page-container {
  min-height: 100vh;
  background: #10182a;
  padding: 0 0 24px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header-bar {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 24px 0 16px 0;
  justify-content: center;
  position: relative;
  .back-btn {
    position: absolute;
    left: 16px;
    top: 24px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
    cursor: pointer;
    &:active { background: rgba(111,76,255,0.12); }
  }
  .header-title {
    font-size: 20px;
    font-weight: 600;
    background: linear-gradient(90deg, #6f4cff, #2f70ed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 1px;
  }
}
.input-title {
  width: 90%;
  margin: 0 auto 18px auto;
  height: 44px;
  border-radius: 12px;
  background: #181f32;
  border: none;
  outline: none;
  color: #fff;
  font-size: 16px;
  padding: 0 16px;
  margin-bottom: 18px;
  box-sizing: border-box;
  &::placeholder { color: #4e5a7f; }
}
.video-list-scroll {
  width: 90%;
  margin: 0 auto 18px auto;
  .video-scroll-view {
    width: 100%;
    overflow-x: auto;
    .video-card-list {
      display: flex;
      flex-direction: row;
      gap: 16px;
      padding: 8px 0;
      .video-card {
        min-width: 120px;
        max-width: 140px;
        background: #181f32;
        border-radius: 16px;
        box-shadow: 0 2px 8px rgba(111,76,255,0.08);
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        border: 2px solid transparent;
        transition: border 0.2s;
        &.selected {
          border: 2px solid #6f4cff;
          box-shadow: 0 0 0 2px #6f4cff33;
        }
        .video-thumb {
          width: 100%;
          height: 80px;
          border-radius: 14px 14px 0 0;
          object-fit: cover;
        }
        .video-info {
          width: 100%;
          padding: 8px 8px 10px 8px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .video-title {
            font-size: 14px;
            color: #fff;
            font-weight: 500;
            margin-bottom: 4px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .video-duration {
            font-size: 12px;
            color: #6f4cff;
          }
        }
      }
    }
  }
}
.tab-bar {
  width: 90%;
  margin: 0 auto 18px auto;
  display: flex;
  background: #181f32;
  border-radius: 12px;
  overflow: hidden;
  .tab-item {
    flex: 1;
    text-align: center;
    padding: 12px 0;
    font-size: 15px;
    color: #aeb8d6;
    font-weight: 500;
    cursor: pointer;
    background: none;
    transition: background 0.2s, color 0.2s;
    &.active {
      background: linear-gradient(90deg, #6f4cff, #2f70ed);
      color: #fff;
      font-weight: 600;
    }
  }
}
.synth-area {
  width: 90%;
  margin: 0 auto 18px auto;
  background: #181f32;
  border-radius: 16px;
  padding: 16px 12px 12px 12px;
  box-sizing: border-box;
  .synth-textarea {
    width: 100%;
    min-height: 90px;
    background: #10182a;
    border-radius: 10px;
    border: none;
    color: #fff;
    font-size: 15px;
    padding: 10px 12px;
    margin-bottom: 12px;
    resize: none;
    outline: none;
    &::placeholder { color: #4e5a7f; }
  }
  .synth-bottom-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .synth-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      background: linear-gradient(90deg, #6f4cff, #2f70ed);
      color: #fff;
      border-radius: 8px;
      padding: 6px 14px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      svg { margin-right: 2px; }
      &:active { opacity: 0.85; }
    }
    .synth-count {
      color: #6f4cff;
      font-size: 13px;
      margin: 0 8px;
    }
  }
}
.upload-area {
  width: 90%;
  margin: 0 auto 18px auto;
  background: #181f32;
  border-radius: 16px;
  padding: 24px 0 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  .upload-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(111,76,255,0.08);
    border-radius: 12px;
    padding: 18px 32px;
    color: #6f4cff;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    svg { margin-bottom: 6px; }
    &:active { background: rgba(111,76,255,0.15); }
  }
  .audio-preview {
    margin-top: 12px;
    color: #fff;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    .audio-delete {
      color: #f36c6c;
      cursor: pointer;
      font-size: 13px;
      &:active { opacity: 0.7; }
    }
  }
}
.footer-bar {
  width: 90%;
  margin: 24px auto 0 auto;
  .create-btn {
    width: 100%;
    height: 48px;
    border-radius: 24px;
    background: linear-gradient(90deg, #6f4cff, #2f70ed);
    color: #fff;
    font-size: 17px;
    font-weight: 600;
    border: none;
    outline: none;
    cursor: pointer;
    transition: opacity 0.2s;
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    &:active { opacity: 0.85; }
  }
}
</style> 