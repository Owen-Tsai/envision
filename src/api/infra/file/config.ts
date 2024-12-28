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

const url = '/admin-api/infra/file-config'

export const getConfigList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<FileConfigVO>>({
    url: `${url}/page`,
    params,
  })
}

export const getDetail = (id: number) => {
  return request.get<FileConfigVO>({
    url: `${url}/get?id=${id}`,
  })
}

export const addConfig = (data: FileConfigVO) => {
  return request.post({
    url: `${url}/create`,
    data,
  })
}

export const updateConfig = (data: FileConfigVO) => {
  return request.put({
    url: `${url}/update`,
    data,
  })
}

export const deleteConfig = (id: number) => {
  return request.delete({
    url: `${url}/delete?id=${id}`,
  })
}

export const testConfig = (id: number) => {
  return request.get<string>({
    url: `${url}/test?id=${id}`,
  })
}
