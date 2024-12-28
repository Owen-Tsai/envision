import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { deleteApplication, setPublished, type ApplicationVO } from '@/api/application'

const useActions = (requestData: () => void) => {
  const entry = ref<ApplicationVO | undefined>()
  const visible = ref(false)

  // const { push } = useRouter()

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
    window.open(`${window.origin}/workflow/${record.id}`)
  }

  const onSetPublished = (record: ApplicationVO, published: boolean) => {
    setPublished(record.id!, published).then(() => {
      message.success('操作成功')
      requestData()
    })
  }

  return {
    entry,
    visible,
    onEdit,
    onDelete,
    onSetPublished,
    toDesignPage,
  }
}

export default useActions
