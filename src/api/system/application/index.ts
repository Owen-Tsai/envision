import request from '@/utils/request'

export type ApplicationVO = {
  id?: string
  name?: string
  type?: string
  code?: string // 业务标志？
  dept?: string
  sort?: number
  createTime?: string
  updateTime?: string
  published?: number
  description?: string
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

export const getApplicationDetail = (id: string) => {
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

export const deleteApplication = (id: string) => {
  return request.delete({
    url: `/system/application/delete?id=${id}`
  })
}

export const setPublished = (id: string, published: number) => {
  return request.put({
    url: `/system/application/published?id=${id}&published=${published}`
  })
}
