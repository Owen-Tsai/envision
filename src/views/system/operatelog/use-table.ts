import { ref, computed, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import type { TableProps, FormInstance, TablePaginationConfig } from 'ant-design-vue'
import { getOperateLogPage, type ListQueryParams } from '@/api/system/operatelog'

export const columns: TableProps['columns'] = [
  { key: 'id', title: '日志编号', dataIndex: 'id' },
  { key: 'module', title: '操作模块', dataIndex: 'module' },
  { key: 'name', title: '操作名', dataIndex: 'name' },
  { key: 'javaMethod', title: '操作类型', dataIndex: 'javaMethod' },
  { key: 'userNickname', title: '操作人', dataIndex: 'userNickname' },
  { key: 'resultCode', title: '操作结果', dataIndex: 'resultCode' },
  { key: 'startTime', title: '操作时间', dataIndex: 'startTime' },
  { key: 'duration', title: '执行时长', dataIndex: 'duration' },
  { key: 'actions', title: '操作' }
]

export const useTable = (formRef: Ref<FormInstance>) => {
  const queryParams = ref<ListQueryParams>({})

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

  const onChange = ({ current, pageSize }: TablePaginationConfig) => {
    queryParams.value.pageNo = current
    queryParams.value.pageSize = pageSize

    execute()
  }

  const { data, pending, execute } = useRequest(() => getOperateLogPage(queryParams.value), {
    immediate: true
  })

  const onFilter = () => {
    execute()
  }

  const onFilterReset = () => {
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
    onChange
  }
}
