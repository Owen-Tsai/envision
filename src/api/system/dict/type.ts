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

export function getList(query: ListQueryParams) {
  console.log(query)
  return request.getRaw<ListVO>({
    url: '/system/dict/type/list',
    params: query
  })
}
