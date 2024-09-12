import request from '@/utils/request'
import type { ColumnVO } from '@/api/infra/code-gen'

export type ApplicationVO = {
  id?: string
  name?: string
  type?: string
  code?: string // 业务标志？
  dept?: string
  sort?: number
  createTime?: string
  updateTime?: string
  published?: number
  description?: string
}

export type ListQueryParams = {
  name?: string
  type?: string
  published?: number
  createTime?: string
  updateTime?: string
} & CommonQueryParams

export type TableVO = {
  tableName: string
  tableComment?: string
}

export type TableColumnsVO = {
  table: string
  tableComment?: string
  columns: ColumnVO[]
}

const url = '/system/application'

export const getApplicationList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<ApplicationVO>>({
    url: `${url}/page`,
    params
  })
}

export const getApplicationDetail = (id: string) => {
  return request.get<ApplicationVO>({
    url: `${url}/get?id=${id}`
  })
}

export const addApplication = (data: ApplicationVO) => {
  return request.post({
    url: `${url}/create`,
    data
  })
}

export const updateApplication = (data: ApplicationVO) => {
  return request.put({
    url: `${url}/create`,
    data
  })
}

export const deleteApplication = (id: string) => {
  return request.delete({
    url: `${url}/delete?id=${id}`
  })
}

export const setPublished = (id: string, published: number) => {
  return request.put({
    url: `${url}/published?id=${id}&published=${published}`
  })
}

export const getTables = (dataSourceConfigId?: number) => {
  return request.get<TableVO[]>({
    url: `${url}/get-tables`,
    params: {
      dataSourceConfigId: dataSourceConfigId || 0
    }
  })
}

export const getTableColumns = (tables: string[]) => {
  return request.get<TableColumnsVO[]>({
    url: `${url}/get-table-fields`,
    params: { tables, dataSourceConfigId: 0 }
  })
}
