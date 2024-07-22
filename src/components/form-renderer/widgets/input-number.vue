<template>
  <AInputNumber
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
import { type PropType } from 'vue'
import type { WidgetConfigMap } from '@/types/workflow'
import AddonRenderer from '../addon-renderer.vue'

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['inputNumber']>,
    required: true
  }
})
</script>
