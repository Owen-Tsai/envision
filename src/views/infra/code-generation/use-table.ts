import { ref, computed, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import {
  getCodeGenConfigList,
  type ListQueryParams,
  type TableVO
} from '@/api/infra/code-generation'
import type { FormInstance, TableProps } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'

export const columns: TableProps['columns'] = [
  { title: '数据源', width: 90, dataIndex: 'dataSource' },
  { title: '表名称', dataIndex: 'name' },
  { title: '表描述', dataIndex: 'type' },
  { title: '实体', dataIndex: 'status' },
  {
    title: '创建时间',
    minWidth: 140,
    dataIndex: 'createTime',
    sortDirections: ['ascend', 'descend'],
    sorter: (a: TableVO, b: TableVO) => {
      return b.createTime! - a.createTime!
    }
  },
  {
    title: '更新时间',
    minWidth: 140,
    dataIndex: 'updateTime',
    sortDirections: ['ascend', 'descend'],
    sorter: (a: TableVO, b: TableVO) => {
      return b.updateTime! - a.updateTime!
    }
  },
  { key: 'actions', title: '操作', width: 240 }
]

export const useTable = (formRef: Ref<FormInstance | undefined>) => {
  const queryParams = ref<ListQueryParams>({})

  const { data, execute, pending } = useRequest(
    () =>
      getCodeGenConfigList({
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
