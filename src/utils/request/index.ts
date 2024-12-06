import { message } from 'ant-design-vue'
import qs from 'qs'
import { saveAs } from 'file-saver'
import buildService from './service'
import errorCode from './error-code'
import { createLoader, destroyLoader } from '@/components/loading'
import { serializerGETReq } from './serializer'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

const commonSerializer = {
  timeout: 30000,
  paramsSerializer: {
    indexes: null,
    serialize: serializerGETReq
  }
}

const service = buildService({
  ...commonSerializer,
  baseURL: import.meta.env.VITE_API_URL + '/admin-api'
})

const serviceLite = buildService({
  ...commonSerializer,
  baseURL: import.meta.env.VITE_API_URL
})

const buildHandler = <T>(options: AxiosRequestConfig, instance: AxiosInstance) => {
  const { url, method, data, params, responseType, ...config } = options

  return instance<T>({
    url,
    method,
    params,
    data,
    responseType,
    ...config
  })
}

const handler = <T>(options: AxiosRequestConfig) => buildHandler<T>(options, service)
const liteHandler = <T>(options: AxiosRequestConfig) => buildHandler<T>(options, serviceLite)

export default {
  get: async <T = any>(options: AxiosRequestConfig) => {
    const res = await handler({ method: 'get', ...options })
    return res.data as T
  },
  getRaw: async <T = any>(options: AxiosRequestConfig) => {
    const res = await handler({ method: 'get', ...options })
    return res as T
  },
  post: async <T = any>(options: AxiosRequestConfig) => {
    const res = await handler({ method: 'post', ...options })
    return res.data as T
  },
  postRaw: async <T = any>(options: AxiosRequestConfig) => {
    const res = await handler({ method: 'post', ...options })
    return res as T
  },
  delete: async <T = any>(options: AxiosRequestConfig) => {
    const res = await handler({ method: 'delete', ...options })
    return res.data as T
  },
  put: async <T = any>(options: AxiosRequestConfig) => {
    const res = await handler({ method: 'put', ...options })
    return res.data as T
  },
  download: async (options: AxiosRequestConfig & { filename?: string }) => {
    createLoader()
    const res = await handler({ method: 'get', responseType: 'blob', ...options })
    const blob = new Blob([res as unknown as ArrayBuffer])
    saveAs(blob, options.filename)
    destroyLoader()
    return res
  },
  upload: async <T = string>(options: AxiosRequestConfig) => {
    const res = await handler<{ code: number; data: T; msg?: string }>({
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...options
    })
    return res as unknown as Promise<{ code: number; data: T; msg?: string }>
  }
}

export const requestLite = {
  get: async <T = any>(options: AxiosRequestConfig) => {
    const res = await liteHandler({ method: 'get', ...options })
    return res.data as T
  },
  getRaw: async <T = any>(options: AxiosRequestConfig) => {
    const res = await liteHandler({ method: 'get', ...options })
    return res as T
  }
}
