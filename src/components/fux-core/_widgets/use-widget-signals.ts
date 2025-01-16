import { emitter } from '@fusionx/utils'
import { merge } from 'lodash-es'
import type { Widget } from '@/types/fux-core/form'

const useWidgetSignals = (widgetConfig: WritableComputedRef<Widget>) => {
  const visible = ref(true)

  emitter.on('widget:show', (name) => {
    if (name === widgetConfig.value.uid || name === widgetConfig.value.props.field?.name) {
      visible.value = true
    }
  })

  emitter.on('widget:hide', (name) => {
    if (name === widgetConfig.value.uid || name === widgetConfig.value.props.field?.name) {
      visible.value = false
    }
  })

  emitter.on('widget:attrs', (evt) => {
    const { name, attrs } = evt as { name: string; attrs: Record<string, any> }
    if (name === widgetConfig.value.uid || name === widgetConfig.value.props.field?.name) {
      widgetConfig.value = merge(widgetConfig.value, attrs)
    }
  })

  return {
    visible,
  }
}

export default useWidgetSignals
