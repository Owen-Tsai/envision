import { ref, computed, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import type { TableProps, FormInstance, TablePaginationConfig } from 'ant-design-vue'
import { getLoginLogPage, type ListQueryParams } from '@/api/system/loginlog'

export const columns: TableProps['columns'] = [
  { key: 'id', title: '日志编号', dataIndex: 'id' },
  { key: 'logType', title: '操作类型', dataIndex: 'logType' },
  { key: 'username', title: '用户名称', dataIndex: 'username' },
  { key: 'userIp', title: '登陆地址', dataIndex: 'userIp' },
  { key: 'userAgent', title: '浏览器', dataIndex: 'userAgent' },
  { key: 'result', title: '登陆结果', dataIndex: 'result' },
  { key: 'createTime', title: '登陆日期', dataIndex: 'createTime' },
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

  const { data, pending, execute } = useRequest(() => getLoginLogPage(queryParams.value), {
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
