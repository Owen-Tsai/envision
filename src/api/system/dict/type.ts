import request from '@/utils/request'

export type ListQueryParams = CommonQueryParams & {
  name?: string
  type?: string
  status?: string | number
}

export type DictTypeVO = {
  id?: number
  name?: string
  type?: string
  remark?: string
  status?: string | number
  createTime?: string
}

export const getDictTypeList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<DictTypeVO>>({
    url: '/system/dict-type/page',
    params
  })
}

export const getDictTypeDetail = (id: number) => {
  return request.get<DictTypeVO>({
    url: `/system/dict-type/get?id=${id}`
  })
}

export const addDictType = (data: DictTypeVO) => {
  return request.post({
    url: '/system/dict-type/create',
    data
  })
}

export const updateDictType = (data: DictTypeVO) => {
  return request.put({
    url: '/system/dict-type/create',
    data
  })
}

export const deleteDictType = (id: number) => {
  return request.delete({
    url: `/system/dict-type/get?id=${id}`
  })
}
