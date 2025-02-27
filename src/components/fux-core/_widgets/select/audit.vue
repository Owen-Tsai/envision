<template>
  {{ formatted }}
</template>

<script setup lang="ts">
import { useValue, useOptions } from '../../_hooks'
import type { WidgetMap } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: WidgetMap['select']
}>()

const rawValue = useValue(config)
const { options } = useOptions(config)

const formatted = computed(() => {
  const selected = options.value.find((o) => o.value === rawValue.value)
  return selected ? selected.label : ''
})
</script>
