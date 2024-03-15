import { ref, computed, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import type { TableProps, FormInstance, TablePaginationConfig } from 'ant-design-vue'
import { getDeptPageTree, getDeptTree, QueryParams, type QueryParamsPage } from '@/api/system/dept'

export const columns: TableProps['columns'] = [
  { key: 'title', title: '部门名称', dataIndex: 'title' },
  { key: 'leaderUserId', title: '负责人', dataIndex: 'leaderUserId' },
  { key: 'sort', title: '排序', dataIndex: 'sort' },
  { key: 'status', title: '状态', dataIndex: 'status' },
  { key: 'createTime', title: '创建时间', dataIndex: 'createTime' },
  { key: 'actions', title: '操作' }
]

export const useTable = (formRef: Ref<FormInstance>) => {
  const queryParamsPage = ref<QueryParamsPage>({})

  const queryParams = ref<QueryParams>({})

  // const pagination = computed<TablePaginationConfig>(() => ({
  //     pageSize: queryParams.value.pageSize,
  //     current: queryParams.value.pageNo,
  //     total: data.value?.total,
  //     showQuickJumper: true,
  //     showSizeChanger: true,
  //     showTotal(total, range) {
  //         return `第 ${range[0]}~${range[1]} 项 / 共 ${total} 项`
  //     }
  // }))

  const { data, pending, execute } = useRequest(() => getDeptTree(queryParams.value), {
    immediate: true
  })

  const onFilter = () => {
    execute()
  }

  const onFilterReset = () => {
    formRef.value?.resetFields()
    execute()
  }

  return {
    data,
    pending,
    execute,
    queryParams,
    onFilter,
    onFilterReset
  }
}
