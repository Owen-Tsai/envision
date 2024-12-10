import request from '@/utils/request'

export type PostVO = {
  code?: string
  createTime?: string
  id?: number
  name?: string
  remark?: string
  sort?: number
  status?: number
}

export type ListQueryParams = CommonQueryParams & {
  name?: string
  code?: string
}

const prefix = '/system/post'

export function getPostPage(params?: ListQueryParams) {
  return request.get<PaginatedList<PostVO>>({
    url: `${prefix}/page`,
    params
  })
}

export const getPostDetail = (id: number) => {
  return request.get<PostVO>({
    url: `${prefix}/get?id=${id}`
  })
}

export const createPost = (data: PostVO) => {
  return request.post({
    url: `${prefix}/create`,
    data
  })
}

export const updatePost = (data: PostVO) => {
  return request.put({
    url: `${prefix}/update`,
    data
  })
}

export const deletePost = (id: number) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`
  })
}
