import request from '@/utils/request'

export type AttachClassVO = {
  id?: string
  name?: string
  allowFileType?: string
  maxFileSize?: string
  modeName?: string
  ismust?: number
  isLib?: number
  createTime?: string
}

export type ListQueryParams = {
  name?: string
  modeName?: string
} & CommonQueryParams

const url = '/admin-api/attach/type'

export const getAttachClassList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<AttachClassVO>>({
    url: `${url}/page`,
    params,
  })
}

export const createAttachClass = (data: AttachClassVO) => {
  return request.post({
    url: `${url}/create`,
    data,
  })
}

export const updateAttachClass = (data: AttachClassVO) => {
  return request.put({
    url: `${url}/update`,
    data,
  })
}

export const deleteAttachClass = (id: string) => {
  return request.delete({
    url: `${url}/delete?id=${id}`,
  })
}

export const getAttachClassDetail = (id: string) => {
  return request.get<AttachClassVO>({
    url: `${url}/get?id=${id}`,
  })
}
