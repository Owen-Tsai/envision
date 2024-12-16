import { ref, computed, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import type { TableProps, FormInstance, TablePaginationConfig } from 'ant-design-vue'
import { getTemplateList, type ListQueryParams } from '@/api/system/sms/template'

export const columns: TableProps['columns'] = [
  { key: 'name', title: '模板名称', dataIndex: 'name', fixed: 'left', width: 160 },
  { key: 'code', title: '模板编码', dataIndex: 'code', width: 180 },
  { title: '模板内容', dataIndex: 'content', width: 220, ellipsis: true },
  { key: 'type', title: '短信类型', dataIndex: 'type' },
  { key: 'status', title: '状态', dataIndex: 'status' },
  { key: 'channelCode', title: '短信渠道', dataIndex: 'channelCode', width: 160 },
  { key: 'createTime', title: '创建时间', dataIndex: 'createTime' },
  { key: 'actions', title: '操作', fixed: 'right', width: 140 },
]

export const useTable = (formRef: Ref<FormInstance>) => {
  const queryParams = ref<ListQueryParams>({})

  const { data, pending, execute } = useRequest(() => getTemplateList(queryParams.value), {
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
