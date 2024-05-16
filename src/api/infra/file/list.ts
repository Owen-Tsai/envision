import request from '@/utils/request'

export type ListQueryParams = CommonQueryParams & {
  path?: string
  type?: string
}

export type FileVO = {
  id?: number
  configId?: number // file-config id
  path?: string
  type?: string
  name?: string
  url?: string // fullpath
  size?: number
  createTime?: number
}

export const getFileList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<FileVO>>({
    url: '/infra/file/page',
    params
  })
}

export const deleteFile = (id?: number) => {
  return request.delete({
    url: `/infra/file/delete?id=${id}`
  })
}
