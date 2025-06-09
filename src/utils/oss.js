import request from './request';

/**
 * 获取 OSS POST 表单上传凭证
 * @param fileName 文件名，包含扩展名
 * @param directory OSS 存储目录前缀
 */
export async function getOssToken(fileName, directory = 'uploads') {
  // 后端接口返回包含 host、policy、signature等字段
  const token = await request.get('/api/oss/presigned-url', {
    params: { fileName, directory }
  });
  return token;
}

/**
 * 上传文件到 OSS
 * @param file File 对象
 * @param directory OSS 存储目录前缀
 * @returns {Promise<string>} 资源访问 URL
 */
export async function uploadFileToOss(file, directory) {
  // 获取表单字段
  const token = await getOssToken(file.name, directory);
  // 构造 FormData
  const formData = new FormData();
  Object.entries(token).forEach(([key, value]) => {
    if (key === 'resourceUrl') return;
    formData.append(key, value);
  });
  formData.append('file', file);

  // POST 到 OSS
  const response = await fetch(token.host, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`OSS 上传失败：${response.status} ${text}`);
  }

  return token.resourceUrl;
} 