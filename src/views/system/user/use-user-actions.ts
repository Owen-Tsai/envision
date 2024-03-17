import { ref, type Ref } from 'vue'
import type { UserDTO } from '@/api/system/user'
import type { UserRoleDTO } from '@/api/system/permission'

export const usePasswordReset = (
  entryId: Ref<number | undefined>,
  entryName: Ref<string | undefined>
) => {
  const formData = ref<Pick<UserDTO, 'password'>>({})
  const modalVisible = ref(false)

  const showModal = (id: number, name: string) => {
    entryId.value = id
    entryName.value = name
    modalVisible.value = true
  }

  return {
    formData,
    modalVisible,
    showModal
  }
}

export const useAddOrUpdate = (entryId: Ref<number | undefined>) => {
  const formData = ref<UserDTO>({})
  const modalVisible = ref(false)

  const showModal = (id?: number) => {
    entryId.value = id
    modalVisible.value = true
  }

  return {
    formData,
    modalVisible,
    showModal
  }
}

export const useRoleConfig = (
  entryId: Ref<number | undefined>,
  entryName: Ref<string | undefined>
) => {
  const formData = ref<UserRoleDTO>({
    roleIds: []
  })
  const modalVisible = ref(false)

  const showModal = (id: number, name: string) => {
    entryId.value = id
    entryName.value = name
    modalVisible.value = true
  }

  return {
    formData,
    modalVisible,
    showModal
  }
}
