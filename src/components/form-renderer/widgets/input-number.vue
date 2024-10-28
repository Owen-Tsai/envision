<template>
  <AInputNumber
    v-model:value="model"
    :default-value="config.props.defaultValue"
    :controls="config.props.controls"
    :min="config.props.min"
    :max="config.props.max"
    :precision="config.props.precision"
    :step="config.props.step"
    class="w-full"
  >
    <template #prefix>
      <AddonRenderer :addon-type="config.props.prefixType" :addon-value="config.props.prefix" />
    </template>
  </AInputNumber>
</template>

<script lang="ts" setup>
import { inject, type PropType } from 'vue'
import { type WidgetConfigMap } from '@/types/workflow/form'
import AddonRenderer from '../addon-renderer.vue'
import useModel from '../use-model'

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['inputNumber']>,
    required: true
  }
})

const { model } = useModel(props.config.props.field.name || props.config.uid)
</script>
