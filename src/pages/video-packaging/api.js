/**
 * 视频包装API接口
 * 处理与后端的通信，包括视频上传、处理状态查询等
 */

// 基础URL
const BASE_URL = '/api/video-packaging';

/**
 * 上传视频到服务器并开始处理
 * @param {Object} options - 上传选项
 * @param {String} options.filePath - 视频文件路径
 * @param {Number} options.styleId - 选择的样式ID
 * @param {Number} options.intensity - 特效强度(1-10)
 * @param {String} options.quality - 视频质量('standard', 'hd', 'fullhd')
 * @returns {Promise} - 返回Promise对象，成功时返回任务ID
 */
export function uploadVideo(options) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${BASE_URL}/upload`,
      filePath: options.filePath,
      name: 'video',
      formData: {
        styleId: options.styleId,
        intensity: options.intensity,
        quality: options.quality
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          if (data.code === 0) {
            resolve({
              taskId: data.data.taskId,
              message: '上传成功'
            });
          } else {
            reject({
              code: data.code,
              message: data.message || '上传失败'
            });
          }
        } catch (e) {
          reject({
            code: -1,
            message: '解析响应失败'
          });
        }
      },
      fail: (err) => {
        reject({
          code: err.code || -1,
          message: err.errMsg || '网络错误'
        });
      }
    });
  });
}

/**
 * 查询视频处理状态
 * @param {String} taskId - 任务ID
 * @returns {Promise} - 返回Promise对象，成功时返回处理状态
 */
export function getProcessingStatus(taskId) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/status`,
      data: { taskId },
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 0) {
          resolve(res.data.data);
        } else {
          reject({
            code: res.data.code || res.statusCode,
            message: res.data.message || '查询状态失败'
          });
        }
      },
      fail: (err) => {
        reject({
          code: err.code || -1,
          message: err.errMsg || '网络错误'
        });
      }
    });
  });
}

/**
 * 获取处理完成的视频信息
 * @param {String} taskId - 任务ID
 * @returns {Promise} - 返回Promise对象，成功时返回视频信息
 */
export function getProcessedVideo(taskId) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/result`,
      data: { taskId },
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 0) {
          resolve(res.data.data);
        } else {
          reject({
            code: res.data.code || res.statusCode,
            message: res.data.message || '获取视频信息失败'
          });
        }
      },
      fail: (err) => {
        reject({
          code: err.code || -1,
          message: err.errMsg || '网络错误'
        });
      }
    });
  });
}

/**
 * 下载处理后的视频
 * @param {String} url - 视频URL
 * @param {Function} progressCallback - 进度回调
 * @returns {Promise} - 返回Promise对象，成功时返回本地文件路径
 */
export function downloadProcessedVideo(url, progressCallback) {
  return new Promise((resolve, reject) => {
    const downloadTask = uni.downloadFile({
      url: url,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath);
        } else {
          reject({
            code: res.statusCode,
            message: '下载失败'
          });
        }
      },
      fail: (err) => {
        reject({
          code: err.code || -1,
          message: err.errMsg || '下载失败'
        });
      }
    });

    if (progressCallback && typeof progressCallback === 'function') {
      downloadTask.onProgressUpdate((res) => {
        progressCallback(res.progress);
      });
    }
  });
}

/**
 * 获取可用的字幕风格列表
 * @returns {Promise} - 返回Promise对象，成功时返回风格列表
 */
export function getSubtitleStyles() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/styles`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 0) {
          resolve(res.data.data);
        } else {
          reject({
            code: res.data.code || res.statusCode,
            message: res.data.message || '获取风格列表失败'
          });
        }
      },
      fail: (err) => {
        reject({
          code: err.code || -1,
          message: err.errMsg || '网络错误'
        });
      }
    });
  });
}

/**
 * 分享视频
 * @param {Object} options - 分享选项
 * @param {String} options.title - 分享标题
 * @param {String} options.desc - 分享描述
 * @param {String} options.videoUrl - 视频URL
 * @returns {Promise} - 返回Promise对象
 */
export function shareVideo(options) {
  return new Promise((resolve, reject) => {
    uni.share({
      provider: 'weixin',
      scene: 'WXSceneSession',
      type: 2,
      videoUrl: options.videoUrl,
      title: options.title || '我的网感视频',
      summary: options.desc || '一键包装生成的网感视频',
      success: () => {
        resolve({ message: '分享成功' });
      },
      fail: (err) => {
        reject({
          code: -1,
          message: err.errMsg || '分享失败'
        });
      }
    });
  });
} 