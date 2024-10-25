<template>
  <div :class="{ 'with-data': showData }">
    <AForm
      :model="formData"
      :colon="schema?.colon"
      :disabled="schema?.disabled"
      :label-align="schema?.labelAlign"
      :label-col="labelCol"
      label-wrap
      :layout="schema?.layout"
      :wrapper-col="wrapperCol"
      class="flex-grow"
    >
      <WidgetRenderer v-for="widget in schema.widgets" :key="widget.uid" :config="widget" />
    </AForm>
    <div v-if="showData" class="data" v-html="highlighted" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { tryParse } from '@fusionx/utils'
import { useFormDataProvider, useRendererProvider } from '../_hooks'
import useApi from './use-api'
import WidgetRenderer from '../_widgets/index.vue'
import useHighlighter from '@/hooks/use-highlighter'
import type { FormSchema } from '@/types/fux-core'

const { schema, showData } = defineProps<{
  schema: FormSchema
  showData?: boolean
}>()

const $state = ref<Record<string, any>>({})
const formData = ref<Record<string, any>>({})
useFormDataProvider(formData)

useApi(schema, $state)

useRendererProvider($state)

const highlighted = computed(() => useHighlighter(JSON.stringify(formData?.value, null, 2), 'json'))

const labelCol = computed(() => {
  const width = schema.labelWidth
  return width ? { style: { width } } : tryParse(schema.labelCol)
})

const wrapperCol = computed(() => {
  return tryParse(schema.wrapperCol)
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
