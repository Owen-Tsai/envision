import { ref, computed, type Ref } from 'vue'
import dayjs, { type Dayjs } from 'dayjs'
import useRequest from '@/hooks/use-request'
import { getList, type ListQueryParams, type ListItemVO } from '@/api/system/dict/type'
import { formatDateRange } from '@/utils/date-time'
import type { FormInstance, TableProps } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'

export const columns: TableProps['columns'] = [
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

export const useTable = (formRef: Ref<FormInstance | undefined>) => {
  const queryParams = ref<ListQueryParams>({})
  const dateRange = ref<[Dayjs, Dayjs]>()

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

  const onFilter = () => {
    queryParams.value.pageNum = 1
    execute()
  }

  const onFilterReset = () => {
    formRef.value?.resetFields()
    dateRange.value = undefined
    execute()
  }

  const onChange = ({ current, pageSize }: TablePaginationConfig) => {
    queryParams.value.pageNum = current
    queryParams.value.pageSize = pageSize

    execute()
  }

  return {
    data,
    execute,
    pending,
    queryParams,
    onChange,
    dateRange,
    pagination,
    onFilter,
    onFilterReset
  }
}
