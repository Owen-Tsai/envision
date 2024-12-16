import { ref, computed, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import type { TableProps, FormInstance, TablePaginationConfig } from 'ant-design-vue'
import { getLoginLogPage, type ListQueryParams } from '@/api/system/login-log'

export const columns: TableProps['columns'] = [
  { key: 'id', title: '日志编号', dataIndex: 'id', width: 120 },
  { key: 'logType', title: '操作类型', dataIndex: 'logType', width: 120 },
  { key: 'username', title: '用户账号', dataIndex: 'username' },
  { key: 'userIp', title: '登录地址', dataIndex: 'userIp' },
  { key: 'result', title: '登录结果', dataIndex: 'result', width: 120 },
  { key: 'startTime', title: '操作时间', dataIndex: 'createTime', width: 180 },
  { key: 'actions', title: '操作', width: 120 },
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

  const { data, pending, execute } = useRequest(() => getLoginLogPage(queryParams.value), {
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
