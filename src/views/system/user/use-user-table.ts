import useRequest from '@/hooks/use-request'
import { getUsers, type ListQueryParams } from '@/api/system/user'
import type { TableProps, FormInstance } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'

export const columns: TableProps['columns'] = [
  { key: 'id', title: '编号', dataIndex: 'id', width: 120 },
  { key: 'username', title: '用户账号', dataIndex: 'username', width: 120 },
  { key: 'nickname', title: '用户名称', dataIndex: 'nickname', width: 160 },
  { key: 'deptName', title: '所属部门', dataIndex: 'deptName', width: 120 },
  { key: 'mobile', title: '已绑定手机', dataIndex: 'mobile' },
  { key: 'status', title: '状态' },
  { key: 'createTime', title: '注册时间', dataIndex: 'createTime' },
  { key: 'actions', title: '操作', fixed: 'right', width: 140 },
]

export const useUserTable = (formRef: Ref<FormInstance | null>) => {
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

  const onFilter = () => {
    queryParams.value.pageNo = 1
    execute()
  }

  const onFilterReset = () => {
    formRef.value?.resetFields()
    queryParams.value.pageNo = 1
    execute()
  }

  const { data, pending, execute } = useRequest(() => getUsers(queryParams.value), {
    immediate: true,
  })

  return {
    data,
    pending,
    execute,
    queryParams,
    pagination,
    onChange,
    onFilter,
    onFilterReset,
  }
}
