import { DESIGNER_KEY, RENDERER_KEY, WORKFLOW_KEY, NESTED_MODEL_KEY } from '../_utils/const'
import { deleteWidgetByUid, copyWidget as copy } from '../_utils/widget'
import type { Widget } from '@/types/fux-core/form'
import type { FlowSchema, Node } from '@/types/fux-core/flow'
import type { FuxDesignerCtx, FuxRendererCtx } from '@/types/fux-core/form/context'
import type { WorkflowDesignerCtx } from '@/types/fux-core/flow/context'
import type { AppSchema } from '@/types/fux-core'

export const useDesignerProvider = (appSchema: Ref<AppSchema>) => {
  const selectedWidget = ref<Widget | undefined>()
  const formData = ref<Record<string, any>>({})

  const deleteWidget = (uid: string) => {
    if (appSchema.value.form.widgets) {
      deleteWidgetByUid(appSchema.value.form.widgets, uid)
      selectedWidget.value = undefined
    }
  }

  const copyWidget = (widget: Widget) => {
    if (appSchema.value.form.widgets) {
      copy(widget, appSchema.value.form.widgets)
    }
  }

  provide<FuxDesignerCtx>(DESIGNER_KEY, {
    appSchema,
    deleteWidget,
    copyWidget,
    selectedWidget,
    formData,
  })
}

export const useDesignerInjection = () => {
  return inject<FuxDesignerCtx | null>(DESIGNER_KEY, null)
}

export const useRendererProvider = (
  appSchema: Ref<AppSchema>,
  formData: Ref<Record<string, any>>,
  state: Ref<Record<string, any>>,
  auditMode?: boolean,
) => {
  provideLocal<FuxRendererCtx>(RENDERER_KEY, {
    $state: state,
    appSchema,
    mode: auditMode ? 'audit' : 'prod',
    formData,
  })
}

export const useRendererInjection = () => {
  return injectLocal<FuxRendererCtx | null>(RENDERER_KEY, null)
}

export const useWorkflowCtxProvider = (schema: Ref<FlowSchema>) => {
  const selectedNode = ref<Node | undefined>()

  /**
   * TODO: currently only supports plain array structure without conditonal node
   * @param uid uid of the node to be deleted
   */
  const deleteNode = (uid: string) => {
    const idx = schema.value.nodes.findIndex((e) => e.uid === uid)
    if (idx > -1) {
      schema.value.nodes.splice(idx, 1)
    }
  }

  provide<WorkflowDesignerCtx>(WORKFLOW_KEY, {
    schema,
    selectedNode,
    deleteNode,
  })

  return {
    selectedNode,
  }
}

export const useWorkflowCtxInjection = () => {
  return inject<WorkflowDesignerCtx>(WORKFLOW_KEY)!
}

export const useNestedModelProvider = (model: Ref<Record<string, any>>) => {
  provide(NESTED_MODEL_KEY, {
    formData: model,
  })
}

export const useNestedModelInjection = () => {
  return inject<{ formData: Ref<Record<string, any>> } | null>(NESTED_MODEL_KEY, null)
}
