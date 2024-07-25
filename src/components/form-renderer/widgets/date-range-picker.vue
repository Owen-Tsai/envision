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
import { type PropType } from 'vue'
import type { WidgetConfigMap } from '@/types/workflow'
import useModel from '../use-model'

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['dateRangePicker']>,
    required: true
  }
})

const { model } = useModel(props.config.props.field.name || props.config.uid)
</script>
