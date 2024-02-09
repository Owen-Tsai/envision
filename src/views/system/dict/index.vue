<template>
  <div class="p-4 lg:px-8 lg:py-4">
    <ACard>
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-filter-form"
        :class="{ expanded: filterExpanded }"
        :model="queryParams"
      >
        <ARow :gutter="[0, 16]">
          <ACol :lg="8" :span="24">
            <AFormItem label="字典名称" name="dictName">
              <AInput
                v-model:value="queryParams.dictName"
                placeholder="请输入字典名称"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="字典类型" name="dictType">
              <AInput
                v-model:value="queryParams.dictType"
                placeholder="请输入字典类型"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="字典状态" name="status">
              <ASelect v-model:value="queryParams.status"></ASelect>
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="创建时间">
              <ARangePicker v-model:value="dateRange" format="YYYY-MM-DD" />
            </AFormItem>
          </ACol>
          <ACol :lg="{ span: 8, offset: filterExpanded ? 8 : 0 }" :span="24">
            <AFlex justify="end" align="center" :gap="16">
              <AButton @click="onFilterReset">重置</AButton>
              <AButton type="primary" @click="onFilter">查询</AButton>
              <ATypographyLink @click="toggle()">
                {{ filterExpanded ? '收起' : '展开' }}
                <DownOutlined :class="{ 'rotate-180': filterExpanded }" />
              </ATypographyLink>
            </AFlex>
          </ACol>
        </ARow>
      </AForm>
    </ACard>

    <ACard title="字典类型" class="mt-4">
      <template #extra>
        <AFlex :gap="8">
          <AButton type="primary" @click="showDialog('add')">
            <template #icon>
              <PlusOutlined />
            </template>
            新增
          </AButton>
          <ATooltip title="导出">
            <AButton type="text" :loading="pending">
              <template #icon>
                <ExportOutlined />
              </template>
            </AButton>
          </ATooltip>
          <ATooltip title="重新载入">
            <AButton type="text" :loading="pending" @click="execute">
              <template #icon>
                <ReloadOutlined />
              </template>
            </AButton>
          </ATooltip>
        </AFlex>
      </template>

      <div class="overflow-x-auto">
        <ATable
          :columns="columns"
          :data-source="data?.rows"
          :loading="pending"
          :pagination="pagination"
          @change="onChange"
        >
          <template #bodyCell="scope">
            <template v-if="scope!.column.dataIndex === 'status'">
              <EDictTag :dict-object="dictDisable" :value="scope?.text" />
            </template>
            <template v-if="scope!.column.title === '操作'">
              <AFlex :gap="16">
                <ATypographyLink @click="showDialog('edit')">
                  <EditOutlined /> 编辑
                </ATypographyLink>
                <ATypographyLink> <DeleteOutlined /> 删除 </ATypographyLink>
              </AFlex>
            </template>
          </template>
        </ATable>
      </div>
    </ACard>

    <AModal
      v-model:visible="dialog.visible"
      :title="dialog.isAdd ? '新增字典类型' : '编辑字典类型'"
      :confirm-loading="modalActionLoading"
      :cancel-loading="modalActionLoading"
      @ok="onSubmit"
      @cancel="dialog.visible = false"
    >
      <AForm ref="modalForm" :label-col="{ span: 6 }" :model="formData">
        <AFormItem label="字典名称" name="dictName">
          <AInput v-model:value="formData.dictName" />
        </AFormItem>
        <AFormItem label="字典类型" name="dictType">
          <AInput v-model:value="formData.dictType" />
        </AFormItem>
        <AFormItem label="状态" name="status">
          <ARadioGroup v-model:value="formData.status">
            <ARadio v-for="item in dictDisable" :key="item.dictValue" :value="item.dictValue">{{
              item.dictLabel
            }}</ARadio>
          </ARadioGroup>
        </AFormItem>
        <AFormItem label="备注" name="remark">
          <ATextarea v-model:value="formData.remark" />
        </AFormItem>
      </AForm>
    </AModal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import dayjs, { type Dayjs } from 'dayjs'
import { useToggle } from '@vueuse/core'
import {
  DownOutlined,
  ReloadOutlined,
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'
import useRequest from '@/hooks/use-request'
import useDict from '@/hooks/use-dict'
import {
  getList,
  addType,
  updateType,
  type ListQueryParams,
  type ListItemVO,
  type TypeDTO
} from '@/api/system/dict/type'
import { formatDateRange } from '@/utils/date-time'
import { type TableProps, type FormInstance, notification } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'

const columns: TableProps['columns'] = [
  { title: '字典编号', width: 90, dataIndex: 'dictId' },
  { title: '字典名称', minWidth: 120, dataIndex: 'dictName' },
  { title: '字典类别', minWidth: 120, dataIndex: 'dictType' },
  { title: '字典状态', minWidth: 48, dataIndex: 'status' },
  { title: '备注', minWidth: 120, dataIndex: 'remark' },
  {
    title: '创建时间',
    minWidth: 120,
    dataIndex: 'createTime',
    sortDirections: ['ascend', 'descend'],
    sorter: (a: ListItemVO, b: ListItemVO) => {
      return dayjs(a.createTime).isSameOrBefore(b.createTime) ? 1 : -1
    }
  },
  { title: '操作', width: 160 }
]

const [filterExpanded, toggle] = useToggle(false)

const { sys_normal_disable: dictDisable } = useDict('sys_normal_disable')

const queryParams = ref<ListQueryParams>({})
const dateRange = ref<[Dayjs, Dayjs]>()

const filterForm = ref<FormInstance>()
const modalForm = ref<FormInstance>()

const dialog = ref({
  isAdd: true,
  visible: false
})

const formData = ref<TypeDTO>({
  dictName: '',
  dictType: '',
  status: '0'
})

const { data, execute, pending } = useRequest(
  () =>
    getList({
      ...queryParams.value,
      params: formatDateRange(dateRange.value)
    }),
  {
    immediate: true
  }
)

const modalActionCbk = () => {
  dialog.value.visible = false
  notification.success({ message: '保存成功' })
  execute()
}

const { execute: doAdd, pending: addPending } = useRequest(() => addType(formData.value), {
  onSuccess: modalActionCbk
})

const { execute: doUpdate, pending: updatePending } = useRequest(() => updateType(formData.value), {
  onSuccess: modalActionCbk
})

const modalActionLoading = computed(() => addPending.value || updatePending.value)

const pagination = computed<TablePaginationConfig>(() => ({
  pageSize: queryParams.value.pageSize,
  current: queryParams.value.pageNum,
  total: data.value?.total,
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal(total, range) {
    return `第 ${range[0]}~${range[1]} 项 / 共 ${total} 项`
  }
}))

const onChange = ({ current, pageSize }: TablePaginationConfig) => {
  queryParams.value.pageNum = current
  queryParams.value.pageSize = pageSize

  execute()
}

const onFilter = () => {
  queryParams.value.pageNum = 1
  execute()
}

const onFilterReset = () => {
  filterForm.value?.resetFields()
  dateRange.value = undefined
  execute()
}

const showDialog = (mode: 'edit' | 'add') => {
  dialog.value.isAdd = mode === 'add'
  modalForm.value?.resetFields()
  dialog.value.visible = true
}

const onSubmit = () => {
  modalForm.value?.validate().then(() => {
    if (dialog.value.isAdd) {
      doAdd()
    } else {
      doUpdate()
    }
  })
}
</script>
