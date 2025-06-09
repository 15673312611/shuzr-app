<template>
  <view class="btn-wrapper" :class="[`size-${size}`, { 'full-width': fullWidth }]">
    <button 
      class="custom-btn" 
      :class="[
        type, 
        { 'btn-loading': loading, 'btn-disabled': disabled }
      ]"
      @click="handleClick"
    >
      <text v-if="!loading">{{ text }}</text>
      <view v-else class="loading-spinner"></view>
    </button>
    <view class="btn-glow" :class="type"></view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: '确认'
  },
  type: {
    type: String,
    default: 'primary', // primary, secondary, danger, ghost
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['click']);

const handleClick = (e) => {
  if (!props.loading && !props.disabled) {
    emit('click', e);
  }
};
</script>

<style lang="scss" scoped>
.btn-wrapper {
  position: relative;
  display: inline-block;
  
  &.full-width {
    width: 100%;
    display: block;
  }
  
  &.size-small {
    .custom-btn {
      height: 36px;
      font-size: 14px;
      border-radius: 18px;
      padding: 0 16px;
    }
  }
  
  &.size-medium {
    .custom-btn {
      height: 44px;
      font-size: 15px;
      border-radius: 22px;
      padding: 0 20px;
    }
  }
  
  &.size-large {
    .custom-btn {
      height: 52px;
      font-size: 16px;
      border-radius: 26px;
      padding: 0 24px;
    }
  }
  
  .custom-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    font-weight: 600;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    position: relative;
    z-index: 2;
    
    &:active:not(.btn-disabled) {
      transform: scale(0.98);
      opacity: 0.9;
    }
    
    &.primary {
      background: linear-gradient(135deg, #4a90e2 0%, #5637d7 100%);
      color: #ffffff;
      
      &:active {
        background: linear-gradient(135deg, #4186d2 0%, #502dc7 100%);
      }
    }
    
    &.secondary {
      background: linear-gradient(135deg, #00ffaa 0%, #00b3ff 100%);
      color: #000000;
      
      &:active {
        background: linear-gradient(135deg, #00e69a 0%, #00a1e6 100%);
      }
    }
    
    &.danger {
      background: linear-gradient(135deg, #ff6b6b 0%, #d63031 100%);
      color: #ffffff;
      
      &:active {
        background: linear-gradient(135deg, #e66060 0%, #c12b2c 100%);
      }
    }
    
    &.ghost {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: rgba(255, 255, 255, 0.9);
      
      &:active {
        background: rgba(255, 255, 255, 0.05);
      }
    }
    
    &.btn-loading {
      opacity: 0.8;
      pointer-events: none;
    }
    
    &.btn-disabled {
      opacity: 0.5;
      pointer-events: none;
      filter: grayscale(40%);
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
    border-radius: inherit;
    opacity: 0.25;
    filter: blur(8px);
    z-index: 1;
    transition: all 0.3s ease;
    
    &.primary {
      background: linear-gradient(135deg, #4a90e2 0%, #5637d7 100%);
    }
    
    &.secondary {
      background: linear-gradient(135deg, #00ffaa 0%, #00b3ff 100%);
    }
    
    &.danger {
      background: linear-gradient(135deg, #ff6b6b 0%, #d63031 100%);
    }
    
    &.ghost {
      display: none;
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式适配 */
@media screen and (max-width: 375px) {
  .btn-wrapper {
    &.size-medium {
      .custom-btn {
        height: 40px;
        font-size: 14px;
      }
    }
    
    &.size-large {
      .custom-btn {
        height: 48px;
        font-size: 15px;
      }
    }
  }
}

@media screen and (min-width: 429px) {
  .btn-wrapper {
    &.size-medium {
      .custom-btn {
        height: 46px;
      }
    }
    
    &.size-large {
      .custom-btn {
        height: 56px;
        font-size: 17px;
      }
    }
  }
}
</style> 