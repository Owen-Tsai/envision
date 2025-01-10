import { message } from 'ant-design-vue'
import { deleteRole, type RoleVO } from '@/api/system/role'

const useActions = (execute: () => void) => {
  const onDelete = (record: RoleVO) => {
    deleteRole(record.id!).then(() => {
      message.success('删除成功')
      execute()
    })
  }

  return { onDelete }
}

export default useActions
