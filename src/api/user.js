import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function loginShop(data) {
  return request({
    url: '/controller/shopadmincontroller/shopadminuserlogin',
    method: 'post',
    data
  })
}

export function logoutShop(data) {
  return request({
    url: '/controller/shopadmincontroller/shopadminuserlogin',
    method: 'post',
    data
  })
}
