import request from '@/utils/request'

export type AttachClassVO = {
  id?: string
  name?: string
  allowFileType?: string
  maxFileSize: number
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
  const data2 = data
  data2.maxFileSize = data2.maxFileSize * 1024 * 1024
  return request.post({
    url: `${url}/create`,
    data: data2,
  })
}

export const updateAttachClass = (data: AttachClassVO) => {
  const data2 = data
  data2.maxFileSize = data2.maxFileSize * 1024 * 1024
  return request.put({
    url: `${url}/update`,
    data: data2,
  })
}

export const deleteAttachClass = (id: string) => {
  return request.delete({
    url: `${url}/delete?id=${id}`,
  })
}

export const getAttachClassDetail = async (id: string) => {
  const data = await request.get<AttachClassVO>({
    url: `${url}/get?id=${id}`,
  })
  console.log(data)
  data.maxFileSize = data.maxFileSize / 1024 / 1024
  return data
}
