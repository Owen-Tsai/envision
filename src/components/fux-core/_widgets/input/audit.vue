<template>
  {{ rawValue }}
</template>

<script setup lang="ts">
import useValue from '../../_hooks/use-value'
import type { WidgetMap } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: WidgetMap['input']
}>()

const rawValue = useValue(config)
</script>
