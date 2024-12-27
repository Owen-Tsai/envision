import { ref, computed, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import { getList, type ListQueryParams } from '@/api/business/audit'
import type { FormInstance, TableProps } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'
import { useRoute } from 'vue-router'

export const columns: TableProps['columns'] = [
  // { key: 'id', title: '编号', dataIndex: 'id', width: 60 },
  { key: 'comApplyName', title: '申报名称', dataIndex: 'comApplyName' },
  { key: 'startUser', title: '申请人姓名', dataIndex: 'startUser' },
  // { key: 'membertype', title: '申请人类型', dataIndex: 'membertype' },
  { key: 'taskName', title: '当前流程', dataIndex: 'taskName' },
  { key: 'auditProcess', title: '审核状态', dataIndex: 'auditProcess' },
  { key: 'startTime', title: '提交时间', dataIndex: 'startTime' },
  { key: 'actions', title: '操作', dataIndex: 'actions', width: 240 },
]

export const useTable = (filterFormRef: Ref<FormInstance | undefined>) => {
  const route = useRoute()

  const queryParams = ref<ListQueryParams>({})
  const { data, pending, execute } = useRequest(
    () => getList(route.query.taskDefKey as any, route.params.appId as string),
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
