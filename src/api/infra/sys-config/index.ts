import request from '@/utils/request'

export type SysConfigVO = {
  id?: number
  category?: string
  createTime?: number
  key?: string
  name?: string
  remark?: string
  type?: number
  value?: string
  visible?: boolean
}

export type ListQueryParams = CommonQueryParams & {
  name?: string
  key?: string
  type?: number
}

export const getConfigList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<SysConfigVO>>({
    url: '/infra/config/page',
    params
  })
}

export const getDetail = (id: number) => {
  return request.get<SysConfigVO>({
    url: `/infra/config/get?id=${id}`
  })
}

export const addConfig = (data: SysConfigVO) => {
  return request.post({
    url: '/infra/config/create',
    data
  })
}

export const updateConfig = (data: SysConfigVO) => {
  return request.put({
    url: '/infra/config/update',
    data
  })
}

export const deleteConfig = (id: number) => {
  return request.delete({
    url: `/infra/config/delete?id=${id}`
  })
}
