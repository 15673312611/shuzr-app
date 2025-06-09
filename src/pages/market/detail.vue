<template>
  <view class="container">
    <view class="back-btn" @click="goBack">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" width="24" height="24">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
    </view>
    
    <view class="item-gallery">
      <swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500">
        <swiper-item v-for="(image, index) in itemDetail.images" :key="index">
          <image :src="image" mode="aspectFill" class="gallery-image" />
        </swiper-item>
      </swiper>
    </view>
    
    <view class="item-info">
      <text class="item-title">{{ itemDetail.title }}</text>
      <view class="item-meta">
        <text class="item-price">{{ itemDetail.price }}</text>
        <text class="item-sales">{{ itemDetail.sales }}人付费</text>
      </view>
      <view class="item-tags">
        <view class="tag-item" v-for="(tag, index) in itemDetail.tags" :key="index">
          <text>{{ tag }}</text>
        </view>
      </view>
    </view>
    
    <view class="item-tabs">
      <view class="tab-header">
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 'detail' }" 
          @click="activeTab = 'detail'"
        >
          <text>详情</text>
        </view>
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 'comments' }" 
          @click="activeTab = 'comments'"
        >
          <text>评价({{ itemDetail.comments.length }})</text>
        </view>
      </view>
      
      <view class="tab-content">
        <!-- 详情 -->
        <view class="detail-content" v-if="activeTab === 'detail'">
          <view class="detail-section">
            <text class="section-title">资产介绍</text>
            <text class="section-text">{{ itemDetail.description }}</text>
          </view>
          
          <view class="detail-section">
            <text class="section-title">适用场景</text>
            <view class="scene-list">
              <view class="scene-item" v-for="(scene, index) in itemDetail.scenes" :key="index">
                <view class="scene-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3ef7c8" width="20" height="20">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </view>
                <text class="scene-text">{{ scene }}</text>
              </view>
            </view>
          </view>
          
          <view class="detail-section">
            <text class="section-title">使用说明</text>
            <view class="instruction-list">
              <view class="instruction-item" v-for="(instruction, index) in itemDetail.instructions" :key="index">
                <text class="instruction-num">{{ index + 1 }}</text>
                <text class="instruction-text">{{ instruction }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 评价 -->
        <view class="comments-content" v-if="activeTab === 'comments'">
          <view class="comment-stats">
            <text class="rating-text">{{ itemDetail.rating }}分</text>
            <view class="rating-stars">
              <view class="star-item" v-for="i in 5" :key="i">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="i <= Math.floor(itemDetail.rating) ? '#ffcc00' : '#666'" width="16" height="16">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </view>
            </view>
            <text class="rating-count">{{ itemDetail.comments.length }}条评价</text>
          </view>
          
          <view class="comment-list">
            <view class="comment-item" v-for="(comment, index) in itemDetail.comments" :key="index">
              <view class="comment-header">
                <view class="user-avatar">
                  <image :src="comment.avatar" mode="aspectFill" />
                </view>
                <view class="user-info">
                  <text class="user-name">{{ comment.username }}</text>
                  <view class="comment-rating">
                    <view class="star-item" v-for="i in 5" :key="i">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="i <= comment.rating ? '#ffcc00' : '#666'" width="12" height="12">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    </view>
                  </view>
                </view>
                <text class="comment-date">{{ formatDate(comment.date) }}</text>
              </view>
              <text class="comment-text">{{ comment.content }}</text>
              <view class="comment-images" v-if="comment.images && comment.images.length">
                <image 
                  v-for="(img, imgIndex) in comment.images" 
                  :key="imgIndex" 
                  :src="img" 
                  mode="aspectFill" 
                  class="comment-image" 
                  @click="previewImage(comment.images, imgIndex)"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="bottom-bar">
      <view class="bottom-left">
        <view class="action-btn favorite-btn" @click="toggleFavorite">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="isFavorite ? '#ff4d4f' : '#999'" width="24" height="24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <text :class="{ active: isFavorite }">收藏</text>
        </view>
        <view class="action-btn share-btn" @click="shareItem">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#999" width="24" height="24">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
          </svg>
          <text>分享</text>
        </view>
      </view>
      <view class="bottom-right">
        <view class="purchase-btn" @click="purchaseItem">
          <text>立即购买</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const activeTab = ref('detail')
const isFavorite = ref(false)

// 模拟商品详情数据
const itemDetail = ref({
  id: 1,
  title: '商务女性数字人',
  price: '¥99',
  priceValue: 99,
  sales: 256,
  rating: 4.8,
  tags: ['商务', '专业', '女性'],
  images: [
    '/static/images/asset1.jpg',
    '/static/images/asset1_2.jpg',
    '/static/images/asset1_3.jpg'
  ],
  description: '这是一款专为商务场景设计的女性数字人形象，适合企业宣传、产品演示、在线客服等多种场景。形象自然逼真，表情丰富，动作流畅，可根据需求进行个性化定制。',
  scenes: [
    '企业形象代言',
    '产品演示讲解',
    '在线客服助手',
    '营销推广视频',
    '直播带货主播'
  ],
  instructions: [
    '购买后可在"我的数字人"中查看',
    '可通过编辑功能修改发型、服装、妆容等',
    '支持导出多种格式，适配各类平台',
    '包含基础动作和表情库，可扩展购买高级动作包'
  ],
  comments: [
    {
      username: '用户12345',
      avatar: '/static/images/avatar1.jpg',
      rating: 5,
      date: '2023-11-10T14:30:00',
      content: '效果非常好，表情自然，动作流畅，完全符合我们公司的需求，已经用在了公司的宣传视频中，效果很棒！',
      images: [
        '/static/images/comment1_1.jpg',
        '/static/images/comment1_2.jpg'
      ]
    },
    {
      username: '企业用户8888',
      avatar: '/static/images/avatar2.jpg',
      rating: 4,
      date: '2023-10-25T09:15:00',
      content: '整体效果不错，就是有些细节还可以再优化，客服响应速度很快，解决了我的定制需求。'
    },
    {
      username: '营销达人',
      avatar: '/static/images/avatar3.jpg',
      rating: 5,
      date: '2023-09-18T16:45:00',
      content: '用在我们的营销视频中效果非常好，转化率提升了不少，值得推荐！',
      images: [
        '/static/images/comment3_1.jpg'
      ]
    }
  ]
})

onMounted(() => {
  // 根据路由参数获取商品ID
  const id = Number(route.query.id)
  // 这里应该调用API获取商品详情
  console.log('加载商品ID:', id)
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const goBack = () => {
  router.back()
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const shareItem = () => {
  // 实现分享功能
  console.log('分享商品:', itemDetail.value.id)
}

const purchaseItem = () => {
  // 实现购买功能
  console.log('购买商品:', itemDetail.value.id)
  // 跳转到支付页面
  router.push({
    path: '/pages/payment',
    query: { id: itemDetail.value.id }
  })
}

const previewImage = (images, current) => {
  // 实现图片预览
  console.log('预览图片:', images, current)
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #000;
  color: #fff;
  min-height: 100vh;
  padding-bottom: 70px;
}

.back-btn {
  position: fixed;
  top: 40px;
  left: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.item-gallery {
  width: 100%;
  height: 300px;
  
  .swiper {
    width: 100%;
    height: 100%;
    
    .gallery-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.item-info {
  padding: 20px;
  
  .item-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    display: block;
  }
  
  .item-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    .item-price {
      font-size: 24px;
      color: #3ef7c8;
      font-weight: bold;
    }
    
    .item-sales {
      font-size: 14px;
      color: #999;
    }
  }
  
  .item-tags {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    
    .tag-item {
      padding: 4px 10px;
      background-color: #222;
      border-radius: 12px;
      margin-right: 10px;
      margin-bottom: 5px;
      font-size: 12px;
    }
  }
}

.item-tabs {
  .tab-header {
    display: flex;
    border-bottom: 1px solid #333;
    padding: 0 20px;
    
    .tab-item {
      padding: 10px 0;
      margin-right: 30px;
      position: relative;
      font-size: 16px;
      color: #999;
      
      &.active {
        color: #fff;
        font-weight: bold;
        
        &::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, #3ef7c8, #43b5ff);
        }
      }
    }
  }
  
  .tab-content {
    padding: 20px;
    
    .detail-section {
      margin-bottom: 25px;
      
      .section-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
        display: block;
      }
      
      .section-text {
        font-size: 14px;
        line-height: 1.6;
        color: #ccc;
      }
      
      .scene-list {
        .scene-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          
          .scene-icon {
            margin-right: 10px;
          }
          
          .scene-text {
            font-size: 14px;
            color: #ccc;
          }
        }
      }
      
      .instruction-list {
        .instruction-item {
          display: flex;
          margin-bottom: 12px;
          
          .instruction-num {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(to right, #3ef7c8, #43b5ff);
            color: #000;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
            flex-shrink: 0;
          }
          
          .instruction-text {
            font-size: 14px;
            color: #ccc;
            line-height: 1.5;
          }
        }
      }
    }
    
    .comment-stats {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      
      .rating-text {
        font-size: 24px;
        font-weight: bold;
        margin-right: 10px;
      }
      
      .rating-stars {
        display: flex;
        margin-right: 10px;
        
        .star-item {
          margin-right: 2px;
        }
      }
      
      .rating-count {
        font-size: 14px;
        color: #999;
      }
    }
    
    .comment-list {
      .comment-item {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #222;
        
        &:last-child {
          border-bottom: none;
        }
        
        .comment-header {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          
          .user-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 10px;
            
            image {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          
          .user-info {
            flex: 1;
            
            .user-name {
              font-size: 14px;
              margin-bottom: 2px;
              display: block;
            }
            
            .comment-rating {
              display: flex;
            }
          }
          
          .comment-date {
            font-size: 12px;
            color: #999;
          }
        }
        
        .comment-text {
          font-size: 14px;
          line-height: 1.5;
          color: #ccc;
          margin-bottom: 10px;
        }
        
        .comment-images {
          display: flex;
          flex-wrap: wrap;
          
          .comment-image {
            width: 80px;
            height: 80px;
            margin-right: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
            object-fit: cover;
          }
        }
      }
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #111;
  display: flex;
  align-items: center;
  padding: 0 15px;
  z-index: 100;
  
  .bottom-left {
    display: flex;
    
    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 25px;
      
      text {
        font-size: 12px;
        color: #999;
        margin-top: 3px;
        
        &.active {
          color: #ff4d4f;
        }
      }
    }
  }
  
  .bottom-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    
    .purchase-btn {
      height: 40px;
      padding: 0 30px;
      background: linear-gradient(to right, #3ef7c8, #43b5ff);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      text {
        font-size: 16px;
        color: #000;
        font-weight: bold;
      }
    }
  }
}
</style> 