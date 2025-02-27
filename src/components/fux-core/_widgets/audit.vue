<template>
  <div class="inline-flex items-center gap-2">
    <component :is="widgetToRenderer" />
  </div>
</template>

<script setup lang="ts">
import { camelCase } from 'lodash-es'
import type { FormWidget } from '@/types/fux-core/form'

const components = import.meta.glob('./**/audit.vue', { eager: true, import: 'default' })

const { config } = defineProps<{
  config: FormWidget
}>()

const widgetToRenderer = computed(() => {
  const type = config.type
  for (const key in components) {
    const name = key.split('/').slice(-2, -1)[0]
    if (camelCase(name) === type) {
      return components[key] as any
    }
  }

  return null
})
</script>
