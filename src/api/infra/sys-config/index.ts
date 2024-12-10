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

const url = '/admin-api/infra/config'

export const getConfigList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<SysConfigVO>>({
    url: `${url}/page`,
    params
  })
}

export const getDetail = (id: number) => {
  return request.get<SysConfigVO>({
    url: `${url}/get?id=${id}`
  })
}

export const addConfig = (data: SysConfigVO) => {
  return request.post({
    url: `${url}/create`,
    data
  })
}

export const updateConfig = (data: SysConfigVO) => {
  return request.put({
    url: `${url}/update`,
    data
  })
}

export const deleteConfig = (id: number) => {
  return request.delete({
    url: `${url}/delete?id=${id}`
  })
}
