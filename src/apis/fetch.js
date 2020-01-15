import Vue from 'vue'
import axios from 'axios'
import Qs from 'qs'
import Cookies from 'js-cookie'
import { SERVER_BASE_URL } from './config'
// import iView, { Notice } from 'iview';
// import iView, { Notice } from 'iview';
import Element, { Message } from 'element-ui'
import store from '@/store'
import { router } from '@/router'

Vue.use(Element)
// 设置用户信息action
/* const setUserInfo = function (user) {
 //store.dispatch(SET_USER_INFO, user)
 }; */

export default function fetch(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: SERVER_BASE_URL,
      timeout: 20000,
      headers: {}
    })

    // http request 拦截器
    instance.interceptors.request.use(
      config => {
        // config.headers.Authorization = Cookies.get('authorization');
        // return config;
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
        config.headers['port'] = 'shopadmin'
        config.data = Qs.stringify(config.data)
        return config
      },
      err => {
        Element.LoadingBar.error()
        return Promise.reject(err)
      })

    // http response 拦截器
    instance.interceptors.response.use(
      response => {
        return response
      },
      error => {
        Element.LoadingBar.error()
        return Promise.reject(error) // 返回接口返回的错误信息
      })

    // 请求处理
    instance(options)
      .then((res) => {
        // 请求成功时,根据业务判断状态
        /*  if (code === port_code.success) {
                 resolve({code, msg, data})
                 return false
                 } else if (code === port_code.unlogin) {
                 setUserInfo(null)
                 router.replace({name: "login"})
                 } */
        const data = res.data
        // console.log(data)

        if (data.success === false) {
          let content = JSON.stringify(data.data)
          let title = data.message
          data.data = data.data || []

          if (data.data.length === 0) {
            content = data.message
            title = ''
          }

          // this.$notify.warning({
          //     title: title,
          //     desc: 'code: ' + data.code + '</br>' + content
          // })

          Message.warning({
            message: content,
            desc: 'code: ' + data.code + '</br>' + content
          })
        }

        resolve(data)
        return false
      })
      .catch((error) => {
        const response = error.response
        const data = response.data
        console.log(error)
        // 401无效token
        if (data && data.code && data.code === 401) {
          // 退出登录
          store.commit('logout', this)
          store.commit('clearOpenedSubmenu')
          Notice.error({
            title: '登录信息失效，请重新登录！',
            desc: '错误代码：401'
          })
          setTimeout(() => {
            router.push({ path: '/' })
          }, 2000)
          reject(error)
          return false
        }

        // 403无权限操作
        if (data && data.code && data.code === 403) {
          Notice.error({
            title: '您没有权限操作',
            desc: '错误代码：' + data.code,
            duration: 0
          })
          reject(error)
          return false
        }

        // 请求失败时,根据业务判断状态
        Notice.error({
          title: '出错了！',
          desc: '错误原因 ' + JSON.stringify(response),
          duration: 0
        })
        reject(error)
      })
  })
}
