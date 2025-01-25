import request from '@/utils/request'

const API_PREFIX = 'base-api'; // 添加统一前缀

// 获取用户总数
export function getUserCount() {
  return request({
    url: `/${API_PREFIX}/user/count`,
    method: 'get'
  })
}

// 获取文章总数
export function getArticleCount() {
  return request({
    url: `/${API_PREFIX}/discover-article/count`,
    method: 'get'
  })
}

// 获取圈子总数
export function getCircleCount() {
  return request({
    url: `/${API_PREFIX}/discover-circle/count`,
    method: 'get'
  })
}

export const getDashboardData = () => {
    return request.get('/base-api/dashboard/data'); // 更新接口
}; 