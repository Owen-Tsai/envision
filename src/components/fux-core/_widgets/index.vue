<template>
  <template v-if="config.class === 'layout' && visible">
    <!-- layout widgets -->
    <component :is="widgetToRenderer" :config="widgetConfig" :fields="fields" />
  </template>
  <template v-else-if="config.class === 'special' && visible">
    <!-- special widgets -->
  </template>
  <AFormItem
    v-else-if="config.class === 'form' && show"
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
import { ref, computed, watch } from 'vue'
import { camelCase } from 'lodash-es'
import { useRendererInjection } from '../_hooks'
import { tryParse } from '@fusionx/utils'
import type { FormWidget, Widget } from '@/types/fux-core/form'

const ctx = useRendererInjection()

const { config, fields, showAll } = defineProps<{
  config: Widget
  fields?: any[]
  showAll?: boolean
}>()

const widgetConfig = ref(config)

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

const fieldConfig = computed(() => {
  if (!ctx?.prod) {
    return null
  }
  let config = ''
  if (fieldName.value) {
    const res = fields?.find((fcfg) => fcfg.name == fieldName.value[fieldName.value.length - 1])
    if (res) {
      config = res.config
    }
  }
  return config
})

const show = computed(() => {
  // console.log(fieldName.value)
  if (!visible.value && showAll) {
    return true
  } else {
    if (fields !== null) {
      // console.log('config', config)
      // console.log('fieldName', fieldName.value)
      // console.log('fieldConfig', fieldConfig.value)
      if (fieldConfig.value == 'show') {
        return true
      } else if (fieldConfig.value == 'hide') {
        return false
      } else {
        return fieldConfig.value == 'edit' || fieldConfig.value == 'readonly' ? true : visible.value
      }
    } else {
      return visible.value
    }
  }
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
