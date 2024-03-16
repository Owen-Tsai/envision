import { ref } from 'vue'
import type { UserDTO } from '@/api/system/user'

export const usePasswordReset = () => {
  const formData = ref<Pick<UserDTO, 'password'>>({})
  const modalVisible = ref(false)
  const entryId = ref<number | undefined>()
  const entryName = ref<string | undefined>()

  const showModal = (id: number, name: string) => {
    entryId.value = id
    entryName.value = name
    modalVisible.value = true
  }

  return {
    formData,
    modalVisible,
    entryId,
    entryName,
    showModal
  }
}

export const useAddOrUpdate = () => {
  const formData = ref<UserDTO>({})
  const modalVisible = ref(false)
  const entryId = ref<number | undefined>()

  const showModal = (id?: number) => {
    entryId.value = id
    modalVisible.value = true
  }

  return {
    formData,
    modalVisible,
    entryId,
    showModal
  }
}
