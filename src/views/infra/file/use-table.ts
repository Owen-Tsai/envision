import { ref, computed, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import { getFileList, type ListQueryParams } from '@/api/infra/file'
import type { FormInstance, TableProps } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'

export const columns: TableProps['columns'] = [
  { title: '文件ID', dataIndex: 'id', width: 120 },
  { title: '文件名', ellipsis: true, dataIndex: 'name' },
  { title: '文件路径', ellipsis: true, dataIndex: 'path' },
  { title: '文件类型', dataIndex: 'type', width: 120 },
  { title: '预览', width: 160, key: 'preview' },
  {
    title: '创建时间',
    width: 160,
    dataIndex: 'createTime',
    key: 'createTime',
  },
  { title: '操作', width: 90 },
]

export const useTable = (formRef: Ref<FormInstance | undefined>) => {
  const queryParams = ref<ListQueryParams>({})

  const { data, execute, pending } = useRequest(
    () =>
      getFileList({
        ...queryParams.value,
      }),
    {
      immediate: true,
    },
  )

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
    onFilterReset,
  }
}
