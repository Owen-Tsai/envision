import qs from 'qs'
import type { CustomParamsSerializer } from 'axios'

export const serializerGETReq: CustomParamsSerializer = (params) =>
  qs.stringify(params, { arrayFormat: 'repeat' })
