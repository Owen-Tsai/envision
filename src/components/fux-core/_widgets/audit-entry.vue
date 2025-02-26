<template>
  <template v-if="config.class === 'layout'">
    <!-- layout widgets -->
    <Tabs v-if="config.type === 'tabs'" :config="config" :fields-config="fields" />
    <template v-if="config.type === 'grid'">
      <template v-for="(col, i) in config.props.children" :key="`col-${i}`">
        <AuditEntry v-for="(widget, j) in col.widgets" :key="j" :config="widget" />
      </template>
    </template>
  </template>
  <ADescriptionsItem v-if="config.class === 'form'">
    <component :is="widgetToRender" :config="config" />
  </ADescriptionsItem>
</template>

<script setup lang="ts">
import Tabs from './tabs/index.vue'
import { camelCase } from 'lodash-es'
import type { NPropsFieldConfig } from '@/types/fux-core/flow'
import type { Widget } from '@/types/fux-core/form'

const componentsDisplay = import.meta.glob('./**/audit.vue', { eager: true, import: 'default' })
const componentsEditable = import.meta.glob('./**/index.vue', { eager: true, import: 'default' })

const { config, fields } = defineProps<{
  config: Widget
  fields?: NPropsFieldConfig[]
}>()

const widgetToRender = computed(() => {
  const type = config.type
  const field = fields?.find((f) => f.name === config.props.field.name)

  if (!field || field.config === 'hide') {
    return null
  }

  const components = field.config === 'edit' ? componentsEditable : componentsDisplay
  for (const key in components) {
    const name = key.split('/').slice(-2, -1)[0]
    if (camelCase(name) === type) {
      return components[key] as any
    }
  }

  return null
})

defineOptions({ name: 'AuditEntry' })
</script>
