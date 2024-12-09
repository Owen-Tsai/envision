import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { deleteAttachClass, type AttachClassVO } from '@/api/application/attach-class'

const useActions = (requestData: () => void) => {
  const entry = ref<AttachClassVO | undefined>()
  const visible = ref(false)

  const onEdit = (record?: AttachClassVO) => {
    entry.value = record
    visible.value = true
  }

  const onDelete = (record: AttachClassVO) => {
    deleteAttachClass(record.id!).then(() => {
      message.success('删除成功')
      requestData()
    })
  }

  return {
    entry,
    visible,
    onEdit,
    onDelete
  }
}

export default useActions
