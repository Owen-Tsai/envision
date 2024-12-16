import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { deletePost, type PostVO } from '@/api/system/post'

const useActions = (requestData: () => void) => {
  const entry = ref<PostVO | undefined>()
  const visible = ref(false)

  const onEdit = (record?: PostVO) => {
    entry.value = record
    visible.value = true
  }

  const onDelete = (record: PostVO) => {
    deletePost(record.id!).then(() => {
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
