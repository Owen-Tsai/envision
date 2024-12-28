import { computed, watch } from 'vue'
import { set, get } from 'lodash-es'
import date from '../_transformers/date'
import evalExpression from '../_utils/expression'
import { useRendererInjection, useNestedModelInjection } from './use-context'
import type { Widget, FormWidget, WidgetMap } from '@/types/fux-core/form'

const { requireTransform, toSubmitValue, toWidgetValue } = date

export const useModel = (widget: Widget) => {
  const formDataCtx = useNestedModelInjection() || useRendererInjection()
  const key = widget.props.field?.name || widget.uid

  const model = computed({
    get: () => {
      if (!formDataCtx) return undefined
      const { formData } = formDataCtx
      if (requireTransform(widget)) {
        return toWidgetValue(
          get(formData.value, key),
          (widget as WidgetMap['datePicker']).props.valueFormat,
        )
      } else {
        return get(formData.value, key)
      }
    },
    set: (val) => {
      if (formDataCtx !== null) {
        const { formData } = formDataCtx
        if (requireTransform(widget)) {
          set(
            formData.value,
            key,
            toSubmitValue(val, (widget as WidgetMap['datePicker']).props.submitFormat),
          )
        } else {
          set(formData.value, key, val)
        }
      }
    },
  })

  watch(
    () => model.value,
    (newVal, oldVal) => {
      if (oldVal === undefined && newVal !== undefined) {
        // if the value is created for the first time,
        // re-call the setter to update format
        model.value = newVal
      }
    },
  )

  return { model }
}

export const useDefaultValue = (config: FormWidget) => {
  const rendererCtx = useRendererInjection()

  if (rendererCtx !== null) {
    const { $state, formData, mode } = rendererCtx
    if (mode === 'prod') {
      if ((config.props as any).defaultValue) {
        const value = evalExpression((config.props as any).defaultValue, $state)
        formData.value[config.props.field?.name || config.uid] = value
      }
    }
  }
}
