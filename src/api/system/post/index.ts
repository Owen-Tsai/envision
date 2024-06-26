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

export function getPostPage(params?: ListQueryParams) {
  return request.get<PaginatedList<PostVO>>({
    url: '/system/post/page',
    params
  })
}

export const getPostDetail = (id: number) => {
  return request.get<PostVO>({
    url: `/system/post/get?id=${id}`
  })
}

export const createPost = (data: PostVO) => {
  return request.post({
    url: '/system/post/create',
    data
  })
}

export const updatePost = (data: PostVO) => {
  return request.put({
    url: '/system/post/update',
    data
  })
}

export const deletePost = (id: number) => {
  return request.delete({
    url: `/system/post/delete?id=${id}`
  })
}
