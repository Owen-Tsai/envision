<template>
  <div :class="{ 'with-data': showData }">
    <AForm
      :model="formData"
      :colon="schema?.form.colon"
      :disabled="schema?.form.disabled"
      :label-align="schema?.form.labelAlign"
      :label-col="labelCol"
      label-wrap
      :layout="schema?.form.layout"
      :wrapper-col="wrapperCol"
      class="flex-grow"
    >
      <WidgetRenderer v-for="widget in schema.form.widgets" :key="widget.uid" :config="widget" />
    </AForm>
    <div v-if="showData" class="data" v-html="highlighted" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { tryParse } from '@fusionx/utils'
import { useFormDataProvider, useRendererProvider } from '../_hooks'
import useApi from './use-api'
import useInstanceMethods from './use-instance'
import WidgetRenderer from '../_widgets/index.vue'
import useHighlighter from '@/hooks/use-highlighter'
import type { AppSchema } from '@/types/fux-core'

const { schema, showData, state } = withDefaults(
  defineProps<{
    schema: AppSchema
    showData?: boolean
    state?: Record<string, any>
  }>(),
  {
    state: () => ({
      __test: 'test'
    })
  }
)

const emit = defineEmits(['update:schema', 'update:state'])
const computedSchema = computed({
  get: () => schema,
  set: (val) => emit('update:schema', val)
})
const computedState = computed({
  get: () => state,
  set: (val) => emit('update:state', val)
})

const formData = ref<Record<string, any>>({})
useFormDataProvider(formData)

useApi(schema.form, computedState)

useRendererProvider(computedSchema, computedState)

const methods = useInstanceMethods()

const highlighted = computed(() => useHighlighter(JSON.stringify(formData?.value, null, 2), 'json'))

const labelCol = computed(() => {
  const width = schema.form.labelWidth
  return width ? { style: { width } } : tryParse(schema.form.labelCol)
})

const wrapperCol = computed(() => {
  return tryParse(schema.form.wrapperCol)
})

defineExpose({
  ...methods
})
</script>

<style lang="scss" scoped>
.data {
  background-color: var(--colorBgContainer);
  padding: 16px;
  flex-shrink: 0;
  width: 25%;
}
.with-data {
  display: flex;
}
</style>
