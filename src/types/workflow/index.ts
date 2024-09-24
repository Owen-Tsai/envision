import type { Ref } from 'vue'
import type { FormSchema } from '@/types/workflow/form'
import type { FlowSchema } from '@/types/workflow/flow'

export const formModelCtxKey = Symbol('formModel')

export type FormModelContext = {
  formData: Ref<Record<string, any> | Array<Record<string, any>>>
  schema: Schema
}

export type DataSourceInfo = {
  tables: {
    name: string
    comment?: string
    subTable?: boolean
  }[]
  paginated?: false | 'tabs' | 'steps'
  column?: false | 2 | 3
  dataSourceConfigId: number
}

export type Schema = {
  // Schema 版本，针对扩展与兼容设计的字段
  version: string
  // 表单 Schema
  form: FormSchema
  // 流程 Schema
  flow: FlowSchema
  // 应用信息
  info: DataSourceInfo
}
