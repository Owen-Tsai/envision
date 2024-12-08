<template>
  <div v-if="isProd || config.props.state.mode === 'table'">
    <ATable
      :columns="config.props.columns"
      :data-source="tableData.list"
      :pagination="pagination"
      @change="onPageChange"
    >
      <template #bodyCell="scope: TableScope<any>">
        <template v-if="getFormatter(scope.index)?.type === 'dict'">
          <EDictTag :dict-object="dicts[scope.index].value" :value="scope.text" />
        </template>
        <template v-if="getFormatter(scope.index)?.type === 'custom'">
          {{ renderColumn(getFormatter(scope.index)!.value, scope.record) }}
        </template>
        <template v-if="scope?.column.key === 'actions'">
          <AFlex :gap="16">
            <ATypographyLink>
              <div @click="toView(scope.record)">
                <EyeOutlined />
                查看
              </div>
            </ATypographyLink>
          </AFlex>
        </template>
      </template>
    </ATable>
    <AModal v-model:open="visible" title="查看" :width="config.props.formWidth">
      <AForm :model="modalFormData">
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
import { computed, onMounted, reactive, ref } from 'vue'
import { injectLocal } from '@vueuse/core'
import { EyeOutlined } from '@ant-design/icons-vue'
import { requestLite } from '@/utils/request'
import { useModelProvider, useRendererInjection } from '../../_hooks'
import evalExpression from '../../_utils/expression'
import useDict from '@/hooks/use-dict'
import WidgetRenderer from '../index.vue'
import Nested from '../../form-designer/canvas/nested.vue'
import type { TableProps } from 'ant-design-vue'
import type { WidgetMap } from '@/types/fux-core/form'

const { config, fields } = defineProps<{
  config: WidgetMap['dataTable']
  fields?: any[]
}>()

const rendererCtx = useRendererInjection()
const appParams = injectLocal<Record<string, any>>('appParamsCtx')
const disabledForm = ref(false)
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

const getFormatter = (index: number) => {
  return config.props.columns?.[index]?.formatter
}

// dict
const dictTypes = config.props.columns
  ?.filter((item) => item.formatter?.type === 'dict')
  .map((item) => item.formatter!.value)
const dicts = useDict(...(dictTypes || []))

// custom
const renderColumn = (expression: string, record: any) => {
  return evalExpression(expression, record)
}

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
  if (!isProd.value) return
  loading.value = true
  console.log(urlPrefix)
  const api = `${urlPrefix}/page`
  const res = await requestLite.get({
    url: api,
    params: {
      declareId: appParams?.value.applyId || '',
      current: tableData.current
    }
  })
  tableData.list = res.list
  tableData.total = res.total
  loading.value = false
}

const get = async (id: string) => {
  const api = `${urlPrefix}/get-table-name?id=${id}`
  return await requestLite.get({ url: api })
}

onMounted(() => {
  loadData()
})

const onPageChange = () => {
  loadData()
}

const cancel = () => {
  visible.value = false
}

const toView = async (record: any) => {
  disabledForm.value = true
  modalFormData.value = await get(record.id)
  visible.value = true
}

useModelProvider(modalFormData)
</script>
