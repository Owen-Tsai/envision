import request from '@/utils/request'

export type LoginLogVO = {
  id?: number
  logType?: number
  traceId?: number
  userId?: number
  userType?: number
  username?: string
  result?: number
  status?: number
  userIp?: string
  userAgent?: string
  createTime?: Date
}

export type ListQueryParams = CommonQueryParams & {
  username?: string
  userIp?: string
}

export function getLoginLogPage(params?: ListQueryParams) {
  return request.get<PaginatedList<LoginLogVO>>({
    url: '/admin-api/system/login-log/page',
    params,
  })
}
