<template>
  <ATextarea
    v-model:value="model"
    :allow-clear="config.props.allowClear"
    :autosize="autosize"
    :default-value="config.props.defaultValue"
    :disabled="config.props.disabled"
    :maxlength="config.props.maxlength"
    :rows="config.props.rows"
    :readonly="config.props.readonly"
    :placeholder="config.props.placeholder"
    :show-count="config.props.showCount"
  />
</template>

<script lang="ts" setup>
import { inject, computed, type PropType } from 'vue'
import useModel from '../use-model'
import {
  parentFieldKey,
  type WidgetConfigMap,
  type ParentFormPropType
} from '@/types/workflow/form'

const parentFormConfig = inject<ParentFormPropType | undefined>(parentFieldKey, undefined)

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['textarea']>,
    required: true
  }
})

const { model } = useModel(props.config.props.field.name || props.config.uid, parentFormConfig)

const autosize = computed(() => {
  if (props.config.props.minRows || props.config.props.maxRows) {
    return {
      minrows: props.config.props.minRows,
      maxRows: props.config.props.maxRows
    }
  } else {
    return props.config.props.autoResize
  }
})
</script>
