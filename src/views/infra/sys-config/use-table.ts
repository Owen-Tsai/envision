import { ref, computed, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import { getConfigList, type ListQueryParams } from '@/api/infra/sys-config'
import type { FormInstance, TableProps } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'

export const columns: TableProps['columns'] = [
  { title: '参数名称', dataIndex: 'name' },
  { title: '参数键名', dataIndex: 'key' },
  { title: '参数键值', dataIndex: 'value' },
  { title: '是否可见', width: 100, dataIndex: 'visible', key: 'visible' },
  { title: '备注', dataIndex: 'remark', ellipsis: true, width: 200 },
  {
    title: '创建时间',
    width: 160,
    dataIndex: 'createTime',
    key: 'createTime'
  },
  { title: '操作', width: 160 }
]

export const useTable = (formRef: Ref<FormInstance | undefined>) => {
  const queryParams = ref<ListQueryParams>({})

  const { data, execute, pending } = useRequest(
    () =>
      getConfigList({
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
