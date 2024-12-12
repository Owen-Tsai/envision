<template>
  <div v-if="isProd || config.props.state.mode === 'table'">
    <AFlex justify="end" class="mb-4">
      <AButton :icon="h(PlusOutlined)" @click="visible = true" :disabled="!isProd">新增</AButton>
    </AFlex>
    <ATable
      :columns="config.props.columns"
      :data-source="tableData.list"
      :pagination="pagination"
    />
    <!-- 此处删除，因为设计模式下需要展示。不要从 fe 复制到 uc！ -->
    <AModal v-model:open="visible" :title="modalTitle" :width="config.props.formWidth">
      <AForm
        :model="modalFormData"
        :colon="config.props.form.colon"
        :label-align="config.props.form.labelAlign"
        :label-col="labelCol"
        label-wrap
        :layout="config.props.form.layout"
        :wrapper-col="wrapperCol"
      >
        <WidgetRenderer
          v-for="child in config.props.widgets"
          :key="child.uid"
          :config="child"
          :fields="fields"
        />
      </AForm>
      <template #footer />
    </AModal>
  </div>
  <div v-if="!isProd && config.props.state.mode === 'form'">
    <div class="draggable-area" :class="{ 'empty-slot': config.props.widgets.length <= 0 }">
      <Nested :widgets="config.props.widgets" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { tryParse } from '@fusionx/utils'
import { useModelProvider, useRendererInjection } from '../../_hooks'
import WidgetRenderer from '../index.vue'
import Nested from '../../form-designer/canvas/nested.vue'
import type { TableProps } from 'ant-design-vue'
import type { WidgetMap } from '@/types/fux-core/form'

const { config, fields } = defineProps<{
  config: WidgetMap['dataTable']
  fields?: any[]
}>()

const rendererCtx = useRendererInjection()

const tableData = reactive<{
  total: number
  list: any[]
  current: number
}>({
  total: 0,
  list: [],
  current: 1
})

const isProd = computed(() => rendererCtx?.prod)

const pagination = computed<TableProps['pagination']>(() => {
  if (config.props.pagination) {
    const { lite, pageSize, small } = config.props.pagination
    return {
      pageSize,
      mini: !!small,
      showLessItems: !!lite,
      current: tableData.current,
      total: tableData.total
    }
  }

  return false
})

// modal form
const visible = ref(false)
const modalFormData = ref<Record<string, any>>({})
const modalEditMode = ref<'create' | 'update'>('create')
const modalTitle = computed(() => {
  const label = config.props.field.label
  return modalEditMode.value === 'update' ? `编辑${label || ''}` : `新增${label || ''}`
})

const labelCol = computed(() => {
  const width = config.props.form.labelWidth
  return width ? { style: { width } } : tryParse(config.props.form.labelCol)
})

const wrapperCol = computed(() => {
  return tryParse(config.props.form.wrapperCol)
})

useModelProvider(modalFormData)
</script>
