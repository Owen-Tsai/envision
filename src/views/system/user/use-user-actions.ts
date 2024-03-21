import { ref, type Ref } from 'vue'

export const usePasswordReset = (
  entryId: Ref<number | undefined>,
  entryName: Ref<string | undefined>
) => {
  const modalVisible = ref(false)

  const showModal = (id: number, name: string) => {
    entryId.value = id
    entryName.value = name
    modalVisible.value = true
  }

  return {
    modalVisible,
    showModal
  }
}

export const useAddOrUpdate = (entryId: Ref<number | undefined>) => {
  const modalVisible = ref(false)

  const showModal = (id?: number) => {
    entryId.value = id
    modalVisible.value = true
  }

  return {
    modalVisible,
    showModal
  }
}

export const useRoleConfig = (
  entryId: Ref<number | undefined>,
  entryName: Ref<string | undefined>
) => {
  const modalVisible = ref(false)

  const showModal = (id: number, name: string) => {
    entryId.value = id
    entryName.value = name
    modalVisible.value = true
  }

  return {
    modalVisible,
    showModal
  }
}
