<template>
  <div v-if="isProd || config.props.state.mode === 'table'">
    <ATable
      :columns="config.props.columns"
      :data-source="tableData.list"
      :pagination="pagination"
      @change="onPageChange"
    >
      <template #bodyCell="scope: TableScope<any>">
        <template v-if="getFormatter((scope?.column as any).idx)?.type === 'dict'">
          <EDictTag :dict-object="getDictData((scope?.column as any).idx)" :value="scope.text" />
        </template>
        <template v-if="getFormatter((scope?.column as any).idx)?.type === 'custom'">
          {{ renderColumn(getFormatter((scope?.column as any).idx)?.value!, scope.record) }}
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
    <AModal v-model:open="visible" :title="modalTitle" :width="config.props.formWidth">
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
import request from '@/utils/request'
import { useModelProvider, useRendererInjection } from '../../_hooks'
import useDict from '@/hooks/use-dict'
import WidgetRenderer from '../index.vue'
import Nested from '../../form-designer/canvas/nested.vue'
import type { TableProps } from 'ant-design-vue'
import type { WidgetMap } from '@/types/fux-core/form'
import dayjs from 'dayjs'
import safeEval from 'safer-eval'

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
  current: 1,
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
      total: tableData.total,
    }
  }

  return false
})

const getFormatter = (colIdx: number) => {
  const targetColumn = config.props.columns?.find((col) => (col as any).idx === colIdx)
  // console.log(targetColumn)
  return targetColumn ? targetColumn.formatter : null
}

const getDictData = (colIdx: number) => {
  // console.log(dicts)
  const dictType = getFormatter(colIdx)?.value
  const idx = dictType ? dictTypes.value?.findIndex((e) => e === dictType) : -1
  // console.log(dictType, idx, idx !== undefined && dicts[idx])
  return idx !== undefined && idx >= 0 ? dicts[idx].value : []
}

// dict
const dictTypes = ref(
  config.props.columns
    ?.filter((item) => item.formatter?.type === 'dict')
    .map((item) => item.formatter!.value),
)
// console.log(dictTypes.value)
const dicts = useDict(...(dictTypes.value || []))

// custom
const renderColumn = (expression: string, record: any) => {
  return safeEval(expression, { ...record, Date: Date, dayjs: dayjs })
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
  const res = await request.get({
    url: api,
    params: {
      declareId: appParams?.value.applyId || '',
      current: tableData.current,
    },
  })
  tableData.list = res.list
  tableData.total = res.total
  loading.value = false
}

const get = async (id: string) => {
  const api = `${urlPrefix}/get-table-name?id=${id}`
  return await request.get({ url: api })
}

onMounted(() => {
  loadData()
})

const onPageChange = () => {
  loadData()
}

const toView = async (record: any) => {
  disabledForm.value = true
  modalFormData.value = await get(record.id)
  visible.value = true
}

useModelProvider(modalFormData)
</script>
