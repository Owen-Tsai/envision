<template>
  <ARadioGroup
    v-if="!optionSetInfo"
    v-model:value="model"
    :disabled="config.props.disabled"
    :options="options"
  />
  <div v-else class="text-muted">{{ optionSetInfo }}</div>
</template>

<script lang="ts" setup>
import { useModel, useOptionInfo, useOptions } from '../../_hooks'
import type { WidgetMap } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: WidgetMap['radio']
}>()

const { model } = useModel(config)

const { options } = useOptions(config)
const { optionSetInfo } = useOptionInfo(config)
</script>
