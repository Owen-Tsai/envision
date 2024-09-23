import type { FormSchema } from '@/types/workflow/form'
import type { FlowSchema } from '@/types/workflow/flow'

export type Schema = {
  // Schema 版本，针对扩展与兼容设计的字段
  version: string
  // 表单 Schema
  form: FormSchema
  // 流程 Schema
  flow: FlowSchema
  // 应用信息
  info: {
    // 应用表单是否分步骤填写/提交
    paginated?: boolean
    // 应用所涉及的表名
    tables: string[]
  }
}
