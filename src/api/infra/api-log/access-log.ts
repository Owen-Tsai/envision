import request from '@/utils/request'

export type AccessLogVO = {
  id?: number
  traceId?: string
  userId?: number
  userType?: number
  applicationName?: string
  requestMethod?: string
  requestParams?: string
  requestUrl?: string
  userIp?: string
  userAgent?: string
  beginTime?: Date
  endTime?: Date
  duration?: number
  resultCode?: number
  resultMsg?: string
  createTime?: Date
}

export type ListQueryParams = CommonQueryParams & {
  userId?: number
  applicationName?: string
  requestMethod?: string
  resultCode?: string
  requestUrl?: string
  beginTime?: [string, string]
}

export const getList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<AccessLogVO>>({
    url: '/infra/api-access-log/page',
    params
  })
}

export const exportLog = (params?: ListQueryParams) => {
  return request.download({
    url: '/infra/api-access-log/export-excel',
    params,
    filename: 'API访问日志.xlsx'
  })
}
