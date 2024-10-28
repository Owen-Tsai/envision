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
      <AddonRenderer :addon="config.props.prefix" />
    </template>
  </AInputNumber>
</template>

<script lang="ts" setup>
import { useModel } from '../../_hooks'
import AddonRenderer from '@/components/_internal/addon-renderer.vue'
import type { WidgetMap } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: WidgetMap['inputNumber']
}>()

const { model } = useModel(config)
</script>
