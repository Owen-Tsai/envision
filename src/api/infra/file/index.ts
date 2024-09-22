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

export type FilePresignedRespVO = {
  configId: number
  uploadUrl: string
  url: string
}

export type FileUploadVO = {
  file: File
}

export const getFileList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<FileVO>>({
    url: '/infra/file/page',
    params
  })
}

export const createFile = (data: FileVO) => {
  return request.post({
    url: '/infra/file/create',
    data
  })
}

export const uploadFile = (data: any) => {
  return request.upload({
    url: '/infra/file/upload',
    data
  })
}

export const deleteFile = (id?: number) => {
  return request.delete({
    url: `/infra/file/delete?id=${id}`
  })
}

// 获取文件预签名地址
export const getFilePresignedUrl = (path: string) => {
  return request.get<FilePresignedRespVO>({
    url: `/infra/file/presigned-url`,
    params: {
      path
    }
  })
}
