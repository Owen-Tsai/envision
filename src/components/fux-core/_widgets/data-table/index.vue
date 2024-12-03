<template>
  <div v-if="isProd || config.props.state.mode === 'table'">
    <AFlex justify="end" class="mb-4">
      <AButton :icon="h(PlusOutlined)" @click="visible = true" :disabled="!isProd">新增</AButton>
    </AFlex>
    <ATable
      :columns="config.props.columns"
      :data-source="tableData.list"
      :pagination="pagination"
      @change="onPageChange"
    />
    <AModal v-model:open="visible" :title="modalTitle" :width="config.props.formWidth" @ok="onSave">
      <AForm :model="modalFormData">
        <WidgetRenderer
          v-for="child in config.props.widgets"
          :key="child.uid"
          :config="child"
          :fields="fields"
        />
      </AForm>
      <pre>{{ modalFormData }}</pre>
    </AModal>
  </div>
  <div v-if="!isProd && config.props.state.mode === 'form'">
    <div class="draggable-area" :class="{ 'empty-slot': config.props.widgets.length <= 0 }">
      <Nested :widgets="config.props.widgets" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, ref, reactive, computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import request from '@/utils/request'
import { useRendererInjection, useModelProvider } from '../../_hooks'
import WidgetRenderer from '../index.vue'
import Nested from '../../form-designer/canvas/nested.vue'
import type { TableProps } from 'ant-design-vue'
import type { WidgetMap } from '@/types/fux-core/form'

const { config } = defineProps<{
  config: WidgetMap['dataTable']
  fields: any[]
}>()

const rendererCtx = useRendererInjection()

const loading = ref(false)

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

  return undefined
})

const urlPrefix = config.props.url

// modal form
const visible = ref(false)
const modalFormData = ref<Record<string, any>>({})
const modalEditMode = ref<'create' | 'update'>('create')
const modalTitle = computed(() => {
  const label = config.props.field.label
  return modalEditMode.value === 'update' ? `编辑${label || ''}` : `新增${label || ''}`
})

const loadData = async () => {
  loading.value = true
  const api = `${urlPrefix}/page`
  const res = await request.get({ url: api, params: { current: tableData.current } })
  tableData.list = res.list
  tableData.total = res.total
  loading.value = false
}

const onPageChange = () => {
  loadData()
}

const onSave = async () => {
  const api = `${urlPrefix}/${modalEditMode.value}`
  loading.value = true
  if (modalEditMode.value === 'update') {
    await request.put({ url: api, data: modalFormData.value })
  } else {
    await request.post({ url: api, data: modalFormData.value })
  }
  visible.value = false
  await loadData()
}

useModelProvider(modalFormData)
</script>
