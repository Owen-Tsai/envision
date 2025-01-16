<template>
  <template v-if="config.class === 'layout' && shouldShow">
    <!-- layout widgets -->
    <component :is="widgetToRenderer" :config="widgetConfig" :fields="fields" />
  </template>
  <template v-else-if="config.class === 'special' && shouldShow">
    <!-- special widgets -->
  </template>
  <AFormItem
    v-else-if="config.class === 'form' && shouldShow"
    :extra="config.props.field?.extra"
    :label="config.props.field?.label"
    :name="fieldName || config.uid"
    :required="config.props.field?.required"
    :label-align="config.props.field?.labelAlign"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :rules="rules"
  >
    <component :is="widgetToRenderer" :config="widgetConfig" />
  </AFormItem>
</template>

<script setup lang="ts">
import { camelCase } from 'lodash-es'
import { useRendererInjection } from '../_hooks'
import useSignals from './use-widget-signals'
import { tryParse } from '@fusionx/utils'
import type { FormWidget, Widget } from '@/types/fux-core/form'
import type { NPropsFieldConfig } from '@/types/fux-core/flow'

const ctx = useRendererInjection()
const emit = defineEmits(['update:config'])

const { config, fields, showAll } = defineProps<{
  config: Widget
  fields?: NPropsFieldConfig[]
  showAll?: boolean
}>()

const widgetConfig = computed({
  get() {
    return config
  },
  set(val) {
    emit('update:config', val)
  },
})

const components = import.meta.glob('./**/index.vue', { eager: true, import: 'default' })

// might be modified later by emitted events
const { visible } = useSignals(widgetConfig)

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

const fieldConfig = computed<NPropsFieldConfig['config'] | null>(() => {
  if (!ctx || ctx.mode === 'dev') {
    return null
  }
  let config: NPropsFieldConfig['config']
  if (fieldName.value !== undefined) {
    const res = fields?.find((fcfg) => fcfg.name == fieldName.value![fieldName.value!.length - 1])
    if (res && res.config) {
      config = res.config
    }
  }
  return config
})

const shouldShow = computed(() => {
  if (showAll) return true

  if (ctx && ctx.mode !== 'dev' && fields) {
    // preview, prod, audit
    return fieldConfig.value === 'hide' ? false : visible.value
  }

  if (!ctx || ctx.mode === 'dev') {
    return true
  }

  return !config.props.hide && visible.value
})

const setPropWhenApplicable = (prop: string, value: any) => {
  if (widgetConfig.value.props) {
    widgetConfig.value.props[prop] = value
  }
}

const rules = computed(() => {
  return tryParse((config as FormWidget).props.field.rules)
})

watch(
  () => fieldConfig.value,
  (val) => {
    if (val === 'readonly') {
      setPropWhenApplicable('readonly', true)
    }
    if (val === 'edit') {
      setPropWhenApplicable('readonly', false)
      setPropWhenApplicable('disabled', false)
    }
  },
  { immediate: true },
)
</script>
