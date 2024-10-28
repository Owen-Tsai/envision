import { provide, inject, ref, type Ref } from 'vue'
import { FORM_DATA_KEY, DESIGNER_KEY, RENDERER_KEY, WORKFLOW_KEY } from '../_utils/const'
import { deleteWidgetByUid, copyWidget as copy } from '../_utils/widget'
import type { FormSchema, Widget } from '@/types/fux-core/form'
import type { FlowSchema, Node, NodeConfigMap } from '@/types/fux-core/flow'
import type { FormDataCtx, FormDesignerCtx, FormRendererCtx } from '@/types/fux-core/form/context'
import type { WorkflowDesignerCtx } from '@/types/fux-core/flow/context'

export const useFormDataProvider = (formData: Ref<Record<string, any>>) => {
  provide<FormDataCtx>(FORM_DATA_KEY, { formData })
}

export const useFormDataInjection = () => {
  return inject<FormDataCtx>(FORM_DATA_KEY)!
}

export const useDesignerProvider = (schema: Ref<FormSchema>) => {
  const selectedWidget = ref<Widget | undefined>()

  const deleteWidget = (uid: string) => {
    if (schema.value?.widgets) {
      deleteWidgetByUid(schema.value.widgets, uid)
      selectedWidget.value = undefined
    }
  }

  const copyWidget = (widget: Widget) => {
    if (schema.value?.widgets) {
      copy(widget, schema.value.widgets)
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

export const useRendererProvider = (state: Ref<Record<string, any>>) => {
  provide<FormRendererCtx>(RENDERER_KEY, {
    prod: true,
    $state: state
  })
}

export const useRendererInjection = () => {
  return inject<FormRendererCtx>(RENDERER_KEY)
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
