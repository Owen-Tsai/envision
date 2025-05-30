import { ref, computed, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import type { TableProps, FormInstance, TablePaginationConfig } from 'ant-design-vue'
import { getList, type ListQueryParams } from '@/api/infra/api-log/access-log'

export const columns: TableProps['columns'] = [
  { key: 'id', title: '日志编号', dataIndex: 'id', width: 100 },
  { key: 'userId', title: '操作类型', dataIndex: 'userId', width: 100 },
  { key: 'userType', title: '用户类型', dataIndex: 'userType', width: 100 },
  { key: 'applicationType', title: '应用类型', dataIndex: 'applicationType' },
  { key: 'requestUrl', title: '请求地址' },
  { key: 'beginTime', title: '请求时间', dataIndex: 'beginTime', width: 180 },
  { key: 'duration', title: '执行时长', dataIndex: 'duration', width: 100 },
  { key: 'actions', title: '操作', width: 100 },
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

  const { data, pending, execute } = useRequest(() => getList(queryParams.value), {
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
