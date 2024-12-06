import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios'
import { buildReqInterceptors, buildRespInterceptors } from './interceptor'

export { reloginHint } from './interceptor'

// const service = axios.create({
//   baseURL: import.meta.env.VITE_API_URL + '/admin-api',
//   timeout: 30000,
//   paramsSerializer: {
//     indexes: null,
//     serialize: serializerGETReq
//   }
// })

// const serviceLite = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   timeout: 30000,
//   paramsSerializer: {
//     indexes: null,
//     serialize: serializerGETReq
//   }
// })

const buildService = (config: CreateAxiosDefaults): AxiosInstance => {
  const service = axios.create(config)
  service.interceptors.request.use(...buildReqInterceptors())
  service.interceptors.response.use(...buildRespInterceptors(service))

  return service
}

export default buildService
