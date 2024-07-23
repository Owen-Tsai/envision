import request from '@/utils/request'

export type ConfigVO = {
  id?: number
  tableId?: number
  masterTableId?: number
  subJoinColumnId?: number
  subJoinMany?: boolean
  treeNameColumnId?: number
  treeParentColumnId?: number
  isParentMenuIdValid?: boolean
  parentMenuId?: number
  dataSourceConfigId?: number
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
  frontType?: number
  scene?: number
}

export type ColumnVO = {
  id?: number
  tableId?: number
  columnName?: string
  dataType?: string
  columnComment?: string
  nullable?: boolean
  primaryKey?: boolean
  autoIncrement?: boolean
  ordinalPosition?: number
  javaType?: string
  javaField?: string
  dictType?: string
  example?: string
  createOperation?: boolean
  updateOperation?: boolean
  listOperation?: boolean
  listOperationCondition?: string
  listOperationResult?: boolean
  htmlType?: string
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

export type ConfigDetailVO = {
  table: ConfigVO
  columns: Array<ColumnVO>
}

export type TableDefListVO = Array<{
  name: string
  comment: string
}>

export type CodePreviewVO = Array<{
  filePath: string
  code: string
}>

export const getTableDefList = (params: TableQueryParams) => {
  return request.get<TableDefListVO>({
    url: '/infra/codegen/db/table/list',
    params
  })
}

// get paginated list of code generation config entries
export const getCodeGenConfigList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<ConfigVO>>({
    url: '/infra/codegen/table/page',
    params
  })
}

// get plain list of code generation config entries
export const getPlainCodeGenConfigList = (dataSourceConfigId: number) => {
  return request.get<ConfigVO[]>({
    url: '/infra/codegen/table/list',
    params: {
      dataSourceConfigId
    }
  })
}

export const getCodeGenConfigDetail = (id: number) => {
  return request.get<ConfigDetailVO>({
    url: `/infra/codegen/detail?tableId=${id}`
  })
}

export const createCodeGenConfig = (data: CodeGenCreateReqVO) => {
  return request.post({
    url: '/infra/codegen/create-list',
    data
  })
}

export const updateCodeGenConfig = (data: ConfigDetailVO) => {
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

// preview code
export const previewCode = (id: number) => {
  return request.get<CodePreviewVO>({
    url: `/infra/codegen/preview?tableId=${id}`
  })
}

// download generated code
export const downloadCode = (id: number) => {
  return request.download({
    url: '/infra/codegen/download',
    params: {
      tableId: id
    },
    filename: 'generated-code.zip'
  })
}
