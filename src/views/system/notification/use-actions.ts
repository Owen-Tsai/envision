import { message } from 'ant-design-vue'
import { deleteNotification, type NotificationVO } from '@/api/system/notification'

const useActions = (requestData: () => void) => {
  const entry = ref<NotificationVO | undefined>()
  const visible = ref(false)

  const onEdit = (record?: NotificationVO) => {
    entry.value = record
    visible.value = true
  }

  const onDelete = (record: NotificationVO) => {
    deleteNotification(record.id!).then(() => {
      message.success('删除成功')
      requestData()
    })
  }

  return {
    entry,
    visible,
    onEdit,
    onDelete,
  }
}

export default useActions
