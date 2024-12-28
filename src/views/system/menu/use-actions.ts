import { message } from 'ant-design-vue'
import useStorage from '@/hooks/use-storage'
import { deleteMenu, type MenuVO } from '@/api/system/menu'

type Action = 'add' | 'edit'

const useActions = (requestData: () => void) => {
  const storage = useStorage('sessionStorage')
  const entry = ref<MenuVO | undefined>()
  const visible = ref(false)
  const mode = ref<Action>('add')

  const onEdit = (action: Action, record?: MenuVO) => {
    mode.value = action
    entry.value = record
    visible.value = true
  }

  const onDelete = (record: MenuVO) => {
    deleteMenu(record.id!).then(() => {
      message.success('删除成功')
      requestData()
    })
  }

  const onClearCache = () => {
    storage.delete('permission-info')
    window.location.reload()
  }

  return {
    entry,
    visible,
    mode,
    onEdit,
    onDelete,
    onClearCache,
  }
}

export default useActions
