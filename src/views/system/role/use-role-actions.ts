import { ref, type Ref } from 'vue'
import type { RoleVO } from '@/api/system/role'

export const useRoleConfig = (entry: Ref<RoleVO>) => {
  const modalVisible = ref(false)

  const showDialog = (id?: number) => {
    entry.value.id = id
    modalVisible.value = true
  }

  return {
    modalVisible,
    showDialog
  }
}

export const usePermissionConfig = (entry: Ref<RoleVO>) => {
  const visible = ref(false)
  const mode = ref<'menu' | 'data'>('menu')

  const showDialog = (row: RoleVO, formType: 'menu' | 'data') => {
    entry.value = row
    mode.value = formType
    visible.value = true
  }

  return {
    mode,
    visible,
    showDialog
  }
}
