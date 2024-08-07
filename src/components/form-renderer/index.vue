<template>
  <div class="flex gap-4 h-full overflow-auto">
    <AForm
      :model="formData"
      :colon="schema.form.colon"
      :label-align="schema.form.labelAlign"
      :label-col="labelCol"
      label-wrap
      :wrapper-col="wrapperCol"
      :layout="schema.form.layout"
      :disabled="schema.form.disabled"
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
import { ref, computed, provide, type PropType } from 'vue'
import WidgetRenderer from './widget-renderer.vue'
import highlighter from '@/utils/highlighter'
import { tryParse } from '@/utils/envision'
import { formDataKey, type Schema } from '@/types/workflow'

const props = defineProps({
  schema: {
    type: Object as PropType<Schema>,
    required: true
  },
  showFormData: {
    type: Boolean
  }
})

const formData = ref<Record<string, any>>({})
const widgets = ref(props.schema.form.widgets)

const labelCol = computed(() => {
  const width = props.schema.form.labelWidth
  return width ? { style: { width } } : tryParse(props.schema.form.labelCol)
})

const wrapperCol = computed(() => {
  return tryParse(props.schema.form.wrapperCol)
})

const formDataJson = computed(() =>
  highlighter.codeToHtml(JSON.stringify(formData.value, null, 2), {
    lang: 'json',
    theme: 'vitesse-light'
  })
)

provide(formDataKey, {
  formData
})
</script>

<style lang="scss" scoped>
.json-view {
  width: 280px;
  flex-shrink: 0;
}
</style>
