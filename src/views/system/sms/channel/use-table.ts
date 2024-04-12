import { ref, computed, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import type { TableProps, FormInstance, TablePaginationConfig } from 'ant-design-vue'
import { getChannelList, type ListQueryParams } from '@/api/system/sms/channel'

export const columns: TableProps['columns'] = [
  { key: 'id', title: '编号', dataIndex: 'id' },
  { key: 'signature', title: '渠道名称', dataIndex: 'signature' },
  { key: 'code', title: '渠道编码', dataIndex: 'code' },
  { key: 'status', title: '状态', dataIndex: 'status' },
  { key: 'apiKey', title: 'API Key', dataIndex: 'apiKey' },
  { key: 'createTime', title: '创建时间', dataIndex: 'createTime' },
  { key: 'actions', title: '操作' }
]

export const useTable = (formRef: Ref<FormInstance>) => {
  const queryParams = ref<ListQueryParams>({})

  const { data, pending, execute } = useRequest(() => getChannelList(queryParams.value), {
    immediate: true
  })

  const onFilter = () => {
    execute()
  }

  const onFilterReset = () => {
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
