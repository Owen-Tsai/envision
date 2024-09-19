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
  />
</template>

<script lang="ts" setup>
import { inject, type PropType } from 'vue'
import useModel from '../use-model'
import {
  parentFieldKey,
  type WidgetConfigMap,
  type ParentFormPropType
} from '@/types/workflow/form'

const parentFormConfig = inject<ParentFormPropType | undefined>(parentFieldKey, undefined)

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['timePicker']>,
    required: true
  }
})

const { model } = useModel(props.config.props.field.name || props.config.uid, parentFormConfig)
</script>
