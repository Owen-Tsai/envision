<template>
  <template v-if="config.class === 'layout' && visible">
    <!-- layout widgets -->
    <component :is="widgetToRenderer" :config="config" />
  </template>
  <template v-else-if="config.class === 'special' && visible">
    <!-- special widgets -->
  </template>
  <AFormItem
    v-else-if="config.class === 'form' && visible"
    :extra="config.props.field?.extra"
    :label="config.props.field?.label"
    :name="fieldName || config.uid"
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
import { useRendererInjection } from '../_hooks'
import { tryParse } from '@fusionx/utils'
import type { FormWidget, Widget } from '@/types/fux-core/form'

const ctx = useRendererInjection()

const { config } = defineProps<{
  config: Widget
}>()

const components = import.meta.glob('./**/index.vue', { eager: true, import: 'default' })

const visible = computed(() => !ctx?.prod || (!config.props.hide && ctx.prod))

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

const fieldName = computed(() => {
  return config.props.field?.name?.split('.')
})
</script>
