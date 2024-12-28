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

const url = '/admin-api/infra/job'

export const getJobList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<JobVO>>({
    url: `${url}/page`,
    params,
  })
}

export const getJobDetail = (id: number) => {
  return request.get<JobVO>({
    url: `${url}/get?id=${id}`,
  })
}

export const createJob = (data: JobVO) => {
  return request.post({
    url: `${url}/create`,
    data,
  })
}

export const updateJob = (data: JobVO) => {
  return request.put({
    url: `${url}/update`,
    data,
  })
}

export const deleteJob = (id: number) => {
  return request.delete({
    url: `${url}/delete?id=${id}`,
  })
}

export const exportJobList = (params: ListQueryParams) => {
  return request.download({
    url: `${url}/export-excel`,
    params,
    filename: '定时任务.xlsx',
  })
}

export const updateJobStatus = (id: number, status: number) => {
  return request.put({
    url: `${url}/update-status`,
    params: {
      id,
      status,
    },
  })
}

export const runJob = (id: number) => {
  return request.put({
    url: `${url}/trigger?id=${id}`,
  })
}

export const getJobScheduledTimes = (id: number) => {
  return request.get<number[]>({
    url: `${url}/get_next_times?id=${id}`,
  })
}
