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
  isBusiness?: number
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
  dictTypeStr?: string
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

const url = '/admin-api/infra/codegen'
export const getTableDefList = (params: TableQueryParams) => {
  return request.get<TableDefListVO>({
    url: `${url}/db/table/list`,
    params,
  })
}

// get paginated list of code generation config entries
export const getCodeGenConfigList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<ConfigVO>>({
    url: `${url}/table/page`,
    params,
  })
}

// get plain list of code generation config entries
export const getPlainCodeGenConfigList = (dataSourceConfigId: number) => {
  return request.get<ConfigVO[]>({
    url: `${url}/table/list`,
    params: {
      dataSourceConfigId,
    },
  })
}

export const getCodeGenConfigDetail = (id: number) => {
  return request.get<ConfigDetailVO>({
    url: `${url}/detail?tableId=${id}`,
  })
}

export const createCodeGenConfig = (data: CodeGenCreateReqVO) => {
  return request.post({
    url: `${url}/create-list`,
    data,
  })
}

export const updateCodeGenConfig = (data: ConfigDetailVO) => {
  return request.put({
    url: `${url}/update`,
    data,
  })
}

export const deleteCodeGenConfig = (id: number) => {
  return request.delete({
    url: `${url}/delete?id=${id}`,
  })
}

// sync table from database
export const syncTable = (id: number) => {
  return request.put({
    url: `${url}/sync-from-db?tableId=${id}`,
  })
}

// preview code
export const previewCode = (id: number) => {
  return request.get<CodePreviewVO>({
    url: `${url}/preview?tableId=${id}`,
  })
}

// download generated code
export const downloadCode = (id: number) => {
  return request.download({
    url: `${url}/download`,
    params: {
      tableId: id,
    },
    filename: 'generated-code.zip',
  })
}
