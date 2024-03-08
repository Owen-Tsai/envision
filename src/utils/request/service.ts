import axios from 'axios'
import { Modal, message } from 'ant-design-vue'
import { getFormattedToken, getTenantId, getRefreshToken, getToken, setToken } from '@/utils/auth'
import useUserStore from '@/stores/user'
import qs from 'qs'
import errorCodes from './error-code'
import errorCode from './error-code'

const tenantEnabled = import.meta.env.VITE_TENANT_ENABLED === 'true'
const whiteList = ['/login', '/refresh-token']
const ignoredErrorMsgs = ['无效的刷新令牌', '刷新令牌已过期']
// whether ot not the current request was sent to refresh the token
let isTokenRefresh = false
// request queue for store the requests while trying to refresh token
let requestQueue: any[] = []

export const reloginHint = { show: false }

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
})

service.interceptors.request.use(
  (config) => {
    // whether or not the request should be sent with token
    let requireToken = (config.headers || {}).requireToken !== false
    if (config.url && whiteList.includes(config.url)) {
      requireToken = false
    }

    // set tenant
    if (tenantEnabled) {
      const id = getTenantId()
      if (id) {
        config.headers['tenant-id'] = id
      }
    }

    // set token if required
    const token = getFormattedToken()
    if (token && requireToken) {
      config.headers.Authorization = token
    }

    // encode GET request parameters
    if (config.method === 'get' && config.params) {
      config.url = config.url + '?' + qs.stringify(config.params)
      config.params = {}
    }
    // encode POST request parameters
    if (
      config.method === 'post' &&
      config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(config.data)
    }

    return config
  },
  (err) => {
    console.error(err)
    Promise.reject(err)
  }
)

service.interceptors.response.use(
  async (res) => {
    let { data } = res
    const { request, config } = res
    const code: number = data.code || 200

    if (!data) {
      throw new Error('[envision] HTTP 请求正常，但后端没有返回任何值')
    }

    // binary responses should be returned directly
    if (request.responseType === 'blob' || request.responseType === 'arraybuffer') {
      if (data.type !== 'application/json') {
        return data
      }
      data = await new Response(res.data).json()
    }

    // process error situations
    const msg = res.data.msg || errorCodes[code] || errorCode['default']

    if (ignoredErrorMsgs.includes(msg)) {
      return Promise.reject(msg)
    } else if (code === 401) {
      // invalid token
      if (!isTokenRefresh) {
        isTokenRefresh = true
        if (!getRefreshToken()) {
          return redirectForAuth()
        }

        try {
          const refreshTokenRes = await refreshToken()
          setToken(refreshTokenRes.data.data)
          config.headers.Authorization = `Bearer ${getToken()}`
          requestQueue.forEach((fn) => fn())
          requestQueue = []
          return service(config)
        } catch (e) {
          // refreshToken api reports error
          // release requests of the queue
          requestQueue.forEach((fn) => fn())
          return redirectForAuth()
        } finally {
          requestQueue = []
          isTokenRefresh = false
        }
      } else {
        // token is refreshing, queue the request
        return new Promise((resolve) => {
          requestQueue.push(() => {
            config.headers.Authorization = getFormattedToken()
            resolve(service(config))
          })
        })
      }
    } else if (code !== 200) {
      // good job, now you are hard coding and successfully ignored
      // every good practice you should keep in mind since the day you
      // decided to become a software engineer, your mom will be so proud of you, go tell her!
      if (msg === '无效的刷新令牌') {
        console.log(msg)
      } else {
        message.error(msg)
      }
      return Promise.reject(msg)
    } else {
      // code === 200
      return data
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

const refreshToken = async () => {
  axios.defaults.headers['tenant-id'] = getTenantId()
  return await axios.post(
    `${import.meta.env.VITE_API_URL}/system/auth/refresh-token?refreshToken=${getRefreshToken()}`
  )
}

const redirectForAuth = () => {
  if (!reloginHint.show) {
    if (window.location.href.includes('login')) {
      return
    }
    reloginHint.show = true
    Modal.confirm({
      title: '登录超时',
      content: '登陆状态已过期。您可以留在当前页面，或重新进行登录。',
      okText: '重新登录',
      onOk() {
        useUserStore().logout()
        reloginHint.show = false
        window.location.href = '/login'
      },
      onCancel() {
        reloginHint.show = false
      }
    })
  }
  return Promise.reject('登录超时')
}

export default service
