<template>
  <ARangePicker
    v-model:value="model"
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
import type { WidgetMap } from '@/types/fux-core/form'
import { useModel } from '../../_hooks'

const { config } = defineProps<{
  config: WidgetMap['dateRangePicker']
}>()

const { model } = useModel(config)
</script>
