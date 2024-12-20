import type { Ref } from 'vue'
import type { Widget } from './index'
import type { AppSchema } from '..'

// 无论 Designer 还是 Renderer 均需要提供的状态
interface FuxCoreContext {
  formData: Ref<Record<string, any>>
  appSchema: Ref<AppSchema>
}

export interface FuxDesignerCtx extends FuxCoreContext {
  selectedWidget: Ref<Widget | undefined>
  deleteWidget: (uid: string) => void
  copyWidget: (widget: Widget) => void
}

export interface FuxRendererCtx extends FuxCoreContext {
  $state: Ref<Record<string, any>>
  mode?: 'audit' | 'prod'
}
