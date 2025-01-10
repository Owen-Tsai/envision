import { message } from 'ant-design-vue'
import useStorage from '@/hooks/use-storage'
import { deleteMenu, type MenuVO } from '@/api/system/menu'

const useActions = (requestData: () => void) => {
  const storage = useStorage('sessionStorage')

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
    onDelete,
    onClearCache,
  }
}

export default useActions
