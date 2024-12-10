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
  exts?: Map<string, object>
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

export type ListQueryParams = CommonQueryParams & {
  module?: string
  userNickname?: string
  type?: number
  success?: string
  startTime?: [string, string]
}

export function getOperateLogPage(params?: ListQueryParams) {
  return request.get<PaginatedList<OperateLogVO>>({
    url: '/admin-api/system/operate-log/page',
    params
  })
}
