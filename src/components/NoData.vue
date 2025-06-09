<template>
  <view class="no-data-container">
    <view class="no-data-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
        <path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
      </svg>
    </view>
    <view class="no-data-text">{{ message }}</view>
    <view class="no-data-subtext" v-if="subMessage">{{ subMessage }}</view>
    <view class="no-data-action" v-if="showAction" @click="$emit('action')">
      <slot name="action">
        <view class="action-button">
          {{ actionText }}
        </view>
      </slot>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// 定义组件属性
const props = defineProps({
  message: {
    type: String,
    default: '暂无数据'
  },
  subMessage: {
    type: String,
    default: ''
  },
  showAction: {
    type: Boolean,
    default: false
  },
  actionText: {
    type: String,
    default: '立即创建'
  }
});

// 定义事件
defineEmits(['action']);
</script>

<style lang="scss" scoped>
.no-data-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.no-data-icon {
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.3);
  
  svg {
    fill: currentColor;
  }
}

.no-data-text {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  text-align: center;
}

.no-data-subtext {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  margin-bottom: 20px;
}

.no-data-action {
  margin-top: 20px;
}

.action-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #35c8a9, #2fa8e0);
  border-radius: 20px;
  color: #fff;
  font-weight: 500;
  font-size: 14px;
}
</style> 