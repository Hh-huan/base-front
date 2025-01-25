// base-front/src/api/user.js
import request from '@/utils/request' // 确保导入了正确的请求工具
import CryptoJS from 'crypto-js'

// MD5加密
export function md5(str) {
  return CryptoJS.MD5(str).toString()
}

const prefix = '/web-user-info'

// 获取用户列表
export const getUsers = (params) => {
  return request({
    url: prefix + '/getAll',
    method: 'post',
    params: {
      pageNum: params.pageNum,
      pageSize: params.pageSize
    },
    data: params.webUserInfo
    ,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}


export const getUserById = (params) => {
  return request({
    url: prefix + '/info',
    method: 'get',
    params: {
      ...params
    }
  })
}

// 添加用户
export const addUser = (user) => {
  return request({
    url: prefix + '/addUser',
    method: 'post',
    data: {
      ...user,
      password: md5("123456"),
    }
  })
}

// 添加用户
export const checkUserName = (params) => {
  return request({
    url: prefix + '/checkUserName',
    method: 'get',
    params: {
      ...params
    }
  })
}

// 更新用户
export const replacePassword = (data) => {
  return request({
    url: prefix + '/replacePassword',
    method: 'post',
    data: {
      ...data,
      oldPassword: md5(data.oldPassword),
      newPassword: md5(data.newPassword),
      confirmPassword: md5(data.confirmPassword)
    }
  })
}
// 更新用户
export const updateUser = (user) => {
  return request({
    url: prefix + '/updateUserInfo',
    method: 'put',
    data: user
  })
}

// 删除用户
export const deleteUser = (id) => {
  return request({
    url: prefix + '/delete',
    method: 'put',
    params: {
      id
    }
  })
}