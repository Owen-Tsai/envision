<template>
  <ADatePicker
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
    @blur="evt?.handler('blur')"
    @change="evt?.handler('change')"
    @focus="evt?.handler('focus')"
  />
</template>

<script lang="ts" setup>
import { useModel, useEvents } from '../../_hooks'
import type { WidgetMap } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: WidgetMap['datePicker']
}>()

const { model } = useModel(config)
const evt = useEvents(config.props.event)
</script>
