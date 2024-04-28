import { message } from 'ant-design-vue'
import qs from 'qs'
import { saveAs } from 'file-saver'
import service from './service'
import errorCode from './error-code'
import { createLoader, destroyLoader } from '@/components/loading'
import type { AxiosRequestConfig } from 'axios'

const request = (options: AxiosRequestConfig) => {
  const { url, method, data, params, responseType, ...config } = options

  return service({
    url,
    method,
    params,
    data,
    responseType,
    ...config
  })
}

export default {
  get: async <T = any>(options: AxiosRequestConfig) => {
    const res = await request({ method: 'get', ...options })
    return res.data as T
  },
  getRaw: async <T = any>(options: AxiosRequestConfig) => {
    const res = await request({ method: 'get', ...options })
    return res as T
  },
  post: async <T = any>(options: AxiosRequestConfig) => {
    const res = await request({ method: 'post', ...options })
    return res.data as T
  },
  postRaw: async <T = any>(options: AxiosRequestConfig) => {
    const res = await request({ method: 'post', ...options })
    return res as T
  },
  delete: async <T = any>(options: AxiosRequestConfig) => {
    const res = await request({ method: 'delete', ...options })
    return res.data as T
  },
  put: async <T = any>(options: AxiosRequestConfig) => {
    const res = await request({ method: 'put', ...options })
    return res.data as T
  },
  download: async (
    url: string,
    params?: AxiosRequestConfig['params'],
    filename?: string,
    options?: AxiosRequestConfig
  ) => {
    createLoader()
    return request({
      ...options,
      url,
      params,
      method: 'get',
      transformRequest: [(params) => qs.stringify(params)],
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob'
    })
      .then(async (res) => {
        if (res.headers['Content-Type'] !== 'application/json') {
          const blob = new Blob([res as unknown as ArrayBuffer])
          saveAs(blob, filename)
        } else {
          const data = await (res as any).text()
          const rspObj = JSON.parse(data)
          const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
          message.error(errMsg)
        }
      })
      .catch((err) => {
        console.error(`[${url}]`, err)
        message.error('下载文件失败')
      })
      .finally(() => {
        destroyLoader()
      })
  }
}
