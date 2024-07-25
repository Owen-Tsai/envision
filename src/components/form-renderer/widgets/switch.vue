<template>
  <ASwitch
    v-model:checked="model"
    :checked-value="config.props.checkedValue"
    :un-checked-value="config.props.unCheckedValue"
  />
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'
import type { WidgetConfigMap } from '@/types/workflow'
import useModel from '../use-model'

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['switch']>,
    required: true
  }
})
const { model } = useModel(props.config.props.field.name || props.config.uid)
</script>
