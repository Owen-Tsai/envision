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
  dictId?: number
  dictName: string
  dictType: string
  status: string
  remark?: string
}

const urlPrefix = '/system/dict/type'

export function getList(query: ListQueryParams) {
  return request.getRaw<ListVO>({
    url: `${urlPrefix}/list`,
    params: query
  })
}

export function getDetail(id: number) {
  return request.get<ListItemVO>({
    url: `${urlPrefix}/${id}`
  })
}

export function addType(data: TypeDTO) {
  return request.post({
    url: urlPrefix,
    data
  })
}

export function updateType(data: TypeDTO) {
  return request.put({
    url: urlPrefix,
    data
  })
}
