import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { setCookieByName, getCookieByName } from '@/utils/auth'
import { formatParams, isTokenExpire } from '@/utils'
import { showLoading, hideLoading } from '@/components/Loading/loading'
import { userContainerApi } from '@/api/user'
let tokenMsg = ''
let loading = true
let isTokenRefreshing = false
let subscribeArr = []
function subscribeArrRefresh(cb) {
  subscribeArr.push(cb)
}
function reloadSubsubscribeArr(newToken) {
  subscribeArr.map(cb => cb(newToken))
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    loading = config.loading != undefined ? config.loading : true
    if (loading) {
      showLoading()
    }
    // do something before request is sent
    if (store.getters.token ? store.getters.token : localStorage.getItem('org_token_auth')) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      if (config.url !== '/gw/op/v1/auth/login') {
        config.headers['tokenAuth'] = localStorage.getItem('org_token_auth')
        // config.headers['xxlSsoSessionId'] = localStorage.getItem('session_id')
        config.headers['sign'] = 'sdfa454werwrw'
      }
    }
    let tokenExpireTime = localStorage.getItem('tokenExpireTime')
    if (tokenExpireTime && isTokenExpire(tokenExpireTime) === 2) {
      // token已经过期
      if (config.url !== '/gw/op/v1/sys/users/logout') {
        store.dispatch('user/logout').then(() => {
          localStorage.clear()
          location.reload()
        })
      }
    }
    // 判断token是否即将过期
    if (tokenExpireTime && isTokenExpire(tokenExpireTime) === 1 && config.url !== '/gw/op/v1/auth/token/refresh') {
      if (!isTokenRefreshing) {
        isTokenRefreshing = true
        let refreshParam = {
          userId: localStorage.getItem('user_id'),
          token: localStorage.getItem('org_token_auth'),
          refreshToken: localStorage.getItem('refresh_org_token_auth')
        }
        userContainerApi.refresh(refreshParam).then(res => {
          if (res.subCode === 1000) {
            localStorage.setItem('org_token_auth', res.data.token)
            store.dispatch('user/refreshNewToken', res.data.token)
            localStorage.setItem('tokenExpireTime', res.data.tokenExpireTime)
            config.headers['tokenAuth'] = localStorage.getItem('org_token_auth')
            reloadSubsubscribeArr(localStorage.getItem('org_token_auth'))
          } else {
            console.log('token 接口问题')
            Message({
              message: `${res.subMsg}，即将重新登录` || 'token刷新错误',
              type: 'error',
              duration: 2 * 1000
            })
            store.dispatch('user/refreshNewToken', '')
            localStorage.clear()
            location.reload()
          }
        }).finally(() => {
          hideLoading()
          isTokenRefreshing = false
        })
        let retry = new Promise((resolve) => {
          subscribeArrRefresh((token) => {
            config.headers['tokenAuth'] = token
            // 将请求挂起
            resolve(config)
          })
        })
        return retry
      } else {
        let retry = new Promise((resolve) => {
          subscribeArrRefresh((token) => {
            config.headers['tokenAuth'] = token
            resolve(config)
          })
        })
        return retry
      }
    }
    // else {
    //   return config
    // }
    if (config.data) {
      config.data = formatParams(config.data)
    }
    if (config.params) {
      if (config.splicing) {
        // 拼接路径为斜杠的方式
        let param = Object.values(config.params).join('/')
        config.url += `/${param}`
        config.params = ''
      } else {
        config.params = formatParams(config.params)
      }
    }
    if (config.data && config.data.customerId) {
      config.headers['customerId'] = config.data.customerId
    } else if (config.params && config.params.customerId) {
      config.headers['customerId'] = config.params.customerId
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // if (loading) {
    //   hideLoading()
    // }
    hideLoading()
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 1) {
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 800 || res.code === 801 || res.code === 802) {
        // to re-login
        MessageBox.confirm('TOKEN不存在或者已过期，请重新登录', '确认退出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // store.dispatch('user/resetToken').then(() => {
          //   location.reload()
          // })
          localStorage.clear()
          store.dispatch('user/logout')
        })
      } else if (res.code === 901) {
        Message({
          message: res.msg || '权限不足，请求被拒绝',
          type: 'error',
          duration: 2 * 1000
        })
      } else {
        Message({
          message: res.msg || '系统访问异常,请联系管理员',
          type: 'error',
          duration: 2 * 1000
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return {
        subCode: res.sub_code,
        subMsg: res.sub_msg,
        data: res.data != null ? typeof(res.data) == 'string' ? JSON.parse(res.data) : res.data : null
      }
    }
  },
  error => {
    hideLoading()
    console.log(JSON.stringify(error)) // for debug
    if (error.response.status === 401) {
      // token过期
      if (!tokenMsg) {
        Message({
          message: error.response.data.msg,
          type: 'error',
          duration: 2 * 1000
        })
      }
      tokenMsg = error.response.data.msg
    } else if (error.response.status === 500) {
      Message({
        message: error.response.data.sub_msg,
        type: 'error',
        duration: 3 * 1000
      })
    } else {
      Message({
        message: `${error.config.url}: ${error.response.data.msg}` || error,
        type: 'error',
        duration: 2 * 1000
      })
    }
    return Promise.reject(error)
  }
)

window.addEventListener('unhandledrejection', event => {
  event.preventDefault()
})

export default service
