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
  useString?: boolean
}

const prefix = '/system/dict-type'

export const getDictTypeList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<DictTypeVO>>({
    url: `${prefix}/page`,
    params
  })
}

export const getPlainDictTypeList = () => {
  return request.get<DictTypeVO[]>({
    url: `${prefix}/list-all-simple`
  })
}

export const getDictTypeDetail = (id: number) => {
  return request.get<DictTypeVO>({
    url: `${prefix}/get?id=${id}`
  })
}

export const addDictType = (data: DictTypeVO) => {
  return request.post({
    url: `${prefix}/create`,
    data
  })
}

export const updateDictType = (data: DictTypeVO) => {
  return request.put({
    url: `${prefix}/create`,
    data
  })
}

export const deleteDictType = (id: number) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`
  })
}
