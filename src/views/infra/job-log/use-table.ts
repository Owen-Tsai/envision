import { ref, computed, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import type { TableProps, FormInstance, TablePaginationConfig } from 'ant-design-vue'
import { getList, type ListQueryParams } from '@/api/infra/job/log'

export const columns: TableProps['columns'] = [
  { title: '日志编号', dataIndex: 'id', width: 100 },
  { title: '任务ID', dataIndex: 'jobID', width: 100 },
  { title: '处理器名称', dataIndex: 'handlerName' },
  { title: '处理器参数', dataIndex: 'handlerParam' },
  { title: '执行次数', dataIndex: 'executionIndex', width: 100 },
  { title: '执行时间', dataIndex: 'beginTime', width: 180 },
  { title: '执行时长', dataIndex: 'duration', width: 100 },
  { title: '执行状态', key: 'status', dataIndex: 'status', width: 100 },
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
