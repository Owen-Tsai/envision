<template>
  <ATimeRangePicker
    :allow-clear="config.props.allowClear"
    :default-value="config.props.defaultValue"
    :disabled="config.props.disabled"
    :format="config.props.format"
    :hour-step="config.props.hourStep"
    :minute-step="config.props.minuteStep"
    :second-step="config.props.secondStep"
    :use12-hours="config.props.use12Hours"
    :placeholder="config.props.placeholder"
    :placement="config.props.placement"
    :value-format="config.props.valueFormat"
  />
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import type { WidgetConfigMap } from '@/types/workflow'

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['timeRangePicker']>,
    required: true
  }
})
</script>
