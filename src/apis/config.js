/**
 * 接口配置,api服务器接口根地址
 * var config = require('../../build/config');
 */

import Cookies from 'js-cookie'

const environmentVariables = process.env.NODE_ENV
let baseURL = 'http://www.zhongjubang.com/api'

if (environmentVariables === 'production') {
  console.log('---- production ----')
} else if (environmentVariables === 'test') {
  baseURL = 'http://www.zhongjubang.com/test'
  console.log('---- test ----')
} else {
  baseURL = 'http://www.zhongjubang.com/test'
  console.log('---- develop ----')
}

export const SERVER_BASE_URL = baseURL
export const JsCookies = Cookies
// global.SERVER_BASE_URL='http://localhost:9999/order';
export const ERR_OK = 0
