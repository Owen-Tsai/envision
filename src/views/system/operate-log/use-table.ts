import useRequest from '@/hooks/use-request'
import type { TableProps, FormInstance, TablePaginationConfig } from 'ant-design-vue'
import { getOperateLogPage, type ListQueryParams } from '@/api/system/operate-log'

export const columns: TableProps['columns'] = [
  { key: 'id', title: '日志编号', dataIndex: 'id', width: 90 },
  { key: 'module', title: '操作模块', dataIndex: 'module', ellipsis: true },
  { key: 'name', title: '操作名', dataIndex: 'name', minWidth: 140 },
  { key: 'type', title: '操作类型', dataIndex: 'type', width: 90 },
  { key: 'userNickname', title: '操作人', dataIndex: 'userNickname', ellipsis: true, width: 90 },
  { key: 'resultCode', title: '操作结果', dataIndex: 'resultCode', width: 90 },
  { key: 'startTime', title: '操作时间', dataIndex: 'startTime', width: 120 },
  { key: 'duration', title: '执行时长', dataIndex: 'duration', width: 90 },
  { key: 'actions', title: '操作', width: 90 },
]

export const useTable = (formRef: Ref<FormInstance | undefined>) => {
  const queryParams = ref<ListQueryParams>({})

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

  const { data, pending, execute } = useRequest(() => getOperateLogPage(queryParams.value), {
    immediate: true,
  })

  const onFilter = () => {
    queryParams.value.pageNo = 1
    execute()
  }

  const onFilterReset = () => {
    queryParams.value.pageNo = 1
    formRef.value?.resetFields()
    execute()
  }

  return {
    data,
    pending,
    execute,
    queryParams,
    onFilter,
    onFilterReset,
    pagination,
    onChange,
  }
}
