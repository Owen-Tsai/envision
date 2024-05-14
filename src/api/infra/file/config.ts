import request from '@/utils/request'

export type ListQueryParams = CommonQueryParams & {
  name?: string
  storage?: number
}

export type FileClientConfig = {
  basePath?: string
  host?: string
  port?: number
  username?: string
  password?: string
  mode?: string
  endpoint?: string
  bucket?: string
  accessKey?: string
  accessSecret?: string
  domain?: string
}

export type FileConfigVO = {
  id?: number
  name?: string
  storage?: number
  master?: boolean
  visible?: boolean
  config?: FileClientConfig
  remark?: string
  createTime?: string
}

export const getConfigList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<FileConfigVO>>({
    url: '/infra/file-config/page',
    params
  })
}

export const getDetail = (id: number) => {
  return request.get<FileConfigVO>({
    url: `/infra/file-config/get?id=${id}`
  })
}

export const addConfig = (data: FileConfigVO) => {
  return request.post({
    url: '/infra/file-config/create',
    data
  })
}

export const updateConfig = (data: FileConfigVO) => {
  return request.put({
    url: '/infra/file-config/update',
    data
  })
}

export const deleteConfig = (id: number) => {
  return request.delete({
    url: `/infra/file-config/delete?id=${id}`
  })
}
