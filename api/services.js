import request from '../utils/request'

// 形象克隆相关接口
export const avatarApi = {
  // 上传图片生成数字人
  uploadImage(data) {
    return request.post('/api/avatar/generate', data)
  },
  // 获取生成进度
  getProgress(taskId) {
    return request.get(`/api/avatar/progress/${taskId}`)
  },
  // 获取生成结果
  getResult(taskId) {
    return request.get(`/api/avatar/result/${taskId}`)
  },
  // 获取我的数字人列表
  getMyList() {
    return request.get('/api/avatar/my-list')
  },
  // 获取数字人列表
  getAvatarList() {
    return request.get('/api/avatar/list')
  },
  // 删除数字人
  deleteAvatar(id) {
    return request.delete(`/api/avatar/${id}`)
  },
  // 更新数字人信息
  updateAvatar(id, data) {
    return request.put(`/api/avatar/${id}`, data)
  }
}

// 视频合成相关接口
export const videoApi = {
  // 上传视频模板
  uploadTemplate(data) {
    return request.post('/api/video/template', data)
  },
  // 生成视频
  generate(data) {
    return request.post('/api/video/generate', data)
  },
  // 获取生成进度
  getProgress(taskId) {
    return request.get(`/api/video/progress/${taskId}`)
  },
  // 获取我的视频列表
  getMyList() {
    return request.get('/api/video/my-list')
  },
  // 删除视频
  deleteVideo(id) {
    return request.delete(`/api/video/${id}`)
  },
  // 下载视频
  downloadVideo(id) {
    return request.get(`/api/video/download/${id}`, { responseType: 'blob' })
  },
  // 使用AI合成视频
  synthesizeVideo(data) {
    return request.post('/api/video/synthesize', data)
  },
  // 使用上传的音频合成视频
  synthesizeVideoWithAudio(formData) {
    return request.post('/api/video/synthesize-with-audio', formData)
  },
  // 获取视频合成状态
  getVideoStatus(id) {
    return request.get(`/api/video/status/${id}`)
  }
}

// 声音克隆相关接口
export const voiceApi = {
  // 上传声音样本
  uploadSample(data) {
    return request.post('/api/voice/sample', data)
  },
  // 生成声音
  generate(data) {
    return request.post('/api/voice/generate', data)
  },
  // 获取声音列表
  getVoiceList() {
    return request.get('/api/voice/list')
  },
  // 获取系统音色列表
  getSystemVoices() {
    return request.get('/api/voice/system-list')
  },
  // 获取我的声音列表
  getMyVoiceList() {
    return request.get('/api/voice-clone/list', {
      params: { type: 'my' }
    })
  },
  // 获取公共声音列表
  getPublicVoiceList(categoryId = null) {
    const params = { type: 'public' }
    if (categoryId) {
      params.categoryId = categoryId
    }
    return request.get('/api/voice-clone/list', { params })
  },
  // 创建声音克隆
  createVoiceClone(formData) {
    return request.post('/api/voice-clone/create', formData)
  },
  // 删除声音
  deleteVoice(id) {
    return request.delete(`/api/voice-clone/${id}`)
  },
  // 播放声音
  playVoice(id) {
    return request.get(`/api/voice-clone/play/${id}`)
  },
  // 收藏声音
  favoriteVoice(id) {
    return request.post(`/api/voice/favorite/${id}`)
  },
  // 取消收藏声音
  unfavoriteVoice(id) {
    return request.delete(`/api/voice/favorite/${id}`)
  },
  // 获取收藏的声音列表
  getFavoriteList() {
    return request.get('/api/voice/favorite/list')
  },
  // 重命名声音
  renameVoice(id, name) {
    return request.put(`/api/voice-clone/${id}`, { name })
  }
}

// AI文案相关接口
export const contentApi = {
  // 生成文案
  generate(data) {
    return request.post('/api/content/generate', data)
  },
  // 获取文案模板
  getTemplates() {
    return request.get('/api/content/templates')
  },
  // 获取历史文案
  getHistory() {
    return request.get('/api/content/history')
  }
}

// 资产市场相关接口
export const assetApi = {
  // 获取资产列表
  getList(params) {
    return request.get('/api/asset/list', { params })
  },
  // 购买资产
  purchase(assetId) {
    return request.post(`/api/asset/purchase/${assetId}`)
  },
  // 分享资产
  share(data) {
    return request.post('/api/asset/share', data)
  },
  // 获取我的资产
  getMyAssets() {
    return request.get('/api/asset/my-assets')
  },
  // 获取资产详情
  getAssetDetail(assetId) {
    return request.get(`/api/asset/detail/${assetId}`)
  }
}

// 作品相关接口
export const worksApi = {
  // 获取作品列表
  getList(type) {
    return request.get('/api/works/list', { params: { type } })
  },
  // 删除作品
  deleteWork(id) {
    return request.delete(`/api/works/${id}`)
  },
  // 下载作品
  downloadWork(id) {
    return request.get(`/api/works/download/${id}`, { responseType: 'blob' })
  },
  // 分享作品
  shareWork(id) {
    return request.post(`/api/works/share/${id}`)
  }
}

// 用户相关接口
export const userApi = {
  // 登录
  login(data) {
    return request.post('/api/auth/login', data)
  },
  // 注册
  register(data) {
    return request.post('/api/auth/register', data)
  },
  // 获取用户信息
  getUserInfo() {
    return request.get('/api/auth/check')
  },
  // 更新用户信息
  updateUserInfo(data) {
    return request.put('/api/user/profile', data)
  },
  // 刷新token
  refreshToken() {
    return request.post('/api/auth/refresh')
  },
  // 登出
  logout() {
    return request.post('/api/auth/logout')
  }
} 