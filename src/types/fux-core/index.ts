import type { FormSchema } from './form'
import type { FlowSchema } from './flow'

export interface AppInfo {
  // 分页情况
  paginated?: false | 'steps' | 'tabs'
  // 涉及的数据表
  tables: Array<{
    name: string
    comment?: string
    subTable?: boolean
    id: number | string
  }>
  // 布局列数
  gridColumns?: false | 2 | 3
}

export interface AppSchema {
  // Schema 版本，针对扩展与兼容设计的字段
  version: string
  // 表单 Schema
  form: FormSchema
  // 流程 Schema
  flow: FlowSchema
  // 应用信息
  info: AppInfo
}
