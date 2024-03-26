import request from '@/utils/request'

export type OperateLogVO = {
  id?: number
  userNickname?: string
  traceId?: string
  userId?: number
  module?: string
  name?: string
  type?: number
  content?: string
  exts?: Map<String, Object>
  requestMethod?: string
  requestUrl?: string
  userIp?: string
  userAgent?: string
  javaMethod?: string
  javaMethodArgs?: string
  startTime?: Date
  duration?: number
  resultCode?: number
  resultMsg?: string
  resultData?: string
}
export type OperateLogListVO = {
  list: Array<OperateLogVO>
  total: number
}

export type ListQueryParams = CommonQueryParams & {
  module?: string
  userNickname?: string
  type?: number
  success?: boolean
  // as select component doesn't accept a boolean as value
  _success?: string
  startTime?: [string, string]
}

export function getOperateLogPage(params?: ListQueryParams) {
  return request.get<OperateLogListVO>({
    url: '/system/operate-log/page',
    params
  })
}
