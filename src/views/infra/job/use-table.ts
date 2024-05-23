import { ref, computed, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import { getJobList, type ListQueryParams } from '@/api/infra/job'
import type { FormInstance, TableProps } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'

export const columns: TableProps['columns'] = [
  { title: '任务ID', dataIndex: 'id', width: 80 },
  { title: '任务名称', dataIndex: 'name' },
  { title: '任务状态', dataIndex: 'status', key: 'status' },
  { title: '处理器名称', dataIndex: 'handlerName' },
  { title: '处理器参数', dataIndex: 'handlerParam' },
  { title: 'CRON表达式', dataIndex: 'cronExpression' },
  { title: '操作', width: 220 }
]

export const useTable = (formRef: Ref<FormInstance | undefined>) => {
  const queryParams = ref<ListQueryParams>({})

  const { data, execute, pending } = useRequest(
    () =>
      getJobList({
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
