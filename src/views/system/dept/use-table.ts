import { ref, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import type { TableProps, FormInstance } from 'ant-design-vue'
import { getDeptTree, type TreeQueryParams } from '@/api/system/dept'
import { getSimpleUserList, type SimpleUserListVO } from '@/api/system/user'

export const columns: TableProps['columns'] = [
  { key: 'name', title: '部门名称', dataIndex: 'name' },
  { key: 'leaderUserId', title: '负责人', dataIndex: 'leaderUserId' },
  { key: 'sort', title: '排序', dataIndex: 'sort' },
  { key: 'status', title: '状态', dataIndex: 'status' },
  { key: 'createTime', title: '创建时间', dataIndex: 'createTime' },
  { key: 'actions', title: '操作' },
]

export const useTable = (formRef: Ref<FormInstance>) => {
  const queryParams = ref<TreeQueryParams>({})
  const userList = ref<SimpleUserListVO>()

  const { data, pending, execute } = useRequest(() => getDeptTree(queryParams.value), {
    immediate: true,
  })

  getSimpleUserList().then((users) => {
    userList.value = users
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
    userList,
    pending,
    execute,
    queryParams,
    onFilter,
    onFilterReset,
  }
}
