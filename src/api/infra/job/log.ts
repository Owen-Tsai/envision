import request from '@/utils/request'

export type JobLogVO = {
  jobId?: number
  handlerName?: string
  handlerParam?: string
  executeIndex?: number
  beginTime?: number
  endTime?: number
  duration?: number
  status?: number
  result?: string
  id?: number
  createTime?: number
}

export type ListQueryParams = CommonQueryParams & {
  handlerName?: string
  beginTime?: string
  endTime?: string
  status?: number
}

export const getList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<JobLogVO>>({
    url: '/infra/job-log/page',
    params
  })
}

export const exportLog = (params?: ListQueryParams) => {
  return request.download({
    url: '/system/job-log/export-excel',
    params,
    filename: '定时任务执行日志.xlsx'
  })
}
