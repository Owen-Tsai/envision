import request from '@/utils/request'

export type ConfigVO = {
  id?: number
  tableId?: number
  isParentMenuIdValid?: boolean
  dataSourceConfigId?: number
  scene?: number
  tableName?: string
  tableComment?: string
  remark?: string
  moduleName?: string
  businessName?: string
  className?: string
  classComment?: string
  author?: string
  createTime?: number
  updateTime?: number
  templateType?: number
  parentMenuId?: number
}

export type ColumnVO = {
  id: number
  tableId: number
  columnName: string
  dataType: string
  columnComment: string
  nullable: number
  primaryKey: number
  autoIncrement: boolean
  ordinalPosition: number
  javaType: string
  javaField: string
  dictType: string
  example: string
  createOperation: number
  updateOperation: number
  listOperation: number
  listOperationCondition: string
  listOperationResult: number
  htmlType: string
}

export type ListQueryParams = CommonQueryParams & {
  tableName?: string
  tableComment?: string
}

export type TableQueryParams = {
  dataSourceConfigId?: number
  name?: string
  comment?: string
}

export type CodeGenCreateReqVO = {
  dataSourceConfigId: number
  tableNames: string[]
}

export type CodeGenUpdateReqVO = {
  table: ConfigVO
  columns: Array<ColumnVO>
}

export type TableDefListVO = Array<{
  name: string
  comment: string
}>

// get tables from database based on `dataSourceId`
export const getTableDefList = (dataSourceId: number) => {
  return request.get({
    url: `/infra/codegen/table/list?dataSourceConfigId=${dataSourceId}`
  })
}

// get paginated list of code generation config entries
export const getCodeGenConfigList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<ConfigVO>>({
    url: '/infra/codegen/table/page',
    params
  })
}

export const getCodeGenConfigDetail = (id: number) => {
  return request.get<ConfigVO>({
    url: `/infra/codegen/table/get?id=${id}`
  })
}

export const createCodeGenConfig = (data: CodeGenCreateReqVO) => {
  return request.post({
    url: '/infra/codegen/create',
    data
  })
}

export const updateCodeGenConfig = (data: CodeGenUpdateReqVO) => {
  return request.put({
    url: '/infra/codegen/update',
    data
  })
}

export const deleteCodeGenConfig = (id: number) => {
  return request.delete({
    url: `/infra/codegen/table/delete?id=${id}`
  })
}

// sync table from database
export const syncTable = (id: number) => {
  return request.put({
    url: `/infra/codegen/sync-from-db?tableId=${id}`
  })
}
