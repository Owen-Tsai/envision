import useRequest from '@/hooks/use-request'
import { getList, type ListQueryParams } from '@/api/information'
import type { FormInstance, TableProps } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'

export const columns: TableProps['columns'] = [
  { key: 'id', title: '编号', dataIndex: 'id', width: 80 },
  { key: 'title', title: '资讯标题', dataIndex: 'title', width: 260 },
  { key: 'creator', title: '创建人', dataIndex: 'creator', width: 80 },
  { key: 'createTime', title: '创建时间', dataIndex: 'createTime', width: 120 },
  { key: 'auditadminid', title: '审核人', dataIndex: 'auditadminid', width: 80 },
  { key: 'audittime', title: '审核时间', dataIndex: 'audittime', width: 120 },
  { key: 'actions', title: '操作', dataIndex: 'actions', width: 200 },
]

export const useTable = (filterFormRef: Ref<FormInstance | null>) => {
  const queryParams = ref<ListQueryParams>({})

  const { data, pending, execute } = useRequest(() => getList(), { immediate: true })

  const pagination = computed<TablePaginationConfig>(() => ({
    pageSize: queryParams.value.pageSize,
    current: queryParams.value.pageNo,
    total: data.value?.total,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal(total, range) {
      return `第 ${range[0]}~${range[1]} 项 / 共 ${total} 项`
    },
  }))

  const onChange = ({ current, pageSize }: TablePaginationConfig) => {
    queryParams.value.pageNo = current
    queryParams.value.pageSize = pageSize

    execute()
  }

  const onFilter = () => {
    queryParams.value.pageNo = 1
    execute()
  }

  const onFilterReset = () => {
    filterFormRef.value?.resetFields()
    queryParams.value.pageNo = 1
    execute()
  }

  return {
    data,
    pending,
    execute,
    pagination,
    queryParams,
    onFilter,
    onFilterReset,
    onChange,
  }
}
