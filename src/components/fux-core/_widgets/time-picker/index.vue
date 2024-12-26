<template>
  <ATimePicker
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
    @blur="evt?.handler('blur')"
    @change="evt?.handler('change')"
    @focus="evt?.handler('focus')"
  />
</template>

<script lang="ts" setup>
import { useModel, useEvents } from '../../_hooks'
import type { WidgetMap } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: WidgetMap['timePicker']
}>()

const { model } = useModel(config)
const evt = useEvents(config.props.event)
</script>
