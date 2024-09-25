<template>
  <div>
    <AForm
      ref="formRef"
      :model="formData"
      :colon="formSchema.colon"
      :label-align="formSchema.labelAlign"
      :label-col="labelCol"
      label-wrap
      :wrapper-col="wrapperCol"
      :layout="formSchema.layout"
      :disabled="formSchema.disabled"
      scroll-to-first-error
      class="flex-grow"
    >
      <template v-for="(item, i) in widgets" :key="i">
        <WidgetRenderer :widget="item" />
      </template>
    </AForm>

    <div v-if="showFormData" class="json-view" v-html="formDataJson" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, watch, type PropType } from 'vue'
import { provideLocal } from '@vueuse/core'
import { type FormInstance } from 'ant-design-vue'
import WidgetRenderer from './widget-renderer.vue'
import useHighlighter from '@/hooks/use-highlighter'
import { tryParse } from '@/utils/fusion'
import { useActions } from './use-actions'
import { formModelCtxKey, type Schema, type FormModelContext } from '@/types/workflow'

const props = defineProps({
  schema: {
    type: Object as PropType<Schema>,
    required: true
  },
  showFormData: {
    type: Boolean
  }
})

const formRef = ref<FormInstance>()
const formSchema = computed(() => props.schema.form)
const widgets = computed(() => formSchema.value.widgets)

const formData = ref<Record<string, any> | Record<string, any>[]>({})

const labelCol = computed(() => {
  const width = formSchema.value.labelWidth
  return width ? { style: { width } } : tryParse(formSchema.value.labelCol)
})

const wrapperCol = computed(() => {
  return tryParse(formSchema.value.wrapperCol)
})

const formDataJson = computed(() => useHighlighter(JSON.stringify(formData.value, null, 2), 'json'))

provideLocal<FormModelContext>(formModelCtxKey, {
  formData,
  schema: props.schema
})

const { eventBus } = useActions()

const validate = () => {
  return formRef.value?.validate()
}

// read schema to init formData
console.log(props.schema)
if (props.schema.info.paginated) {
  formData.value = new Array(props.schema.info.tables.length).fill(undefined).map(() => ({}))
} else {
  formData.value = {}
}

defineExpose({
  ...eventBus,
  validate
})
</script>

<style lang="scss" scoped>
.json-view {
  width: 280px;
  flex-shrink: 0;
}
</style>
