<template>
  <template v-if="config.class === 'layout'">
    <!-- layout widgets -->
    <component :is="widgetToRenderer" :config="config" />
  </template>
  <template v-else-if="config.class === 'special'">
    <!-- special widgets -->
  </template>
  <AFormItem
    v-else-if="config.class === 'form'"
    :extra="config.props.field?.extra"
    :label="config.props.field?.label"
    :name="config.props.field?.name || config.uid"
    :required="config.props.field?.required"
    :label-align="config.props.field?.labelAlign"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <component :is="widgetToRenderer" :config="config" />
  </AFormItem>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { camelCase } from 'lodash-es'
import { tryParse } from '@fusionx/utils'
import type { FormWidget, Widget } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: Widget
}>()

const components = import.meta.glob('./**/index.vue', { eager: true, import: 'default' })

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

const labelCol = computed(() => {
  const width = (config as FormWidget).props.field.labelWidth
  return width ? { style: { width } } : tryParse((config as FormWidget).props.field.labelCol)
})

const wrapperCol = computed(() => {
  return tryParse((config as FormWidget).props.field.wrapperCol)
})
</script>
