import { ref, computed, type Ref } from 'vue'
import dayjs from 'dayjs'
import useRequest from '@/hooks/use-request'
import { getPlanList, type ListQueryParams, type PlanVO } from '@/api/application/plan'
import type { FormInstance, TableProps } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'

export const columns: TableProps['columns'] = [
  { title: '计划名称', dataIndex: 'item', key: 'item', ellipsis: true },
  { title: '应用名称', dataIndex: 'appId', key: 'appId' },
  { title: '创建人', width: 120, dataIndex: 'creator' },
  {
    title: '开始时间',
    minWidth: 120,
    dataIndex: 'startTime',
    key: 'startTime',
    sortDirections: ['ascend', 'descend'],
    sorter: (a: PlanVO, b: PlanVO) => {
      return dayjs(a.startTime).isSameOrBefore(b.startTime) ? 1 : -1
    }
  },
  {
    title: '截止时间',
    minWidth: 120,
    dataIndex: 'endTime',
    key: 'endTime',
    sortDirections: ['ascend', 'descend'],
    sorter: (a: PlanVO, b: PlanVO) => {
      return dayjs(a.endTime).isSameOrBefore(b.endTime) ? 1 : -1
    }
  },
  { title: '操作', key: 'actions', width: 220 }
]

export const useTable = (formRef: Ref<FormInstance | undefined>) => {
  const queryParams = ref<ListQueryParams>({})

  const { data, execute, pending } = useRequest(
    () =>
      getPlanList({
        ...queryParams.value
      }),
    {
      immediate: true
    }
  )

  const pagination = computed<TablePaginationConfig>(() => ({
    pageSize: queryParams.value.pageSize,
    current: queryParams.value.pageNo,
    total: data.value?.total,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal(total, range) {
      return `第 ${range[0]}~${range[1]} 项 / 共 ${total} 项`
    }
  }))

  const onFilter = () => {
    queryParams.value.pageNo = 1
    execute()
  }

  const onFilterReset = () => {
    formRef.value?.resetFields()
    queryParams.value.pageNo = 1
    execute()
  }

  const onChange = ({ current, pageSize }: TablePaginationConfig) => {
    queryParams.value.pageNo = current
    queryParams.value.pageSize = pageSize

    execute()
  }

  return {
    data,
    execute,
    pending,
    queryParams,
    onChange,
    pagination,
    onFilter,
    onFilterReset
  }
}
