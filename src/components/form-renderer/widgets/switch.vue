<template>
  <ASwitch
    v-model:checked="model"
    :checked-value="config.props.checkedValue"
    :un-checked-value="config.props.unCheckedValue"
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
    type: Object as PropType<WidgetConfigMap['switch']>,
    required: true
  }
})
const { model } = useModel(props.config.props.field.name || props.config.uid, parentFormConfig)
</script>
