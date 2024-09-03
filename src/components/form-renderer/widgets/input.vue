<template>
  <AInput
    v-model:value="model"
    :default-value="config.props.defaultValue"
    :maxlength="config.props.maxlength"
    :show-count="config.props.showCount"
    :readonly="config.props.readonly"
    :disabled="config.props.disabled"
    :allow-clear="config.props.allowClear"
    :placeholder="config.props.placeholder"
  >
    <template #prefix>
      <AddonRenderer :addon-type="config.props.prefixType" :addon-value="config.props.prefix" />
    </template>
    <template #suffix>
      <AddonRenderer :addon-type="config.props.suffixType" :addon-value="config.props.suffix" />
    </template>
  </AInput>
</template>

<script lang="ts" setup>
import { inject, type PropType } from 'vue'
import AddonRenderer from '../addon-renderer.vue'
import useModel from '../use-model'
import type { WidgetConfigMap, ParentFormPropType } from '@/types/workflow'

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['input']>,
    required: true
  },
  parentFormConfig: {
    type: Object as PropType<ParentFormPropType>
  }
})

const { model } = useModel(
  props.config.props.field.name || props.config.uid,
  props.parentFormConfig
)
</script>
