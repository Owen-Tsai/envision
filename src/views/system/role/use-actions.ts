import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { deleteRole, type RoleVO } from '@/api/system/role'

type PermissionType = 'menu' | 'data'

const useActions = (execute: () => void) => {
  const entry = ref<RoleVO>()
  const permissionType = ref<PermissionType>('data')
  const visible = reactive({
    edit: false,
    permissionConfig: false
  })

  const onEdit = (record?: RoleVO) => {
    entry.value = record
    visible.edit = true
  }

  const onSetPermission = (record: RoleVO, type: PermissionType) => {
    entry.value = record
    permissionType.value = type
    visible.permissionConfig = true
  }

  const onDelete = (record: RoleVO) => {
    deleteRole(record.id!).then(() => {
      message.success('删除成功')
      execute()
    })
  }

  return {
    entry,
    visible,
    permissionType,
    onDelete,
    onEdit,
    onSetPermission
  }
}

export default useActions
