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
    :step="config.props.disableStep && marks ? (null as any) : config.props.step"
    @change="evt?.handler('change')"
  />
</template>

<script lang="ts" setup>
import { useModel, useEvents } from '../../_hooks'
import { tryParse } from '@fusionx/utils'
import type { WidgetMap } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: WidgetMap['slider']
}>()

const { model } = useModel(config)
const evt = useEvents(config.props.event)

const marks = computed(() => tryParse(config.props.marks))
</script>
