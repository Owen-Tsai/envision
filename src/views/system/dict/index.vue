<template>
  <div class="px-8 py-4">
    <ACard>
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-filter-form"
        :class="{ expanded: filterExpanded }"
        :model="queryParams"
      >
        <ARow>
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
        <AFlex>
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
              <ATypographyLink> <EditOutlined /> 编辑 </ATypographyLink>
              <ATypographyLink> <DeleteOutlined /> 删除 </ATypographyLink>
            </AFlex>
          </template>
        </template>
      </ATable>
    </ACard>
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
  DeleteOutlined
} from '@ant-design/icons-vue'
import useRequest from '@/hooks/use-request'
import useDict from '@/hooks/use-dict'
import { getList, type ListQueryParams, type ListItemVO } from '@/api/system/dict/type'
import { formatDateRange } from '@/utils/date-time'
import type { TableProps, FormInstance } from 'ant-design-vue'
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
</script>
