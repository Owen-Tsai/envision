import { ref, type Ref } from 'vue'
import useRequest from '@/hooks/use-request'
import { getMenuTree, type TreeQueryParams } from '@/api/system/menu'
import type { TableProps, FormInstance } from 'ant-design-vue'

export const columns: TableProps['columns'] = [
  { key: 'name', title: '菜单名称', dataIndex: 'name', width: 150, fixed: 'left' },
  { key: 'type', title: '类型', dataIndex: 'type', width: 80 },
  { key: 'sort', title: '排序', dataIndex: 'sort', width: 80 },
  { key: 'status', title: '状态', dataIndex: 'status', width: 80 },
  { key: 'path', title: '路由', dataIndex: 'path' },
  { key: 'permission', title: '权限标识', dataIndex: 'permission' },
  { key: 'component', title: '组件路径', dataIndex: 'component' },
  { key: 'componentName', title: '组件名称', dataIndex: 'componentName' },
  { key: 'actions', title: '操作', fixed: 'right', width: 220 },
]

export const useTable = (formRef: Ref<FormInstance>) => {
  const { data, pending, execute } = useRequest(() => getMenuTree(), { immediate: true })

  const queryParams = ref<TreeQueryParams>({})

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
    onFilterReset,
  }
}
