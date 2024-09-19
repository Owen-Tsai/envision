import request from '@/utils/request'

export type DictDataItemVO = {
  colorType: string
  cssClass: string
  createTime: number
  dictType: string
  id: number
  value: string
  label: string
  remark: string
  sort: number
  status: number
  useString?: boolean
}

export type DictDataEntry = Omit<DictDataItemVO, 'value'> & {
  value: number | string
}

export type DictDataVO = Array<DictDataItemVO>

export type ListQueryParams = CommonQueryParams & {
  name?: string
  dictType?: string
  label?: string
  status?: number
}

/**
 * This method is used for `useDict` hooks and related components/utilities,
 * thus does not accept arguments.
 *
 * Use `getDictDataList` for query and list dict data instead
 */
export const getDictData = (dictType: string) => {
  return request.get<DictDataVO>({
    url: `/system/dict-data/dict-list?type=${dictType}`
  })
}

export const getDictDataList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<DictDataItemVO>>({
    url: '/system/dict-data/page',
    params
  })
}

export const getDictDataDetail = (id: number) => {
  return request.get<DictDataItemVO>({
    url: `/system/dict-data/get?id=${id}`
  })
}

export const addDictData = (data: Partial<DictDataItemVO>) => {
  return request.post({
    url: '/system/dict-data/create',
    data
  })
}

export const updateDictData = (data: Partial<DictDataItemVO>) => {
  return request.put({
    url: '/system/dict-data/update',
    data
  })
}

export const deleteDictData = (id: number) => {
  return request.delete({
    url: `/system/dict-data/delete?id=${id}`
  })
}
