import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { deleteApplication, type ApplicationVO } from '@/api/system/application'

const useActions = (requestData: () => void) => {
  const entry = ref<ApplicationVO | undefined>()
  const visible = ref(false)

  const { push } = useRouter()

  const onEdit = (record?: ApplicationVO) => {
    entry.value = record
    visible.value = true
  }

  const onDelete = (record: ApplicationVO) => {
    deleteApplication(record.id!).then(() => {
      message.success('删除成功')
      requestData()
    })
  }

  const toDesignPage = (record: ApplicationVO) => {
    push(`/workflow/${record.id}`)
  }

  return {
    entry,
    visible,
    onEdit,
    onDelete,
    toDesignPage
  }
}

export default useActions
