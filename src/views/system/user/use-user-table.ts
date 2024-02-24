import { ref } from 'vue'
import { useToggle } from '@vueuse/core'
import useRequest from '@/hooks/use-request'
import { getUsers, type ListQueryParams } from '@/api/system/user'
import type { TableProps } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'

export const columns: TableProps['columns'] = [
  { key: 'userId', title: '编号', dataIndex: 'userId', width: 60 },
  { key: 'userName', title: '用户账号', dataIndex: 'userName' },
  { key: 'nickName', title: '用户名称', dataIndex: 'nickName' },
  { key: 'deptName', title: '所属部门' },
  { key: 'phonenumber', title: '已绑定手机', dataIndex: 'phonenumber' },
  { key: 'status', title: '状态' },
  { key: 'createTime', title: '注册时间', dataIndex: 'createTime' },
  { key: 'actions', title: '操作' }
]

export const useUserTable = () => {
  const [filterExpanded, toggle] = useToggle(false)

  const queryParams = ref<ListQueryParams>({})
  const dateRange = ref<[Dayjs, Dayjs]>()

  const { data, pending, execute } = useRequest(() => getUsers(queryParams.value), {
    immediate: true
  })

  return {
    data,
    pending,
    execute,
    queryParams,
    dateRange,
    filterExpanded,
    toggle
  }
}
