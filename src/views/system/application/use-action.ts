import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { type ApplicationVO } from '@/api/system/application'

const useActions = (requestData: () => void) => {
  const entry = ref<ApplicationVO | undefined>()
  const visible = ref(false)

  const { push } = useRouter()

  const onEdit = (record?: ApplicationVO) => {
    entry.value = record
    visible.value = true
  }

  const onDelete = (record: ApplicationVO) => {
    // deleteDictType(record.id!).then(() => {
    //   message.success('删除成功')
    //   requestData()
    // })
  }

  return {
    entry,
    visible,
    onEdit,
    onDelete
  }
}

export default useActions
