<template>
  <ATimeRangePicker
    v-model:value="model"
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

<script lang="ts" setup>
import { useModel } from '../../_hooks'
import type { WidgetMap } from '@/types/fux-core'

const { config } = defineProps<{
  config: WidgetMap['timeRangePicker']
}>()

const { model } = useModel(config)
</script>
