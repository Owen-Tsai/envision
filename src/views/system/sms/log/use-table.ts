import { ref, computed, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import type { TableProps, FormInstance, TablePaginationConfig } from 'ant-design-vue'
import { getList, type ListQueryParams } from '@/api/system/sms/log'

export const columns: TableProps['columns'] = [
  { key: 'id', title: '编号', dataIndex: 'id', width: 60 },
  { key: 'mobile', title: '手机号', dataIndex: 'mobile', width: 140 },
  { title: '模板内容', dataIndex: 'templateContent', width: 240, ellipsis: true },
  { key: 'sendStatus', title: '发送状态', dataIndex: 'sendStatus' },
  { key: 'channelCode', title: '短信渠道', dataIndex: 'channelCode' },
  { key: 'templateCode', title: '模板编号', dataIndex: 'templateCode' },
  { key: 'sendTime', title: '发送时间', dataIndex: 'sendTime' },
  { key: 'templateType', title: '短信类型', dataIndex: 'templateType' },
  { key: 'actions', title: '操作', fixed: 'right', width: 80 }
]

export const useTable = (formRef: Ref<FormInstance>) => {
  const queryParams = ref<ListQueryParams>({})

  const { data, pending, execute } = useRequest(() => getList(queryParams.value), {
    immediate: true
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
    }
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
    onFilterReset
  }
}
