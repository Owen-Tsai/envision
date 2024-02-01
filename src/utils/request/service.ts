import axios from 'axios'
import { Modal, message } from 'ant-design-vue'
import { getFormattedToken } from '@/utils/auth'
import useStorage from '@/hooks/use-storage'
import qs from 'qs'
import errorCodes from './error-code'
import errorCode from './error-code'

export const reloginHint = { show: false }

const session = useStorage('sessionStorage')

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
})

service.interceptors.request.use((config) => {
  // 是否需要携带 token 请求
  const requireToken = (config.headers || {}).requireToken !== false
  // 是否需要防止重复提交
  const requireSubmitDebounce = (config.headers || {}).debounce !== false

  const token = getFormattedToken()
  if (token && requireToken) {
    config.headers.Authorization = token
  }

  if (config.method === 'get' && config.params) {
    config.url = config.url + '?' + qs.stringify(config.params)
    config.params = {}
  }

  if (requireSubmitDebounce && (config.method === 'post' || config.method === 'put')) {
    const { url, data } = config
    console.info(url)
    const requestObj = {
      url,
      data: typeof data === 'object' ? JSON.stringify(data) : data,
      time: new Date().getTime()
    }

    const requestSize = Object.keys(JSON.stringify(requestObj)).length
    if (requestSize > 5 * 1024 * 1024) {
      console.warn(`[${url}]: 请求数据超过5Mb，无法进行防重复提交验证`)
      return config
    }

    const stored = session.get('requestObj')
    if (stored === null || stored === undefined || stored === '') {
      session.set('requestObj', requestObj, { exp: 1 })
    } else {
      // 缓存中存在相同参数的请求
      const msg = `[${url}]: 数据正在处理，请勿重复提交`
      console.warn(msg)
      return Promise.reject(new Error(msg))
    }
  }

  return config
})

service.interceptors.response.use(
  (res) => {
    const { data, request } = res
    const code: number = data.code || 200

    console.log(`code for`, request, code)

    // 二进制数据直接返回
    if (request.responseType === 'blob' || request.responseType === 'arraybuffer') {
      return data
    }

    if (code !== 200) {
      console.log('not 200!', res)
      const msg = res.data.msg || errorCodes[code] || errorCode['default']
      if (code === 401) {
        if (!reloginHint.show) {
          reloginHint.show = true
          Modal.confirm({
            title: '登录超时',
            content: '登陆状态已过期。您可以留在当前页面，或重新进行登录。',
            okText: '重新登录',
            onOk() {
              reloginHint.show = false
              // TODO: call userStore().logout(), then redirect to login
            },
            onCancel() {
              reloginHint.show = false
            }
          })
        }

        return Promise.reject('无效的会话，或者会话已过期，请重新登录')
      } else {
        message.error(msg)
        return Promise.reject(new Error(msg))
      }
    } else {
      return Promise.resolve(res.data)
    }
  },
  (error) => {
    console.error(error)
    let { message: msg } = error

    if (msg === 'Network Error') {
      msg = '网络连接异常'
    } else if (msg.includes('timeout')) {
      msg = '服务器响应超时'
    } else if (msg.includes('Request failed with status code')) {
      msg = '系统接口' + msg.substr(msg.length - 3) + '异常'
    }

    message.error(msg)
    return Promise.reject(msg)
  }
)

export default service
