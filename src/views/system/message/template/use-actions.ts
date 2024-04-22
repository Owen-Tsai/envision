import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { deleteTemplate, type TemplateVO } from '@/api/system/message/template'

const useActions = (requestData: () => void) => {
  const entry = ref<TemplateVO | undefined>()
  const visible = ref(false)

  const onEdit = (record?: TemplateVO) => {
    entry.value = record
    visible.value = true
  }

  const onDelete = (record: TemplateVO) => {
    deleteTemplate(record.id!).then(() => {
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
