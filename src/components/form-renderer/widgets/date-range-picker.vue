<template>
  <ARangePicker
    :allow-clear="config.props.allowClear"
    :default-value="config.props.defaultValue"
    :disabled="config.props.disabled"
    :format="config.props.format"
    :picker="config.props.picker"
    :placeholder="config.props.placeholder"
    :placement="config.props.placement"
    :value-format="config.props.valueFormat"
    :show-time="config.props.showTime"
    show-now
    show-today
  />
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'
import type { WidgetConfigMap } from '@/types/workflow'

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['rangePicker']>,
    required: true
  }
})
</script>
