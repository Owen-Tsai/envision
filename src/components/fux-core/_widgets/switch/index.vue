<template>
  <ASwitch
    v-model:checked="model"
    :checked-value="config.props.checkedValue"
    :un-checked-value="config.props.unCheckedValue"
  />
</template>

<script lang="ts" setup>
import { useModel } from '../../_hooks'
import type { WidgetMap } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: WidgetMap['switch']
}>()

const { model } = useModel(config)
</script>
