import request from '@/utils/request'
import CryptoJS from 'crypto-js'

const prefix = '/web-user-info'

// MD5加密
export function md5(str) {
  return CryptoJS.MD5(str).toString()
}

// 登录
export function login(data) {
  return request({
    url: prefix + '/login',
    method: 'post',
    data: {
      ...data,
      password: md5(data.password)
    }
  })
}

// 注册
export const register = (data) => {
  return request({
    url: prefix + '/register',
    method: 'post',
    data: {
      ...data,
      password: md5(data.password)
    }
  })
};

// 获取用户信息
export function getUserInfo(data) {
  return request({
    url: prefix + '/info',
    method: 'get',
    params: {
      ...data
    }
  })
}

// 修改密码
export function changePassword(data) {
  return request({
    url: prefix + '/password',
    method: 'put',
    params: {
      oldPassword: md5(data.oldPassword),
      newPassword: md5(data.newPassword)
    }
  })
}

// 退出登录
export function logout(data) {
  return request({
    url: prefix + '/logout',
    method: 'post',
    params: {
      ...data
    }
  })
} 