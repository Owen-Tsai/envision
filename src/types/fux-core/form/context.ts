import type { Ref } from 'vue'
import type { FormSchema, Widget } from './index'
import type { AppSchema } from '..'

export interface FormDataCtx {
  formData: Ref<Record<string, any>>
}

export interface FormDesignerCtx {
  schema: Ref<FormSchema>
  selectedWidget: Ref<Widget | undefined>
  deleteWidget: (uid: string) => void
  copyWidget: (widget: Widget) => void
}

export interface FormRendererCtx {
  prod?: boolean
  $state: Ref<Record<string, any>>
  appSchema: Ref<AppSchema>
}
