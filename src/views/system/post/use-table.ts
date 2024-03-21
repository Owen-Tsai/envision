import { ref, computed, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import type { TableProps, FormInstance, TablePaginationConfig } from 'ant-design-vue'
import { getPostPage, type QueryParams, type QueryParamsPage } from '@/api/system/post'

export const columns: TableProps['columns'] = [
  { key: 'id', title: '岗位编号', dataIndex: 'id' },
  { key: 'name', title: '岗位名称', dataIndex: 'name' },
  { key: 'code', title: '岗位编码', dataIndex: 'code' },
  { key: 'sort', title: '岗位顺序', dataIndex: 'sort' },
  { key: 'remark', title: '岗位备注', dataIndex: 'remark' },
  { key: 'status', title: '状态', dataIndex: 'status' },
  { key: 'createTime', title: '状态时间', dataIndex: 'createTime' },
  { key: 'actions', title: '操作' }
]

export const useTable = (formRef: Ref<FormInstance>) => {
  const queryParamsPage = ref<QueryParamsPage>({})

  const queryParams = ref<QueryParams>({})

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

  const { data, pending, execute } = useRequest(() => getPostPage(queryParamsPage.value), {
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
    queryParamsPage,
    onFilter,
    onFilterReset,
    pagination
  }
}
