import request from '@/utils/request'

export type ListQueryParams = CommonQueryParams & {
  dictName?: string
  dictType?: string
  status?: string | number
}

export type ListItemVO = {
  dictId: number
  dictName: string
  dictType: string
  remark: string
  status: string
  createTime: string
}

export type ListVO = {
  rows: Array<ListItemVO>
  total: number
}

export type TypeDTO = {
  dictName: string
  dictType: string
  status: string
  remark?: string
}

export function getList(query: ListQueryParams) {
  return request.getRaw<ListVO>({
    url: '/system/dict/type/list',
    params: query
  })
}

export function addType(data: TypeDTO) {
  return request.post({
    url: '/system/dict/type',
    data
  })
}

export function updateType(data: TypeDTO) {
  return request.put({
    url: '/system/dict/type',
    data
  })
}
