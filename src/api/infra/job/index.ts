import request from '@/utils/request'

export type JobVO = {
  createTime?: number
  cronExpression?: string
  handlerName?: string
  handlerParam?: string
  id?: number
  monitorTimeout?: number
  name?: string
  retryCount?: number
  retryInterval?: number
  status?: number
}

export type ListQueryParams = CommonQueryParams & {
  name?: string
  handlerName?: string
  status?: number
}

export const getJobList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<JobVO>>({
    url: '/infra/job/page',
    params
  })
}

export const getJobDetail = (id: number) => {
  return request.get<JobVO>({
    url: `/infra/job/get?id=${id}`
  })
}

export const createJob = (data: JobVO) => {
  return request.post({
    url: `/infra/job/create`,
    data
  })
}

export const updateJob = (data: JobVO) => {
  return request.put({
    url: `/infra/job/update`,
    data
  })
}

export const deleteJob = (id: number) => {
  return request.delete({
    url: `/infra/job/delete?id=${id}`
  })
}

export const exportJobList = (params: ListQueryParams) => {
  return request.download('/infra/job/export-excel', params, '定时任务')
}

export const updateJobStatus = (id: number, status: number) => {
  return request.put({
    url: '/infra/job/update-status',
    params: {
      id,
      status
    }
  })
}

export const runJob = (id: number) => {
  return request.put({
    url: `/infra/job/trigger?id=${id}`
  })
}

export const getJobScheduledTimes = (id: number) => {
  return request.get<number[]>({
    url: `/infra/job/get_next_times?id=${id}`
  })
}
