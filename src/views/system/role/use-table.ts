import { ref, computed, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import { getRolesList, type ListQueryParams } from '@/api/system/role'
import type { FormInstance, TableProps } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'

export const columns: TableProps['columns'] = [
  { key: 'id', title: '编号', dataIndex: 'id', width: 60 },
  { key: 'name', title: '角色名称', dataIndex: 'name' },
  { key: 'code', title: '角色标识', dataIndex: 'code' },
  { key: 'status', title: '状态', dataIndex: 'status' },
  { key: 'remark', title: '备注', dataIndex: 'remark' },
  { key: 'createTime', title: '创建时间', dataIndex: 'createTime' },
  { key: 'actions', title: '操作', dataIndex: 'actions', width: 240 },
]

export const useTable = (filterFormRef: Ref<FormInstance | undefined>) => {
  const queryParams = ref<ListQueryParams>({})

  const { data, pending, execute } = useRequest(() => getRolesList(queryParams.value), {
    immediate: true,
  })

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

  const onFilter = () => {
    queryParams.value.pageNo = 1
    execute()
  }

  const onFilterReset = () => {
    filterFormRef.value?.resetFields()
    queryParams.value.pageNo = 1
    execute()
  }

  return {
    data,
    pending,
    execute,
    pagination,
    queryParams,
    onFilter,
    onFilterReset,
    onChange,
  }
}
