<template>
  <div>
    <AFlex justify="end">
      <AButton :icon="h(PlusOutlined)" @click="visible = true">新增</AButton>
    </AFlex>
    <ATable
      :columns="widget.props.columns"
      :data-source="tableData.list"
      :pagination="pagination"
      @change="onPageChange"
    />
    <AModal
      v-model:open="visible"
      :title="title"
      :width="widget.props.children[0].width"
      @ok="onSave"
    >
      <AForm :model="formData">
        <div>step: {{ fieldCtxConfig.step }}</div>
        <WidgetRenderer
          v-for="child in formWidgets"
          :key="child.uid"
          :widget="child"
          :field-ctx-config="{ formData: formData }"
        />
      </AForm>
    </AModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h, computed, inject, type PropType } from 'vue'
import request from '@/utils/request'
import { kebabCase } from 'lodash-es'
import { PlusOutlined } from '@ant-design/icons-vue'
import WidgetRenderer from '../widget-renderer.vue'
import type { TableProps } from 'ant-design-vue'
import { fieldCtxConfigKey, type WidgetConfigMap, type FieldCtxConfig } from '@/types/workflow/form'
import { formModelCtxKey, type FormModelContext } from '@/types/workflow'

const props = defineProps({
  widget: {
    type: Object as PropType<WidgetConfigMap['dataTable']>,
    required: true
  }
})

const fieldCtxConfig = inject<FieldCtxConfig | undefined>(fieldCtxConfigKey, undefined)!
const { schema } = inject(formModelCtxKey) as FormModelContext

const tableData = reactive({
  total: 0,
  list: [] as any[],
  current: 1
})

const formData = ref<Record<string, any>>({})
const visible = ref(false)
const mode = ref<'edit' | 'add'>('add')

const formWidgets = props.widget.props.children?.[0].widgets || []
const formTitle = props.widget.props.children?.[0].title || ''

const title = computed<string>(() =>
  mode.value === 'edit' ? `编辑${formTitle}` : `新增${formTitle}`
)
const pagination = computed<TableProps['pagination']>(() => {
  if (props.widget.props.pagination) {
    const { lite, pageSize, small } = props.widget.props.pagination
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

const getApiAddr = () => {
  // 1. need to know the current step and designated table name
  const current = fieldCtxConfig.step!
  const targetTableInfo = schema.info.tables[current]
  // 2. figure out which API address to submit to
  const api = `/system/${kebabCase(targetTableInfo.name.replace('system_', ''))}`
  return api
}

const onSave = () => {
  const url = `${getApiAddr()}/create`
  request.post({ url, data: formData.value }).then((res) => {
    console.log(res)
    // 6. load data
    // loadData()
  })
}

const loadData = () => {
  const url = `${getApiAddr()}/list`
  request.get({ url, params: { current: tableData.current } }).then((res) => {
    tableData.list = res.list
    tableData.total = res.total
  })
}

const onPageChange = () => {
  // loadData()
}
</script>
