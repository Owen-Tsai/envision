import type { FormSchema } from '@/types/workflow/form'
import type { FlowSchema } from '@/types/workflow/flow'

export type Schema = {
  version: string
  form: FormSchema
  flow: FlowSchema
}
