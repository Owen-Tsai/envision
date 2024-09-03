<template>
  <ASlider
    v-model:value="model"
    :default-value="config.props.defaultValue"
    :disabled="config.props.disabled"
    :dots="config.props.dots"
    :marks="marks"
    :max="config.props.max"
    :min="config.props.min"
    :range="config.props.range"
    :reverse="config.props.reverse"
    :tooltip-open="config.props.hideTooltip === true ? false : undefined"
    :step="config.props.disableStep && marks ? null : config.props.step"
  />
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import { tryParse } from '@/utils/fusion'
import type { WidgetConfigMap } from '@/types/workflow'
import useModel from '../use-model'

const props = defineProps({
  config: {
    type: Object as PropType<WidgetConfigMap['slider']>,
    required: true
  }
})

const marks = computed(() => tryParse(props.config.props.marks))

const { model } = useModel(props.config.props.field.name || props.config.uid)
</script>
