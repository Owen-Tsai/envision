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
    @blur="evt?.handler('blur')"
    @change="evt?.handler('change')"
    @focus="evt?.handler('focus')"
    @input="evt?.handler('input')"
  >
    <template #prefix>
      <AddonRenderer :addon="config.props.prefix" />
    </template>
    <template #suffix>
      <AddonRenderer :addon="config.props.suffix" />
    </template>
  </AInput>
</template>

<script setup lang="ts">
import { useModel, useDefaultValue, useEvents } from '../../_hooks'
import AddonRenderer from '@/components/_internal/addon-renderer.vue'
import type { WidgetMap } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: WidgetMap['input']
}>()

const { model } = useModel(config)
useDefaultValue(config)
const evt = useEvents(config.props.event)
</script>
