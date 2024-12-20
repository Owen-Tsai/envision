import useRequest from '@/hooks/use-request'
import type { TableProps, FormInstance, TablePaginationConfig } from 'ant-design-vue'
import { getList, type ListQueryParams } from '@/api/system/message/log'

export const columns: TableProps['columns'] = [
  { key: 'id', title: '编号', dataIndex: 'id', width: 60 },
  { key: 'userType', title: '用户类型', dataIndex: 'userType' },
  { key: 'userId', title: '用户ID', dataIndex: 'userId', width: 60 },
  { key: 'templateCode', title: '模板编码', dataIndex: 'templateCode' },
  { key: 'templateNickname', title: '发送方', dataIndex: 'templateNickname' },
  { title: '站内信内容', dataIndex: 'templateContent', width: 240, ellipsis: true },
  { key: 'readStatus', title: '是否已读', dataIndex: 'readStatus' },
  { key: 'sendTime', title: '发送时间', dataIndex: 'sendTime' },
  { key: 'readTime', title: '阅读时间', dataIndex: 'readTime' },
  { key: 'actions', title: '操作', fixed: 'right', width: 60 },
]

export const useTable = (formRef: Ref<FormInstance>) => {
  const queryParams = ref<ListQueryParams>({})

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

  return {
    data,
    pending,
    execute,
    pagination,
    queryParams,
    onChange,
    onFilter,
    onFilterReset,
  }
}
