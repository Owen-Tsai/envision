import { provide, inject, ref, type Ref } from 'vue'
import { FORM_DATA_KEY, DESIGNER_KEY, RENDERER_KEY } from '../_utils/const'
import { deleteWidgetByUid, copyWidget as copy } from '../_utils/widget'
import type { FormSchema, Widget } from '@/types/fux-core'
import type { FormDataCtx, FormDesignerCtx, FormRendererCtx } from '@/types/fux-core/context'

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
