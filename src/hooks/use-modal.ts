import type { FormInstance } from 'ant-design-vue'

type Props = {
  open: boolean
  [key: string]: any
}

const useModalOpen = (
  props: Props,
  emit: (evt: 'update:open', ...args: any[]) => void,
  formInstance?: Ref<FormInstance | null | undefined>,
) => {
  watch(
    () => props.open,
    (val) => {
      if (!val && formInstance?.value) {
        formInstance.value?.resetFields()
      }
    },
  )

  return computed({
    get: () => props.open,
    set: (val) => emit('update:open', val),
  })
}

export default useModalOpen
