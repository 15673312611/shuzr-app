/**
 * Toast 消息提示工具
 * 封装uni-app的showToast方法，提供更简便的调用方式
 */

/**
 * 显示消息提示框
 * @param {string|object} options - 提示内容或配置对象
 * @param {string} [options.title] - 提示内容
 * @param {string} [options.icon] - 图标类型，有效值：success, error, none, loading
 * @param {number} [options.duration] - 提示持续时间，单位ms
 * @param {boolean} [options.mask] - 是否显示透明蒙层
 * @param {function} [options.complete] - 接口调用结束的回调函数
 */
export function showToast(options) {
  // 如果传入的是字符串，则转换为对象
  if (typeof options === 'string') {
    options = {
      title: options
    }
  }

  // 默认配置
  const defaultOptions = {
    icon: 'none',
    duration: 2000,
    mask: false
  }

  // 合并配置
  const finalOptions = {
    ...defaultOptions,
    ...options
  }

  // 检查uni对象是否存在且showToast是否为函数
  if (typeof uni !== 'undefined' && typeof uni.showToast === 'function') {
    // 调用uni-app的showToast方法
    uni.showToast(finalOptions)
  } else {
    // 浏览器环境下的替代实现
    console.log('Toast:', finalOptions.title)
    
    // 创建一个简单的toast元素
    const toast = document.createElement('div')
    toast.className = 'browser-toast'
    toast.textContent = finalOptions.title
    
    // 样式设置
    Object.assign(toast.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '4px',
      zIndex: '10000',
      maxWidth: '80%',
      textAlign: 'center'
    })
    
    // 根据icon类型添加不同的样式
    if (finalOptions.icon === 'success') {
      toast.style.backgroundColor = 'rgba(0, 128, 0, 0.7)'
    } else if (finalOptions.icon === 'error') {
      toast.style.backgroundColor = 'rgba(255, 0, 0, 0.7)'
    }
    
    // 添加到body
    document.body.appendChild(toast)
    
    // 设置定时器自动移除
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
      
      // 如果有完成回调，则调用
      if (typeof finalOptions.complete === 'function') {
        finalOptions.complete()
      }
    }, finalOptions.duration)
  }
}

/**
 * 显示成功提示
 * @param {string} title - 提示内容
 * @param {number} [duration] - 提示持续时间，单位ms
 */
export function showSuccess(title, duration = 2000) {
  showToast({
    title,
    icon: 'success',
    duration
  })
}

/**
 * 显示错误提示
 * @param {string} title - 提示内容
 * @param {number} [duration] - 提示持续时间，单位ms
 */
export function showError(title, duration = 2000) {
  showToast({
    title,
    icon: 'error',
    duration
  })
}

/**
 * 显示加载提示
 * @param {string} title - 提示内容
 */
export function showLoading(title = '加载中...') {
  // 检查uni对象是否存在且showLoading是否为函数
  if (typeof uni !== 'undefined' && typeof uni.showLoading === 'function') {
    uni.showLoading({
      title,
      mask: true
    })
  } else {
    // 浏览器环境下的替代实现
    console.log('Loading:', title)
    
    // 先移除可能已存在的loading元素
    hideLoading()
    
    // 创建遮罩层
    const mask = document.createElement('div')
    mask.className = 'loading-mask'
    
    // 样式设置
    Object.assign(mask.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: '9999',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    })
    
    // 创建loading指示器
    const loadingIndicator = document.createElement('div')
    loadingIndicator.className = 'loading-indicator'
    
    // 样式设置
    Object.assign(loadingIndicator.style, {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: '#fff',
      padding: '15px 20px',
      borderRadius: '5px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px'
    })
    
    // 添加旋转动画
    const spinner = document.createElement('div')
    spinner.className = 'loading-spinner'
    
    // 样式设置
    Object.assign(spinner.style, {
      width: '30px',
      height: '30px',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      borderTop: '3px solid #ffffff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    })
    
    // 添加CSS动画
    const style = document.createElement('style')
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
    document.head.appendChild(style)
    
    // 添加文本
    const text = document.createElement('div')
    text.textContent = title
    
    // 组装元素
    loadingIndicator.appendChild(spinner)
    loadingIndicator.appendChild(text)
    mask.appendChild(loadingIndicator)
    
    // 添加到body
    document.body.appendChild(mask)
  }
}

/**
 * 隐藏加载提示
 */
export function hideLoading() {
  // 检查uni对象是否存在且hideLoading是否为函数
  if (typeof uni !== 'undefined' && typeof uni.hideLoading === 'function') {
    uni.hideLoading()
  } else {
    // 浏览器环境下的替代实现
    // 可以查找并移除任何加载指示器元素
    const loadingElements = document.querySelectorAll('.loading-indicator')
    loadingElements.forEach(el => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el)
      }
    })
    
    // 也可以移除任何可能存在的遮罩层
    const masks = document.querySelectorAll('.loading-mask')
    masks.forEach(mask => {
      if (mask && mask.parentNode) {
        mask.parentNode.removeChild(mask)
      }
    })
    
    console.log('hideLoading called in browser environment')
  }
}

/**
 * 显示模态对话框
 * @param {object} options - 配置对象
 * @param {string} [options.title] - 标题
 * @param {string} [options.content] - 内容
 * @param {boolean} [options.showCancel] - 是否显示取消按钮
 * @param {string} [options.cancelText] - 取消按钮文字
 * @param {string} [options.confirmText] - 确认按钮文字
 * @param {function} [options.success] - 成功回调函数
 * @param {function} [options.fail] - 失败回调函数
 */
export function showModal(options) {
  return new Promise((resolve, reject) => {
    // 检查uni对象是否存在且showModal是否为函数
    if (typeof uni !== 'undefined' && typeof uni.showModal === 'function') {
      uni.showModal({
        ...options,
        success: (res) => {
          if (options.success) {
            options.success(res)
          }
          resolve(res)
        },
        fail: (err) => {
          if (options.fail) {
            options.fail(err)
          }
          reject(err)
        }
      })
    } else {
      // 浏览器环境下的替代实现
      console.log('Modal:', options)
      
      // 创建模态框容器
      const modalContainer = document.createElement('div')
      modalContainer.className = 'browser-modal-container'
      
      // 样式设置
      Object.assign(modalContainer.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '10001'
      })
      
      // 创建模态框
      const modal = document.createElement('div')
      modal.className = 'browser-modal'
      
      // 样式设置
      Object.assign(modal.style, {
        backgroundColor: '#fff',
        borderRadius: '8px',
        width: '80%',
        maxWidth: '300px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
      })
      
      // 创建标题
      if (options.title) {
        const title = document.createElement('div')
        title.textContent = options.title
        
        // 样式设置
        Object.assign(title.style, {
          padding: '15px',
          fontSize: '16px',
          fontWeight: 'bold',
          borderBottom: '1px solid #eee',
          textAlign: 'center'
        })
        
        modal.appendChild(title)
      }
      
      // 创建内容
      if (options.content) {
        const content = document.createElement('div')
        content.textContent = options.content
        
        // 样式设置
        Object.assign(content.style, {
          padding: '20px 15px',
          fontSize: '14px',
          color: '#333',
          lineHeight: '1.5',
          textAlign: 'center'
        })
        
        modal.appendChild(content)
      }
      
      // 创建按钮区域
      const buttonArea = document.createElement('div')
      
      // 样式设置
      Object.assign(buttonArea.style, {
        display: 'flex',
        borderTop: '1px solid #eee'
      })
      
      // 取消按钮
      if (options.showCancel !== false) {
        const cancelButton = document.createElement('button')
        cancelButton.textContent = options.cancelText || '取消'
        
        // 样式设置
        Object.assign(cancelButton.style, {
          flex: '1',
          padding: '10px',
          fontSize: '14px',
          backgroundColor: '#fff',
          border: 'none',
          borderRight: '1px solid #eee',
          cursor: 'pointer'
        })
        
        // 点击事件
        cancelButton.onclick = () => {
          document.body.removeChild(modalContainer)
          const res = { confirm: false, cancel: true }
          if (options.success) {
            options.success(res)
          }
          resolve(res)
        }
        
        buttonArea.appendChild(cancelButton)
      }
      
      // 确认按钮
      const confirmButton = document.createElement('button')
      confirmButton.textContent = options.confirmText || '确定'
      
      // 样式设置
      Object.assign(confirmButton.style, {
        flex: '1',
        padding: '10px',
        fontSize: '14px',
        backgroundColor: '#fff',
        border: 'none',
        color: '#576B95',
        fontWeight: 'bold',
        cursor: 'pointer'
      })
      
      // 点击事件
      confirmButton.onclick = () => {
        document.body.removeChild(modalContainer)
        const res = { confirm: true, cancel: false }
        if (options.success) {
          options.success(res)
        }
        resolve(res)
      }
      
      buttonArea.appendChild(confirmButton)
      modal.appendChild(buttonArea)
      modalContainer.appendChild(modal)
      
      // 添加到body
      document.body.appendChild(modalContainer)
    }
  })
}

/**
 * 显示确认对话框
 * @param {string} content - 对话框内容
 * @param {string} [title] - 对话框标题
 * @param {string} [confirmText] - 确认按钮文字
 * @returns {Promise<boolean>} - 用户确认返回true，取消返回false
 */
export function showConfirm(content, title = '提示', confirmText = '确定') {
  return showModal({
    title,
    content,
    showCancel: true,
    confirmText
  }).then(res => res.confirm)
} 