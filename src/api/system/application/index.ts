import request from '@/utils/request'

export type ApplicationVO = {
  id?: number
  name?: string
  type?: string
  createTime?: string
  updateTime?: string
  published?: number
  remark?: string
}

export type ListQueryParams = {
  name?: string
  type?: string
  published?: number
  createTime?: string
  updateTime?: string
} & CommonQueryParams

export const getApplicationList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<ApplicationVO>>({
    url: '/system/application/page',
    params
  })
}

export const getApplicationDetail = (id: number) => {
  return request.get<ApplicationVO>({
    url: `/system/application/get?id=${id}`
  })
}

export const addApplication = (data: ApplicationVO) => {
  return request.post({
    url: '/system/application/create',
    data
  })
}

export const updateApplication = (data: ApplicationVO) => {
  return request.put({
    url: '/system/application/create',
    data
  })
}

export const deleteApplication = (id: number) => {
  return request.delete({
    url: `/system/application/delete?id=${id}`
  })
}
