<template>
  <div :class="{ 'with-data': showData }">
    <AForm
      ref="form"
      :model="formData"
      :colon="schema?.form.colon"
      :disabled="schema?.form.disabled || disabled"
      :label-align="schema?.form.labelAlign"
      :label-col="labelCol"
      label-wrap
      :layout="schema?.form.layout"
      :wrapper-col="wrapperCol"
      class="flex-grow"
    >
      <WidgetRenderer
        v-for="widget in schema.form.widgets"
        :key="widget.uid"
        :config="widget"
        :fields="fieldsToRender"
        :showAll="showAll"
      />
    </AForm>
    <div v-if="showData" class="data" v-html="highlighted" />
  </div>
</template>

<script setup lang="ts">
import { tryParse } from '@fusionx/utils'
import { useRendererProvider } from '../_hooks'
import useApi from './use-api'
import useInstanceMethods from './use-instance'
import WidgetRenderer from '../_widgets/index.vue'
import useHighlighter from '@/hooks/use-highlighter'
import type { AppSchema } from '@/types/fux-core'
import type { NPropsFieldConfig } from '@/types/fux-core/flow'
import type { FuxRendererMode } from '@/types/fux-core/form/context'
import type { FormInstance } from 'ant-design-vue'

const {
  schema,
  showData,
  state,
  taskDefKey,
  mode = 'prod',
} = defineProps<{
  schema: AppSchema
  showData?: boolean
  mode?: FuxRendererMode
  state?: Record<string, any>
  disabled?: boolean
  taskDefKey?: string
}>()

const form = ref<FormInstance>()

const emit = defineEmits(['update:schema', 'update:state'])
const computedSchema = computed({
  get: () => schema,
  set: (val) => emit('update:schema', val),
})
const computedState = computed({
  get: () => state || {},
  set: (val) => emit('update:state', val),
})

const formData = ref<Record<string, any>>({})

useApi(computedSchema, computedState)

useRendererProvider(computedSchema, formData, computedState, mode)

const methods = useInstanceMethods()

const highlighted = computed(() => useHighlighter(JSON.stringify(formData?.value, null, 2), 'json'))

const labelCol = computed(() => {
  const width = schema.form.labelWidth
  return width ? { style: { width } } : tryParse(schema.form.labelCol)
})

const wrapperCol = computed(() => {
  return tryParse(schema.form.wrapperCol)
})

const showAll = computed(() => taskDefKey === 'All')
const fieldsToRender = computed<NPropsFieldConfig[]>(() => {
  if (taskDefKey) {
    if (taskDefKey === 'All') {
      const fields: NPropsFieldConfig[] = []
      schema.flow.nodes.forEach((node) => {
        if (node.type === 'audit') {
          node.props.fields.forEach((field) => {
            fields.push(field)
          })
        }
      })
      return fields
    }
    // when taskDefKey is not 'All':
    const currTask = schema.flow.nodes.find((node) => node.uid == taskDefKey)
    return currTask?.props.fields || []
  } else {
    return []
  }
})

const validate = (namePaths?: string[]) => {
  return form.value?.validateFields(namePaths)
}

defineExpose({
  ...methods,
  validate,
})
</script>

<style lang="scss" scoped>
.data {
  background-color: var(--color-bg-container);
  padding: 16px;
  flex-shrink: 0;
  width: 25%;
}
.with-data {
  display: flex;
}
</style>
