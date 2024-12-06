<template>
  <div v-if="isProd || config.props.state.mode === 'table'">
    <AFlex justify="end" class="mb-4">
      <AButton :icon="h(PlusOutlined)" @click="toAdd" :disabled="!isProd">新增</AButton>
    </AFlex>
    <ATable
      :columns="config.props.columns"
      :data-source="tableData.list"
      :pagination="pagination"
      @change="onPageChange"
    >
      <template #bodyCell="scope: TableScope<any>">
        <template v-if="scope?.column.formatter === 'date'">
          {{ dayjs(scope?.record[scope?.column.key]).format('YYYY-MM-DD') }}
        </template>
        <template v-if="scope?.column.key === 'actions'">
          <AFlex :gap="16">
            <ATypographyLink
              v-if="appParams?.currentAuditProcess == '-2' || appParams?.currentAuditProcess == '3'"
            >
              <div @click="toEdit(scope.record)">
                <EditOutlined />
                编辑
              </div>
            </ATypographyLink>
            <ATypographyLink
              v-if="
                appParams?.currentAuditProcess == '0' ||
                appParams?.currentAuditProcess == '1' ||
                appParams?.currentAuditProcess == '2'
              "
            >
              <div @click="toView(scope.record)">
                <EyeOutlined />
                查看
              </div>
            </ATypographyLink>
            <APopconfirm
              title="此操作不可撤销，确定要删除吗？"
              :overlay-style="{ width: '260px' }"
              @confirm="toDelete(scope.record)"
              v-if="appParams?.currentAuditProcess == '-2' || appParams?.currentAuditProcess == '3'"
            >
              <ATypographyLink type="danger">
                <DeleteOutlined />
                删除
              </ATypographyLink>
            </APopconfirm>
          </AFlex>
        </template>
      </template>
    </ATable>
    <AModal v-model:open="visible" :title="modalTitle" :width="config.props.formWidth">
      <AForm :model="modalFormData" :disabled="disabledForm">
        <WidgetRenderer
          v-for="child in config.props.widgets"
          :key="child.uid"
          :config="child"
          :fields="fields"
        />
      </AForm>
      <template #footer>
        <a-button
          key="back"
          @click="cancel"
          v-if="appParams?.currentAuditProcess == '-2' || appParams?.currentAuditProcess == '3'"
        >
          取消
        </a-button>
        <a-button
          key="submit"
          type="primary"
          @click="onSave"
          v-if="appParams?.currentAuditProcess == '-2' || appParams?.currentAuditProcess == '3'"
        >
          确定
        </a-button>
        <a-button
          key="submit"
          type="primary"
          @click="cancel"
          v-if="
            appParams?.currentAuditProcess == '0' ||
            appParams?.currentAuditProcess == '1' ||
            appParams?.currentAuditProcess == '2'
          "
        >
          关闭
        </a-button>
      </template>
    </AModal>
  </div>
  <div v-if="!isProd && config.props.state.mode === 'form'">
    <div class="draggable-area" :class="{ 'empty-slot': config.props.widgets.length <= 0 }">
      <Nested :widgets="config.props.widgets" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from 'vue'
import { injectLocal } from '@vueuse/core'
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons-vue'
import request from '@/utils/request'
import { useModelProvider, useRendererInjection } from '../../_hooks'
import WidgetRenderer from '../index.vue'
import Nested from '../../form-designer/canvas/nested.vue'
import type { TableProps } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import type { WidgetMap } from '@/types/fux-core/form'
import { set } from 'lodash-es'
import dayjs from 'dayjs'

const { config, fields } = defineProps<{
  config: WidgetMap['dataTable']
  fields?: any[]
}>()

const rendererCtx = useRendererInjection()
const appParams = injectLocal('appParamsCtx')
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
  const res = await request.get({
    url: api,
    params: {
      declareId: appParams.value.applyId ? appParams.value.applyId : '',
      current: tableData.current
    }
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

const onSave = async () => {
  const api = `${urlPrefix}/${modalEditMode.value}`
  loading.value = true

  // console.log(index)
  const urlPrefixArr = urlPrefix?.split('/')
  const tableName = urlPrefixArr[urlPrefixArr?.length - 1]
  // console.log(tableName)
  set(modalFormData.value, tableName + ':declare_id', appParams.value.applyId)
  // return
  let res
  if (modalEditMode.value === 'update') {
    res = await request.put({ url: api, data: modalFormData.value })
  } else {
    res = await request.post({ url: api, data: modalFormData.value })
  }
  if (res.executeResult == 1) {
    message.success(res.message)
  } else {
    message.error(res.message)
  }
  modalFormData.value = {}
  visible.value = false
  await loadData()
}

const cancel = () => {
  visible.value = false
}

const toAdd = () => {
  disabledForm.value = false
  modalEditMode.value = 'create'
  modalFormData.value = {}
  visible.value = true
}

const toEdit = async (record: any) => {
  disabledForm.value = false
  modalEditMode.value = 'update'
  modalFormData.value = await get(record.id)
  console.log(modalFormData.value)
  visible.value = true
}

const toDelete = async (record: any) => {
  const api = `${urlPrefix}/delete?id=${record.id}`
  await request.delete({ url: api })
  message.success('删除成功！')
  await loadData()
}

const toView = async (record: any) => {
  disabledForm.value = true
  modalFormData.value = await get(record.id)
  visible.value = true
}

useModelProvider(modalFormData)
</script>
