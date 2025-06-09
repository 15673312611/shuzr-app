<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <u-search
        v-model="searchKeyword"
        placeholder="搜索形象"
        :show-action="false"
        @search="handleSearch"
      ></u-search>
    </view>

    <!-- 分类标签 -->
    <scroll-view scroll-x class="category-list">
      <!-- 性别分类 -->
      <view class="gender-section">
        <view 
          class="gender-item"
          v-for="item in genderOptions"
          :key="item.value"
          :class="{ active: selectedGender === item.value }"
          @click="handleSelectGender(item.value)"
        >
          <u-icon :name="item.icon" size="32" :color="selectedGender === item.value ? '#ffffff' : '#666666'"></u-icon>
          <text>{{ item.label }}</text>
        </view>
      </view>
      
      <!-- 分类列表 -->
      <view 
        class="category-item"
        v-for="item in categories"
        :key="item.id"
        :class="{ active: selectedCategory?.id === item.id }"
        @click="handleSelectCategory(item.id)"
      >
        <text>{{ item.name }}</text>
      </view>
    </scroll-view>

    <!-- 形象列表 -->
    <scroll-view 
      scroll-y 
      class="asset-list"
      @scrolltolower="handleLoadMore"
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="handleRefresh"
    >
      <view 
        class="asset-item"
        v-for="item in assetList"
        :key="item.id"
        @click="handleViewDetail(item)"
      >
        <view class="asset-cover">
          <image class="cover-image" :src="item.coverUrl" mode="aspectFill" />
          <view class="play-button" @click.stop="handlePlayVideo(item)">
            <u-icon name="play-right-fill" color="#ffffff" size="48"></u-icon>
          </view>
        </view>
        <view class="asset-info">
          <text class="asset-name">{{ item.name }}</text>
          <text class="asset-desc">{{ item.description }}</text>
          <view class="asset-meta">
            <view class="asset-price">
              <text class="price-label">价格：</text>
              <text class="price-value">{{ item.price }}元</text>
            </view>
            <view class="asset-sales">
              <text>已售 {{ item.sales }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view class="loading-more" v-if="hasMore">
        <u-loading-icon size="24"></u-loading-icon>
        <text>加载中...</text>
      </view>
      <view class="no-more" v-else>
        <text>没有更多了</text>
      </view>
    </scroll-view>

    <!-- 资产详情弹窗 -->
    <u-popup :show="showDetail" mode="bottom" @close="handleCloseDetail">
      <view class="detail-popup">
        <view class="detail-header">
          <text class="detail-title">形象详情</text>
          <u-icon name="close" size="24" @click="handleCloseDetail"></u-icon>
        </view>
        
        <scroll-view scroll-y class="detail-content">
          <view class="detail-video">
            <video 
              v-if="selectedAsset?.videoUrl"
              :src="selectedAsset.videoUrl"
              class="video-player"
              :controls="true"
              :autoplay="true"
            ></video>
            <image 
              v-else
              class="detail-cover" 
              :src="selectedAsset?.coverUrl" 
              mode="aspectFill"
            />
          </view>
          
          <view class="detail-info">
            <text class="detail-name">{{ selectedAsset?.name }}</text>
            <text class="detail-desc">{{ selectedAsset?.description }}</text>
            
            <view class="detail-stats">
              <view class="stat-item">
                <text class="stat-label">销量</text>
                <text class="stat-value">{{ selectedAsset?.sales }}</text>
              </view>
              <view class="stat-item">
                <text class="stat-label">好评率</text>
                <text class="stat-value">{{ selectedAsset?.rating }}%</text>
              </view>
              <view class="stat-item">
                <text class="stat-label">分享数</text>
                <text class="stat-value">{{ selectedAsset?.shares }}</text>
              </view>
            </view>
            
            <view class="detail-features">
              <text class="features-title">功能特点</text>
              <view class="feature-list">
                <text 
                  class="feature-item"
                  v-for="(feature, index) in selectedAsset?.features"
                  :key="index"
                >{{ feature }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
        
        <view class="detail-actions">
          <view class="action-price">
            <text class="price-symbol">¥</text>
            <text class="price-value">{{ selectedAsset?.price }}</text>
          </view>
          <view class="action-buttons">
            <u-button 
              type="info" 
              icon="share" 
              text="分享" 
              @click="handleShare"
            ></u-button>
            <u-button 
              type="primary" 
              icon="shopping-cart" 
              text="立即购买" 
              @click="handlePurchase"
            ></u-button>
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 分享弹窗 -->
    <u-popup :show="showShare" mode="bottom" @close="handleCloseShare">
      <view class="share-popup">
        <view class="share-header">
          <text>分享方式</text>
        </view>
        <view class="share-options">
          <view class="share-item" @click="handleShareToWechat">
            <u-icon name="weixin-fill" size="48" color="#07c160"></u-icon>
            <text>微信</text>
          </view>
          <view class="share-item" @click="handleShareToMoments">
            <u-icon name="moments" size="48" color="#07c160"></u-icon>
            <text>朋友圈</text>
          </view>
          <view class="share-item" @click="handleCopyLink">
            <u-icon name="link" size="48" color="#666666"></u-icon>
            <text>复制链接</text>
          </view>
        </view>
        <view class="share-cancel" @click="handleCloseShare">
          <text>取消</text>
        </view>
      </view>
    </u-popup>

    <!-- 视频预览弹窗 -->
    <u-popup :show="showVideo" mode="center" @close="handleCloseVideo">
      <view class="video-popup">
        <video 
          v-if="currentVideoUrl"
          :src="currentVideoUrl"
          class="video-player"
          :controls="true"
          :autoplay="true"
          @ended="handleVideoEnded"
        ></video>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { assetApi } from '@/api/services'
import { request } from '@/utils/request'

// 性别选项
const genderOptions = [
  { label: '全部', value: null, icon: 'star' },
  { label: '男性', value: 1, icon: 'man' },
  { label: '女性', value: 2, icon: 'woman' }
]

// 分类数据
const categories = ref([])

const searchKeyword = ref('')
const selectedCategory = ref(null)
const selectedGender = ref(null)
const assetList = ref([])
const page = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)
const refreshing = ref(false)
const showDetail = ref(false)
const showShare = ref(false)
const selectedAsset = ref(null)

// 视频预览相关
const showVideo = ref(false)
const currentVideoUrl = ref('')

// 获取分类列表
const fetchCategories = async () => {
  try {
    const res = await request.get('/api/template/categories')
    categories.value = [
      { id: 0, name: '全部' },
      ...res.data
    ]
  } catch (error) {
    uni.showToast({
      title: error.message || '获取分类失败',
      icon: 'none'
    })
  }
}

// 加载资产列表
const loadAssetList = async (isRefresh = false) => {
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
      categoryId: selectedCategory.value?.id,
      gender: selectedGender.value
    }
    
    const res = await request.get('/api/template/list', { params })
    const list = res.data || []
    
    if (isRefresh) {
      assetList.value = list
    } else {
      assetList.value.push(...list)
    }
    
    hasMore.value = assetList.value.length < (res.total || 0)
  } catch (error) {
    uni.showToast({
      title: error.message || '加载失败',
      icon: 'none'
    })
  }
}

// 搜索
const handleSearch = () => {
  page.value = 1
  loadAssetList(true)
}

// 选择分类
const handleSelectCategory = (categoryId) => {
  if (categoryId === 0) {
    // 点击"全部"按钮时，清除所有选择
    selectedCategory.value = null
    selectedGender.value = null
  } else if (selectedCategory.value?.id === categoryId) {
    // 点击已选中的分类时，取消选择
    selectedCategory.value = null
  } else {
    // 选择新的分类
    selectedCategory.value = categories.value.find(c => c.id === categoryId)
    selectedGender.value = null
  }
  page.value = 1
  loadAssetList(true)
}

// 选择性别
const handleSelectGender = (gender) => {
  selectedGender.value = gender
  selectedCategory.value = null
  page.value = 1
  loadAssetList(true)
}

// 加载更多
const handleLoadMore = () => {
  if (hasMore.value) {
    page.value++
    loadAssetList()
  }
}

// 下拉刷新
const handleRefresh = async () => {
  refreshing.value = true
  page.value = 1
  await loadAssetList(true)
  refreshing.value = false
}

// 查看详情
const handleViewDetail = (asset) => {
  selectedAsset.value = asset
  showDetail.value = true
}

// 关闭详情
const handleCloseDetail = () => {
  showDetail.value = false
  selectedAsset.value = null
}

// 购买资产
const handlePurchase = async () => {
  try {
    await request.post(`/api/template/purchase/${selectedAsset.value.id}`)
    uni.showToast({
      title: '购买成功',
      icon: 'success'
    })
    handleCloseDetail()
  } catch (error) {
    uni.showToast({
      title: error.message || '购买失败',
      icon: 'none'
    })
  }
}

// 分享资产
const handleShare = () => {
  showShare.value = true
}

// 关闭分享
const handleCloseShare = () => {
  showShare.value = false
}

// 分享到微信
const handleShareToWechat = () => {
  // 调用微信分享API
  handleCloseShare()
}

// 分享到朋友圈
const handleShareToMoments = () => {
  // 调用朋友圈分享API
  handleCloseShare()
}

// 复制链接
const handleCopyLink = () => {
  uni.setClipboardData({
    data: `https://example.com/template/${selectedAsset.value.id}`,
    success: () => {
      uni.showToast({
        title: '链接已复制',
        icon: 'success'
      })
      handleCloseShare()
    }
  })
}

// 播放视频
const handlePlayVideo = (asset) => {
  if (asset.videoUrl) {
    currentVideoUrl.value = asset.videoUrl
    showVideo.value = true
  }
}

// 关闭视频
const handleCloseVideo = () => {
  showVideo.value = false
  currentVideoUrl.value = ''
}

// 视频播放结束
const handleVideoEnded = () => {
  handleCloseVideo()
}

// 页面加载
onMounted(() => {
  fetchCategories()
  loadAssetList()
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #000000;
}

.search-bar {
  padding: 20rpx;
}

.category-list {
  white-space: nowrap;
  padding: 0 20rpx;
  margin-bottom: 20rpx;
  
  .gender-section {
    display: inline-flex;
    margin-right: 30rpx;
    padding-right: 30rpx;
    border-right: 2rpx solid rgba(255, 255, 255, 0.1);
    
    .gender-item {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      padding: 16rpx 24rpx;
      margin-right: 16rpx;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16rpx;
      
      &.active {
        background: #35c8a9;
      }
      
      text {
        font-size: 24rpx;
        color: #ffffff;
        margin-top: 8rpx;
      }
    }
  }
  
  .category-item {
    display: inline-block;
    padding: 12rpx 30rpx;
    margin-right: 16rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 30rpx;
    
    &.active {
      background: #35c8a9;
    }
    
    text {
      font-size: 28rpx;
      color: #ffffff;
    }
  }
}

.asset-list {
  height: calc(100vh - 180rpx);
  padding: 0 20rpx;
  
  .asset-item {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    
    .asset-cover {
      position: relative;
      width: 100%;
      height: 300rpx;
      
      .cover-image {
        width: 100%;
        height: 100%;
      }
      
      .play-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 96rpx;
        height: 96rpx;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    
    .asset-info {
      padding: 20rpx;
      
      .asset-name {
        font-size: 32rpx;
        color: #ffffff;
        font-weight: bold;
        margin-bottom: 10rpx;
      }
      
      .asset-desc {
        font-size: 28rpx;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 20rpx;
      }
      
      .asset-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .asset-price {
          .price-label {
            font-size: 24rpx;
            color: rgba(255, 255, 255, 0.6);
          }
          
          .price-value {
            font-size: 32rpx;
            color: #35c8a9;
            font-weight: bold;
          }
        }
        
        .asset-sales {
          font-size: 24rpx;
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
}

.loading-more,
.no-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx 0;
  
  text {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.6);
    margin-left: 10rpx;
  }
}

.detail-popup {
  background: #ffffff;
  border-radius: 24rpx 24rpx 0 0;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  
  .detail-header {
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2rpx solid #f5f5f5;
    
    .detail-title {
      font-size: 32rpx;
      color: #333333;
      font-weight: bold;
    }
  }
  
  .detail-content {
    flex: 1;
    
    .detail-video {
      width: 100%;
      height: 400rpx;
      background: #000000;
      
      .video-player {
        width: 100%;
        height: 100%;
      }
      
      .detail-cover {
        width: 100%;
        height: 100%;
      }
    }
    
    .detail-info {
      padding: 30rpx;
      
      .detail-name {
        font-size: 36rpx;
        color: #333333;
        font-weight: bold;
        margin-bottom: 16rpx;
      }
      
      .detail-desc {
        font-size: 28rpx;
        color: #666666;
        margin-bottom: 30rpx;
      }
      
      .detail-stats {
        display: flex;
        margin-bottom: 30rpx;
        
        .stat-item {
          flex: 1;
          text-align: center;
          
          .stat-label {
            font-size: 24rpx;
            color: #999999;
            margin-bottom: 8rpx;
          }
          
          .stat-value {
            font-size: 32rpx;
            color: #333333;
            font-weight: bold;
          }
        }
      }
      
      .detail-features {
        .features-title {
          font-size: 28rpx;
          color: #333333;
          font-weight: bold;
          margin-bottom: 20rpx;
        }
        
        .feature-list {
          display: flex;
          flex-wrap: wrap;
          gap: 16rpx;
          
          .feature-item {
            padding: 8rpx 20rpx;
            background: #f5f5f5;
            border-radius: 20rpx;
            font-size: 24rpx;
            color: #666666;
          }
        }
      }
    }
  }
  
  .detail-actions {
    padding: 20rpx 30rpx;
    border-top: 2rpx solid #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .action-price {
      .price-symbol {
        font-size: 24rpx;
        color: #35c8a9;
      }
      
      .price-value {
        font-size: 40rpx;
        color: #35c8a9;
        font-weight: bold;
      }
    }
    
    .action-buttons {
      display: flex;
      gap: 20rpx;
    }
  }
}

.share-popup {
  background: #ffffff;
  border-radius: 24rpx 24rpx 0 0;
  
  .share-header {
    padding: 30rpx;
    text-align: center;
    border-bottom: 2rpx solid #f5f5f5;
    
    text {
      font-size: 32rpx;
      color: #333333;
      font-weight: bold;
    }
  }
  
  .share-options {
    display: flex;
    padding: 40rpx;
    
    .share-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16rpx;
      
      text {
        font-size: 28rpx;
        color: #333333;
      }
    }
  }
  
  .share-cancel {
    padding: 30rpx;
    text-align: center;
    border-top: 2rpx solid #f5f5f5;
    
    text {
      font-size: 32rpx;
      color: #999999;
    }
  }
}

.video-popup {
  width: 90vw;
  height: 50.625vw; // 16:9 比例
  background: #000000;
  border-radius: 16rpx;
  overflow: hidden;
  
  .video-player {
    width: 100%;
    height: 100%;
  }
}
</style> 