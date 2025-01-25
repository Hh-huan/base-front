import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  // 2xx 范围内的状态码都会触发该函数
  response => {
    // 其他业务错误
    if (response.status !== 200) {
      ElMessage.error(response.msg || '操作失败')
      return Promise.reject(response)
    }

    return response.data
  },
  // 超出 2xx 范围的状态码都会触发该函数
  error => {
    // 处理 HTTP 错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          handleUnauthorized()
          break
        case 403:
          ElMessage.error('没有权限进行此操作')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error('请求失败')
      }
    } else if (error.request) {
      ElMessage.error('网络错误，请检查您的网络连接')
    } else {
      ElMessage.error('请求配置错误')
    }

    return Promise.reject(error)
  }
)

// 处理未授权情况
const handleUnauthorized = () => {
  ElMessage.error('登录已过期，请重新登录')
  localStorage.clear()
  router.replace('/login')
}


export const get = (url, params) => {
    return axios.get(url, { params }); // 更新接口
};

export const post = (url, data) => {
    return axios.post(url, data); // 更新接口
};

export default service