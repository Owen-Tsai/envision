import { computed } from 'vue'
import { set, get } from 'lodash-es'
import dateTransformer from '../_transformers/date'
import evalExpression from '../_utils/expression'
import { useFormDataInjection, useRendererInjection } from './use-context'
import type { Widget, FormWidget } from '@/types/fux-core/form'

const { toSubmitFormat, toWidgetFormat } = dateTransformer

const needTransform = (widget: Widget) => {
  return widget.type === 'datePicker' || widget.type === 'dateRangePicker'
}

export const useModel = (widget: Widget) => {
  const formDataCtx = useFormDataInjection()
  const key = widget.props.field?.name || widget.uid

  const model = computed({
    get: () => {
      if (!formDataCtx) return undefined
      const { formData } = formDataCtx
      if (needTransform(widget)) {
        return toWidgetFormat(get(formData.value, key), widget.props.valueFormat)
      } else {
        return get(formData.value, key)
      }
    },
    set: (val) => {
      if (needTransform(widget)) {
        val = toSubmitFormat(val, widget.props.submitFormat)
      }
      if (formDataCtx !== undefined) {
        const { formData } = formDataCtx
        set(formData.value, key, val)
      }
    }
  })

  return { model }
}

export const useDefaultValue = (config: FormWidget) => {
  const formCtx = useFormDataInjection()
  const rendererCtx = useRendererInjection()

  if (rendererCtx?.prod && formCtx) {
    const { $state } = rendererCtx
    if ((config.props as any).defaultValue) {
      const value = evalExpression((config.props as any).defaultValue, $state)
      formCtx.formData.value[config.props.field?.name || config.uid] = value
    }
  }
}
