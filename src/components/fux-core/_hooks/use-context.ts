import { provide, inject, ref, type Ref } from 'vue'
import { injectLocal, provideLocal } from '@vueuse/core'
import { FORM_DATA_KEY, DESIGNER_KEY, RENDERER_KEY, WORKFLOW_KEY, MODEL_KEY } from '../_utils/const'
import { deleteWidgetByUid, copyWidget as copy } from '../_utils/widget'
import type { Widget } from '@/types/fux-core/form'
import type { FlowSchema, Node } from '@/types/fux-core/flow'
import type { FormDataCtx, FormDesignerCtx, FormRendererCtx } from '@/types/fux-core/form/context'
import type { WorkflowDesignerCtx } from '@/types/fux-core/flow/context'
import type { AppSchema } from '@/types/fux-core'

export const useFormDataProvider = (formData: Ref<Record<string, any>>) => {
  provideLocal<FormDataCtx>(FORM_DATA_KEY, { formData })
}

export const useFormDataInjection = () => {
  return injectLocal<FormDataCtx>(FORM_DATA_KEY)!
}

export const useDesignerProvider = (schema: Ref<AppSchema>) => {
  const selectedWidget = ref<Widget | undefined>()

  const deleteWidget = (uid: string) => {
    if (schema.value.form.widgets) {
      deleteWidgetByUid(schema.value.form.widgets, uid)
      selectedWidget.value = undefined
    }
  }

  const copyWidget = (widget: Widget) => {
    if (schema.value.form.widgets) {
      copy(widget, schema.value.form.widgets)
    }
  }

  provide<FormDesignerCtx>(DESIGNER_KEY, {
    schema,
    deleteWidget,
    copyWidget,
    selectedWidget
  })

  return {
    schema
  }
}

export const useDesignerInjection = () => {
  return inject<FormDesignerCtx>(DESIGNER_KEY)!
}

export const useRendererProvider = (appSchema: Ref<AppSchema>, state: Ref<Record<string, any>>) => {
  provideLocal<FormRendererCtx>(RENDERER_KEY, {
    prod: true,
    $state: state,
    appSchema
  })
}

export const useRendererInjection = () => {
  return injectLocal<FormRendererCtx>(RENDERER_KEY)
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
    deleteNode
  })

  return {
    selectedNode
  }
}

export const useWorkflowCtxInjection = () => {
  return inject<WorkflowDesignerCtx>(WORKFLOW_KEY)!
}

export const useModelProvider = (model: Ref<Record<string, any>>) => {
  provide(MODEL_KEY, {
    formData: model
  })
}

export const useModelInjection = () => {
  return inject<FormDataCtx>(MODEL_KEY)
}
