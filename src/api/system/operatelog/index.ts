import request from '@/utils/request'

export type OperateLogVO = {
  id: number
  userNickname: string
  traceId: string
  userId: number
  module: string
  name: string
  type: number
  content: string
  exts: Map<String, Object>
  requestMethod: string
  requestUrl: string
  userIp: string
  userAgent: string
  javaMethod: string
  javaMethodArgs: string
  startTime: Date
  duration: number
  resultCode: number
  resultMsg: string
  resultData: string
}
export type OperateLogListVO = {
  list: Array<OperateLogVO>
  total: number
}

export type ListQueryParams = CommonQueryParams & {
  name?: string
  code?: string
  type?: number
  success?: number
}

export function getOperateLogPage(params?: ListQueryParams) {
  return request.get<OperateLogListVO>({
    url: '/system/operate-log/page',
    params
  })
}
