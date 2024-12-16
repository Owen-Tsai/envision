import request from '@/utils/request'

export type ErrorLogVO = {
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
  exceptionTime?: Date
  exceptionName?: string
  exceptionMessage?: string
  exceptionRootCauseMessage?: string
  exceptionStackTrace?: string
  exceptionClassName?: string
  exceptionFileName?: string
  exceptionMethodName?: string
  exceptionLineNumber?: number
  processUserId?: number
  processStatus?: number
  processTime?: Date
  resultCode?: number
  createTime?: Date
}

export type ListQueryParams = CommonQueryParams & {
  userId?: number
  applicationName?: string
  requestMethod?: string
  requestUrl?: string
  processStatus?: number
  exceptionTime?: [string, string]
}

export const getList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<ErrorLogVO>>({
    url: '/admin-api/infra/api-error-log/page',
    params,
  })
}

export const exportLog = (params?: ListQueryParams) => {
  return request.download({
    url: '/admin-api/infra/api-error-log/export-excel',
    params,
    filename: 'API错误日志.xlsx',
  })
}

export const setProcessStatus = (id: number, status: number) => {
  return request.put({
    url: '/admin-api/infra/api-error-log/update-status',
    params: {
      id,
      processStatus: status,
    },
  })
}
