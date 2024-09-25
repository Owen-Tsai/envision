import { ref, computed, type Ref } from 'vue'
import dayjs from 'dayjs'
import useRequest from '@/hooks/use-request'
import { getApplicationList, type ListQueryParams, type ApplicationVO } from '@/api/application'
import type { FormInstance, TableProps } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'

export const columns: TableProps['columns'] = [
  { title: '应用名称', dataIndex: 'name', key: 'name', ellipsis: true },
  { title: '应用类别', dataIndex: 'type', key: 'type' },
  { title: '创建人', width: 120, dataIndex: 'creator' },
  { title: '应用描述', width: 200, dataIndex: 'description', ellipsis: true },
  { title: '上架状态', width: 120, dataIndex: 'published', key: 'published' },
  {
    title: '创建时间',
    minWidth: 120,
    dataIndex: 'createTime',
    key: 'createTime',
    sortDirections: ['ascend', 'descend'],
    sorter: (a: ApplicationVO, b: ApplicationVO) => {
      return dayjs(a.createTime).isSameOrBefore(b.createTime) ? 1 : -1
    }
  },
  { title: '操作', key: 'actions', width: 220 }
]

export const useTable = (formRef: Ref<FormInstance | undefined>) => {
  const queryParams = ref<ListQueryParams>({})

  const { data, execute, pending } = useRequest(
    () =>
      getApplicationList({
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
